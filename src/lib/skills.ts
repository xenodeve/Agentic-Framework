import manifest from '../../content/skills.generated.json'
import meta from '../../content/skills.meta.json'

/** One skill, parsed from the xeno-skills SKILL.md frontmatter (content/skills.generated.json). */
export type GeneratedSkill = {
  slug: string
  /** top-level directory under the skills root; null for standalone skills */
  family: string | null
  description: string
  triggers: string[]
}

export type SkillsManifest = {
  generatedFrom: string
  sourceCommit: string | null
  generatedAt: string
  count: number
  skills: GeneratedSkill[]
}

export type OriginStory = {
  problem: string
  attempt: string
  effectiveness: string
  date?: string
  source?: string
}

export type SkillMetaEntry = {
  originStory?: OriginStory
  /** override the default inherit target (the skill's own family) */
  inheritFrom?: string
  featured?: boolean
}

export type FamilyMetaEntry = {
  label?: string
  originStory?: OriginStory
}

export type SkillsMetaFile = {
  families: Record<string, FamilyMetaEntry>
  skills: Record<string, SkillMetaEntry>
}

export type SiteSkill = GeneratedSkill & {
  originStory?: OriginStory
  /** slug of the skill or family whose story this skill shows; undefined when the story is its own or there is none */
  inheritedFrom?: string
  featured: boolean
}

const siteManifest = manifest as unknown as SkillsManifest
const siteMeta = meta as unknown as SkillsMetaFile

export function joinSkills(manifestIn: SkillsManifest, metaIn: SkillsMetaFile): SiteSkill[] {
  const storyOf = (slug: string): OriginStory | undefined =>
    metaIn.skills[slug]?.originStory ?? metaIn.families[slug]?.originStory

  return manifestIn.skills.map((skill) => {
    const entry = metaIn.skills[skill.slug]
    let originStory: OriginStory | undefined
    let inheritedFrom: string | undefined
    if (entry?.originStory) {
      originStory = entry.originStory
    } else {
      const target = entry?.inheritFrom ?? skill.family
      if (target) {
        originStory = storyOf(target)
        if (originStory) inheritedFrom = target
      }
    }
    return { ...skill, originStory, inheritedFrom, featured: entry?.featured ?? false }
  })
}

export const skills: SiteSkill[] = joinSkills(siteManifest, siteMeta)

/** display label per family slug (falls back to the slug itself) */
export const familyLabels: Record<string, string> = Object.fromEntries(
  Object.entries(siteMeta.families).map(([slug, fam]) => [
    slug,
    fam.label ?? slug,
  ]),
)

export function getSkill(slug: string): SiteSkill | undefined {
  return skills.find((s) => s.slug === slug)
}
