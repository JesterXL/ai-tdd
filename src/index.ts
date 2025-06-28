import { z } from 'zod'
import { Result, ok, err, ResultAsync } from 'neverthrow'

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

export async function readPeopleFromDisk(filepath: string, fs: any): Promise<Result<Person[], Error>> {
    return ok([{ firstName: 'Jesse', lastName: 'Warden', species: 'Human' }])
}


