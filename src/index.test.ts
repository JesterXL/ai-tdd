import { describe, it, expect } from 'vitest'
import { APIGatewayEvent, Person, QueryParameters, healthCheck, safeParsePeople } from "."
import { Result } from 'neverthrow'


describe('Lambda GET API', () => {
    describe('healthCheck', () => {
        it('should respond with a 200', async () => {
            const result = await healthCheck()
            expect(result.statusCode).toBe(200)
        })
    })
    describe('safeParsePeople', () => {
        it('should parse some people from some JSON in a happy path', () => {
            const personA:Person = {
                firstName: 'Jesse',
                lastName: 'Warden',
                species: 'Human'
            }
            const personB:Person = {
                firstName: 'Brandy',
                lastName: 'Fortune',
                species: 'Human'
            }
            const people:Person[] = [ personA, personB ]
            const peopleJSON:string = JSON.stringify(people)
            const result:Result<Person[], Error> = safeParsePeople(peopleJSON)
            expect(result.isOk()).toBe(true)
        })
        it('should fail to parse bad JSON in an unhappy path', () => {
            const badCowJSON:string = JSON.stringify('🐄')
            const result:Result<Person[], Error> = safeParsePeople(badCowJSON)
            expect(result.isErr()).toBe(true)
        })
    })
})