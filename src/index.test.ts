import { describe, it, expect } from 'vitest'
import { APIGatewayEvent, QueryParameters, healthCheck } from "."


describe('Lambda GET API', () => {
    describe('healthCheck', () => {
        it('should respond with a 200', async () => {
            const result = await healthCheck()
            expect(result.statusCode).toBe(200)
        })
    })
})