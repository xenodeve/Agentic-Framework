import { describe, expect, test } from 'bun:test'
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { buildManifest, collectSkills, parseSkillFile } from './generate-skills'

async function makeTree(files: Record<string, string>): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), 'skills-fixture-'))
  for (const [rel, body] of Object.entries(files)) {
    const full = path.join(root, rel)
    await mkdir(path.dirname(full), { recursive: true })
    await writeFile(full, body, 'utf8')
  }
  return root
}

function skill(name: string | null, description: string | null, triggers?: string[]): string {
  let fm = '---\n'
  if (name) fm += `name: ${name}\n`
  if (description) fm += `description: ${description}\n`
  if (triggers) fm += `triggers:\n${triggers.map((t) => `  - ${t}`).join('\n')}\n`
  return `${fm}---\n\n# body\n`
}

describe('parseSkillFile', () => {
  test('slug comes from frontmatter name; description and triggers are parsed', () => {
    const parsed = parseSkillFile(skill('t4-bro', 'A description.', ['x', 'y']), 'fallback')
    expect(parsed).toEqual({ slug: 't4-bro', description: 'A description.', triggers: ['x', 'y'] })
  })

  test('a missing name falls back to the directory basename', () => {
    const parsed = parseSkillFile(skill(null, 'D.'), 'fallback-dir')
    expect(parsed.slug).toBe('fallback-dir')
  })

  test('missing description and triggers default to empty', () => {
    const parsed = parseSkillFile(skill('only-name', null), 'fallback-dir')
    expect(parsed.description).toBe('')
    expect(parsed.triggers).toEqual([])
  })
})

describe('collectSkills', () => {
  test('slug, family (top-level directory) and deterministic order', async () => {
    const root = await makeTree({
      'ask-xeno/SKILL.md': skill('ask-xeno', 'Top entry.'),
      'design/using-design/SKILL.md': skill('using-design', 'Design family entry.'),
      'design/design-audit/SKILL.md': skill('design-audit', 'Audit.', ['audit a page']),
      't4/using-t4/SKILL.md': skill('using-t4', 'T4 entry.'),
    })
    expect(await collectSkills(root)).toEqual([
      { slug: 'ask-xeno', family: null, description: 'Top entry.', triggers: [] },
      { slug: 'design-audit', family: 'design', description: 'Audit.', triggers: ['audit a page'] },
      { slug: 'using-design', family: 'design', description: 'Design family entry.', triggers: [] },
      { slug: 'using-t4', family: 't4', description: 'T4 entry.', triggers: [] },
    ])
  })

  test('a deeply nested skill keeps the top-level directory as its family', async () => {
    const root = await makeTree({
      'family-x/deep/nested/SKILL.md': skill('nested-skill', 'D.'),
    })
    expect(await collectSkills(root)).toEqual([
      { slug: 'nested-skill', family: 'family-x', description: 'D.', triggers: [] },
    ])
  })

  test('an empty tree yields no skills', async () => {
    const root = await makeTree({})
    expect(await collectSkills(root)).toEqual([])
  })
})

describe('buildManifest', () => {
  test('counts skills and carries provenance fields', async () => {
    const root = await makeTree({
      'a/SKILL.md': skill('a', 'A.'),
      'b/c/SKILL.md': skill('c', 'C.'),
    })
    const manifest = buildManifest(await collectSkills(root), {
      generatedFrom: root,
      sourceCommit: 'abc123',
      generatedAt: '2026-09-02T00:00:00.000Z',
    })
    expect(manifest).toEqual({
      generatedFrom: root,
      sourceCommit: 'abc123',
      generatedAt: '2026-09-02T00:00:00.000Z',
      count: 2,
      skills: [
        { slug: 'a', family: null, description: 'A.', triggers: [] },
        { slug: 'c', family: 'b', description: 'C.', triggers: [] },
      ],
    })
  })
})
