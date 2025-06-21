import { okAsync, ResultAsync } from "neverthrow";

export const healthCheck = ():ResultAsync<boolean, never> =>
    okAsync(true)

export const readJSON = (
    fsReadFile: (path: string) => Promise<string>, 
    path: string
): ResultAsync<any, Error> =>
    ResultAsync.fromPromise(
        fsReadFile(path).then(content => JSON.parse(content)),
        (error) => error instanceof Error ? error : new Error(String(error))
    )