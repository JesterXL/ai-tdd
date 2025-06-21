import { describe, it, expect } from 'vitest'
import { healthCheck, readJSON } from '.'
describe("index.ts", () => {
    
    describe('/health', () => {
        it('should send a 200', async () => {
            const result = await healthCheck()
            expect(result.isOk())
        })
    })

    describe('readJSON', () => {
        it('should read JSON from disk in a happy path', async () => {
            const stubFS = (_path:string) => Promise.resolve(JSON.stringify({ foo: 'bar' }))
            const result = await readJSON(stubFS, 'test.json')
            if(result.isOk()) {
                expect(result.value.foo).toBe('bar')
            } else {
                throw new Error('wrong type')
            }
        })
        it('should fail to read JSON from disk in an unhappy path', async () => {
            const stubBadFS = (_path:string) => Promise.reject(new Error('unit test: failed to read file'))
            const result = await readJSON(stubBadFS, 'test.json')
            expect(result.isErr()).toBe(true)
        })
    })
    
})