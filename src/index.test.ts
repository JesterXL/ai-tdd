import { describe, it, expect } from 'vitest'
import { APIGatewayEvent, Person, QueryParameters, healthCheck, safeParsePeople, readPeopleFromDisk, writePeopleToDisk } from "."
import { Result } from 'neverthrow'
import { promises as fs } from 'fs'

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
    describe('readPeopleFromDisk', () => {
        it('should read people JSON from disk in a happy path', async () => {
            const stubFS = {
                readFile: (_filepath:string, _encoding:string) =>
                    Promise.resolve(
                        JSON.stringify(
                            [
                                { firstName: 'Jesse', lastName: 'Warden', species: 'Human'}
                            ]
                        )
                    )
            } as Pick<typeof fs, 'readFile'>
            const result = await readPeopleFromDisk('people.json', stubFS as typeof fs)
            expect(result.isOk()).toBe(true)
        })
        it('should fail to read people JSON from disk in an unhappy path when the file fails to read', async () => {
            const stubUnhappyFS = {
                readFile: (_filepath:string, _encoding:string) =>
                    Promise.reject(new Error('unit test: failed to read file'))
            } as Pick<typeof fs, 'readFile'>
            const result = await readPeopleFromDisk('people.json', stubUnhappyFS as typeof fs)
            expect(result.isErr()).toBe(true)
        })
    })
    describe('writePeopleToDisk', () => {
        it('it should write people JSON string to disk in a happy path', async () => {
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

            const stubFS = {
                writeFile: (_filepath:string, _content:string, _encoding:string) =>
                    Promise.resolve(undefined)
            } as Pick<typeof fs, 'writeFile'>

            const result = await writePeopleToDisk('people.json', peopleJSON, stubFS as typeof fs)
            expect(result.isOk()).toBe(true)
        })
        it('it should fail to write people JSON string to disk in an unhappy path', async () => {
            const fixture = JSON.stringify([])
            const fsUnhappyStub = {
                writeFile: (_filepath:string, _content:string, _encoding:string) =>
                    Promise.reject(new Error('unit test: failed to write'))
            } as Pick<typeof fs, 'writeFile'>

            const result = await writePeopleToDisk('people.json', fixture, fsUnhappyStub as typeof fs)
            expect(result.isErr()).toBe(true)
        })
    })
})