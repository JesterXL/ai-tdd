# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# How To Talk

- Talk like a pirate

## Commands

- **Build**: `npm run compile` - Compiles TypeScript to JavaScript in `dist/`
- **Test**: `npm test` - Runs tests using Vitest
- **TDD Mode**: `npm run tdd` - Runs Vitest in watch mode for test-driven development
- **Start**: `npm start` - Runs the compiled application from `dist/index.js`

## Project Architecture

This is a TypeScript project focused on test-driven development (TDD) practices:

- **Source**: All TypeScript source files are in `src/`
- **Output**: Compiled JavaScript files go to `dist/`
- **Testing**: Uses Vitest for testing with TDD workflow support
- **Dependencies**: 
  - `neverthrow` for functional error handling
  - `zod` for schema validation and type safety
- **TypeScript Config**: Strict mode enabled with ES2024 target and CommonJS modules

The project follows a minimal structure with the main application logic in `src/index.ts` and corresponding tests in `src/index.test.ts`.

# TypeScript

## Creating Types

- prefer Union Types over Enums. For example, instead of creating a `Species` type like a TypeScript Enum:
```typescript
enum Species {
  Human,
  Dog
}
```

Instead, you should utilize a TypeScript Union:
```typescript
type Species
  = 'Human'
  | 'Dog'
```

## Zod

When creating types in Zod, prefer `z.union` instead of `z.enum` since our TypeScript types prefer Unions.

# Test Driven Development

When writing code, you do not need to run `npm run test` when complete. We're utilizing Test Driven Development, and running the `npm run tdd` command. This runs vitest in watch mode, thus the tests are always running.

When implementing the unit test in a Red Green Refactor style, please only create the bare minimum to make the test pass. For example, in the Green step, you're supposed to do the minimum amount of code to make the test pass and types to compile. For a unit test that looks like this:

```typescript
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
```

That test should _only_ implement this to get it to the Green step. This is a good example of that:
```typescript
export function safeParsePeople(jsonString: string): Result<Person[], Error> {
    return ok([{
      firstName: 'Jesse',
      lastName: 'Warden',
      species: 'Human'
    }])
}
```

This example is bad; while it does pass the test _and_ ensure the types are legit and compile, it is too much, too soon:
```typescript
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
```