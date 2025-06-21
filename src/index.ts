import { okAsync, ResultAsync } from "neverthrow";

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