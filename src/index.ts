import { okAsync, ResultAsync } from "neverthrow";
import { z } from "zod";

export const healthCheck = ():ResultAsync<boolean, never> =>
    okAsync(true)

export const readJSON = (
    fsReadFile: (path: string) => Promise<string>, 
    path: string
): ResultAsync<unknown, Error> =>
    ResultAsync.fromPromise(
        fsReadFile(path).then(content => JSON.parse(content)),
        (error) => error instanceof Error ? error : new Error(String(error))
    )

export type Person = {
    firstName: FirstName
    lastName: LastName
    age: Age
}

type FirstName = {
    firstName: string
}
type LastName = {
    lastName: string
}
type Age = {
    age: number
}

export const readPeople = (
    readJSONFunc: (path: string) => Promise<unknown>
): ResultAsync<Person[], Error> =>
    ResultAsync.fromPromise(
        readJSONFunc('people.json').then(data => data as Person[]),
        (error) => error instanceof Error ? error : new Error(String(error))
    )

export const savePeople = (
    writeFileFunc: (path: string, data: string) => Promise<unknown>,
    people: Person[]
): ResultAsync<unknown, Error> =>
    ResultAsync.fromPromise(
        writeFileFunc('people.json', JSON.stringify(people)),
        (error) => error instanceof Error ? error : new Error(String(error))
    )

export const QueryParametersSchema = z.object({
    offset: z.number().int(),
    limit: z.number().int()
})

export const EventSchema = z.object({
    queryParameters: QueryParametersSchema
})

export type QueryParameters = z.infer<typeof QueryParametersSchema>
export type Event = z.infer<typeof EventSchema>

export const getPeople = async (
    readPeopleFunc: () => Promise<Person[]>,
    event: Event
): Promise<{ statusCode: number; body: string }> => {
    const people = await readPeopleFunc()
    const { offset, limit } = event.queryParameters
    const paginatedPeople = people.slice(offset, offset + limit)
    
    return {
        statusCode: 200,
        body: JSON.stringify(paginatedPeople)
    }
}

