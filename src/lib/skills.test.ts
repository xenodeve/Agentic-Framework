import { expect, test } from 'bun:test'
import { joinSkills } from './skills'
import type { SkillsManifest, SkillsMetaFile } from './skills'

const manifest: SkillsManifest = {
  generatedFrom: 'fixture',
  sourceCommit: null,
  generatedAt: '2026-09-02T00:00:00.000Z',
  count: 5,
  skills: [
    { slug: 'with-story', family: 'design', description: 'D1', triggers: [] },
    { slug: 'inheriting', family: 'design', description: 'D2', triggers: [] },
    { slug: 'orphan', family: null, description: 'D3', triggers: [] },
    { slug: 'borrower', family: 't4', description: 'D4', triggers: [] },
    { slug: 'no-target', family: 't4', description: 'D5', triggers: [] },
  ],
}

const meta: SkillsMetaFile = {
  families: {
    design: {
      label: 'Design',
      originStory: { problem: 'FP', attempt: 'FA', effectiveness: 'FE', date: '2026-01-01', source: 'design-suite' },
    },
  },
  skills: {
    'with-story': {
      originStory: { problem: 'P1', attempt: 'A1', effectiveness: 'E1' },
      featured: true,
    },
    borrower: { inheritFrom: 'with-story' },
    'no-target': { inheritFrom: 'nowhere' },
  },
}

const joined = joinSkills(manifest, meta)
// join order follows the manifest order above
const [withStory, inheriting, orphan, borrower, noTarget] = joined

test('an own meta story wins and sets featured', () => {
  expect(withStory.originStory?.problem).toBe('P1')
  expect(withStory.inheritedFrom).toBeUndefined()
  expect(withStory.featured).toBe(true)
})

test('a skill with no meta entry inherits its family story', () => {
  expect(inheriting.originStory?.problem).toBe('FP')
  expect(inheriting.originStory?.source).toBe('design-suite')
  expect(inheriting.inheritedFrom).toBe('design')
  expect(inheriting.featured).toBe(false)
})

test('a standalone skill with no meta has no story and does not crash', () => {
  expect(orphan.originStory).toBeUndefined()
  expect(orphan.inheritedFrom).toBeUndefined()
  expect(orphan.featured).toBe(false)
})

test('inheritFrom can point at another skill slug', () => {
  expect(borrower.originStory?.problem).toBe('P1')
  expect(borrower.inheritedFrom).toBe('with-story')
})

test('an unresolvable inheritFrom leaves the story empty', () => {
  expect(noTarget.originStory).toBeUndefined()
  expect(noTarget.inheritedFrom).toBeUndefined()
})
