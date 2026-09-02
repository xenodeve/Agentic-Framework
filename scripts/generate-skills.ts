import { spawnSync } from 'node:child_process'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import type { GeneratedSkill, SkillsManifest } from '../src/lib/skills'

export function parseSkillFile(content: string, fallbackSlug: string): Omit<GeneratedSkill, 'family'> {
  const { data } = matter(content)
  return {
    slug: typeof data.name === 'string' && data.name !== '' ? data.name : fallbackSlug,
    description: typeof data.description === 'string' ? data.description : '',
    triggers: Array.isArray(data.triggers) ? data.triggers.map((t) => String(t)) : [],
  }
}

async function findSkillFiles(dir: string): Promise<string[]> {
  const out: string[] = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await findSkillFiles(full)))
    else if (entry.name === 'SKILL.md') out.push(full)
  }
  return out
}

export async function collectSkills(sourceRoot: string): Promise<GeneratedSkill[]> {
  const skills = await Promise.all(
    (await findSkillFiles(sourceRoot)).map(async (file) => {
      const content = await readFile(file, 'utf8')
      const dirSegments = path.relative(sourceRoot, path.dirname(file)).split(path.sep)
      return {
        ...parseSkillFile(content, path.basename(path.dirname(file))),
        // family = the top-level directory under the source root; standalone skills have none
        family: dirSegments.length > 1 ? dirSegments[0] : null,
      }
    }),
  )
  skills.sort((a, b) => a.slug.localeCompare(b.slug))
  return skills
}

export function buildManifest(
  skills: GeneratedSkill[],
  opts: { generatedFrom: string; sourceCommit: string | null; generatedAt: string },
): SkillsManifest {
  return {
    generatedFrom: opts.generatedFrom,
    sourceCommit: opts.sourceCommit,
    generatedAt: opts.generatedAt,
    count: skills.length,
    skills,
  }
}

const SOURCE = 'D:/Github/xeno-skills/skills'
const OUT = path.join(process.cwd(), 'content', 'skills.generated.json')

const main = async () => {
  let sourceCommit: string | null = null
  try {
    const r = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: path.dirname(SOURCE) })
    if (r.status === 0) sourceCommit = r.stdout.toString().trim() || null
  } catch {
    sourceCommit = null
  }
  const manifest = buildManifest(await collectSkills(SOURCE), {
    generatedFrom: SOURCE,
    sourceCommit,
    generatedAt: new Date().toISOString(),
  })
  await mkdir(path.dirname(OUT), { recursive: true })
  await writeFile(OUT, JSON.stringify(manifest, null, 2) + '\n', 'utf8')
  console.log(
    `wrote ${OUT}: ${manifest.count} skills from ${SOURCE} @ ${sourceCommit ?? 'unknown commit'} (${manifest.generatedAt})`,
  )
}

if (import.meta.main) {
  main().catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
}
