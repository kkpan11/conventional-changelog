import { describe, beforeAll, beforeEach, it, expect } from 'vitest'
import fs from 'fs/promises'
import path from 'path'
import Handlebars from 'handlebars'

let template: any
let templateContext: any

describe('conventional-changelog-writer', () => {
  describe('templates', () => {
    describe('header', () => {
      beforeAll(async () => {
        template = await fs.readFile(path.resolve(__dirname, './header.hbs'), 'utf8')
      })

      beforeEach(() => {
        templateContext = {
          version: 'my version'
        }
      })

      it('should generate header if `isPatch` is truthy', () => {
        templateContext.isPatch = true

        const log = Handlebars.compile(template)(templateContext)

        expect(log).toBe('## <small>my version</small>\n')
      })

      it('should generate header if `isPatch` is falsy', () => {
        templateContext.isPatch = false

        const log = Handlebars.compile(template)(templateContext)

        expect(log).toBe('## my version\n')
      })

      it('should generate header if `title` is truthy', () => {
        templateContext.title = 'my title'

        const log = Handlebars.compile(template)(templateContext)

        expect(log).toBe('## my version "my title"\n')
      })

      it('should generate header if `date` is truthy', () => {
        templateContext.date = 'my date'

        const log = Handlebars.compile(template)(templateContext)

        expect(log).toBe('## my version (my date)\n')
      })
    })
  })
})
