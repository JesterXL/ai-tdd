import { z } from 'zod'
import { Result, ok, err } from 'neverthrow'

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

export type Species = z.infer<typeof SpeciesSchema>
export type Person = z.infer<typeof PersonSchema>

export function safeParsePeople(jsonString: string): Result<Person[], Error> {
    try {
        const parsed = JSON.parse(jsonString)
        const peopleArraySchema = z.array(PersonSchema)
        const result = peopleArraySchema.safeParse(parsed)
        
        if (result.success) {
            return ok(result.data)
        } else {
            return err(new Error(`Validation failed: ${result.error.message}`))
        }
    } catch (error) {
        return err(new Error(`JSON parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`))
    }
}

