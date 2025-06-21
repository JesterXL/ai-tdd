import { describe, it, expect } from 'vitest'
import { healthCheck, Person, readJSON, readPeople } from '.'
import { Result, ResultAsync } from 'neverthrow'
describe("index.ts", () => {
    
    describe('/health', () => {
        it('should send a 200', async () => {
            const result = await healthCheck()
            expect(result.isOk())
        })
    })

    describe('readJSON', () => {
        it('should read JSON from disk in a happy path', async () => {
            type FooBar = { foo: string }
            const stubFS = (_path:string) => Promise.resolve(JSON.stringify({ foo: 'bar' }))
            const result = await readJSON(stubFS, 'test.json')
            if(result.isOk()) {
                const foobar = result.value as FooBar
                expect(foobar.foo).toBe('bar')
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
    describe('readPeople', () => {
        it('should read people in a happy path', async () => {
            const jesse:Person = {
                firstName: { firstName: 'Jesse'},
                lastName: { lastName: 'Warden' },
                age: { age: 45 }
            }
            const people:Person[] = [ jesse ]
            const peopleJSON:string = JSON.parse(JSON.stringify(people))
            const stubReadJSON = (_path:string) => Promise.resolve(peopleJSON)
            const result:Result<Person[], Error> = await readPeople(stubReadJSON)
            console.log("result:", result)
            if(result.isOk()) {
                const first:Person | undefined = result.value[0]
                expect(first).toBeDefined()
                expect(first.firstName.firstName).toBe('Jesse')
            } else {
                throw new Error('wrong result type')
            }
        })

        it('should fail to read people in an unhappy path', async () => {
            const stubReadJSONUnhappy = (_path:string) => Promise.reject(new Error('unit test: error'))
            const result:Result<Person[], Error> = await readPeople(stubReadJSONUnhappy)
            expect(result.isErr()).toBe(true)
        })
    })
    
})