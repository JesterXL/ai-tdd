import { z } from 'zod'
import { Result, ok, err, ResultAsync, errAsync, okAsync } from 'neverthrow'
import { promises as fs } from 'fs'

export interface APIGatewayEvent {
    httpMethod: string
    path: string
    queryStringParameters?: QueryParameters | null
    body?: string | null
}

export interface QueryParameters {
    [key: string]: string | undefined
}

export interface APIGatewayResponse {
    statusCode: number
    body: string
    headers?: { [key: string]: string }
}

export const healthCheck = async (): Promise<APIGatewayResponse> => ({
    statusCode: 200,
    body: ''
})

const SpeciesSchema = z.union([z.literal('Human'), z.literal('Dog')])

const PersonSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    species: SpeciesSchema
})
const PeopleSchema = z.array(PersonSchema)

export type Species = z.infer<typeof SpeciesSchema>
export type Person = z.infer<typeof PersonSchema>
export type People = z.infer<typeof PeopleSchema>

export const safeParsePeople = (jsonString: string): Result<Person[], Error> => {
    try {
        const result = JSON.parse(jsonString)
        const { success, data } = PeopleSchema.safeParse(result)
        return success 
            ? ok(data)
            : err(new Error('Validation error'))
    } catch(error) {
        return err(new Error('JSON parsing error'))
    }
}

export const readPeopleFromDisk = (filepath: string, filesystem: typeof fs): ResultAsync<Person[], Error> =>
    ResultAsync.fromPromise(
        filesystem.readFile(filepath, 'utf8'),
        (error: unknown) => new Error(`Failed to read file: ${error}`)
    ).andThen((fileContents: unknown) => {
        if(typeof fileContents === 'string') {
            const parseResult = safeParsePeople(fileContents)
            return parseResult.isOk() 
                ? okAsync(parseResult.value)
                : errAsync(parseResult.error)
        } else {
            return errAsync(new Error(`fileContents is not a string, typeof is: ${typeof fileContents}`))
        }
    })

export const writePeopleToDisk = (filepath: string, content: string, filesystem: typeof fs): ResultAsync<void, Error> =>
    ResultAsync.fromPromise(
        filesystem.writeFile(filepath, content, 'utf8'),
        (error: unknown) => new Error(`Failed to write file: ${error}`)
    )


