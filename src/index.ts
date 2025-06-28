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

export async function healthCheck(): Promise<APIGatewayResponse> {
    return {
        statusCode: 200,
        body: ''
    }
}

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

export function safeParsePeople(jsonString: string): Result<Person[], Error> {
    try {
        const result = JSON.parse(jsonString)
        const { success, data, error } = PeopleSchema.safeParse(result)
        if(success) {
            return ok(data)
        } else {
            return err(new Error('Validation error'))
        }
    } catch(error) {
        return err(new Error('JSON parsing error'))
    }
}

export function readPeopleFromDisk(filepath: string, filesystem: typeof fs): ResultAsync<Person[], Error> {
    return ResultAsync.fromPromise(
        filesystem.readFile(filepath, 'utf8'),
        (error: unknown) => new Error(`Failed to read file: ${error}`)
    ).andThen((fileContents:unknown) => {
        if(typeof fileContents === 'string') {
            const parseResult = safeParsePeople(fileContents)
            return parseResult.isOk() 
                ? okAsync(parseResult.value)
                : errAsync(parseResult.error)
        } else {
            return errAsync(new Error(`fileContents is not a string, typeof is: ${typeof fileContents}`))
        }
    })
}


