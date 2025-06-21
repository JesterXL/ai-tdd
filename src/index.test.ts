import { describe, it, expect } from 'vitest'
import { healthCheck } from '.'
describe("index.ts", () => {
    
    describe('/health', () => {
        it('should send a 200', async () => {
            const result = await healthCheck()
            expect(result.isOk())
        })
    })
    
})