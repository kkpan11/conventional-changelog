import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const dirname = fileURLToPath(new URL('.', import.meta.url))
const COMMIT_HASH_LENGTH = 7

export async function createWriterOpts() {
  const [
    template,
    header,
    commit
  ] = await Promise.all([
    readFile(resolve(dirname, './templates/template.hbs'), 'utf-8'),
    readFile(resolve(dirname, './templates/header.hbs'), 'utf-8'),
    readFile(resolve(dirname, './templates/commit.hbs'), 'utf-8')
  ])
  const writerOpts = getWriterOpts()

  writerOpts.mainTemplate = template
  writerOpts.headerPartial = header
  writerOpts.commitPartial = commit

  return writerOpts
}

function getWriterOpts() {
  return {
    transform: (commit) => {
      if (!commit.pr) {
        return undefined
      }

      let { tag } = commit

      if (commit.tag === 'BUGFIX') {
        tag = 'Bug Fixes'
      } else if (commit.tag === 'CLEANUP') {
        tag = 'Cleanup'
      } else if (commit.tag === 'FEATURE') {
        tag = 'Features'
      } else if (commit.tag === 'DOC') {
        tag = 'Documentation'
      } else if (commit.tag === 'SECURITY') {
        tag = 'Security'
      } else {
        return undefined
      }

      const shortHash = typeof commit.hash === 'string'
        ? commit.hash.substring(0, COMMIT_HASH_LENGTH)
        : commit.shortHash

      return {
        tag,
        shortHash
      }
    },
    groupBy: 'tag',
    commitGroupsSort: 'title',
    commitsSort: [
      'tag',
      'taggedAs',
      'message'
    ]
  }
}
