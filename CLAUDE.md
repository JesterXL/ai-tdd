# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## How to speak

- Speak like a pirate

## Project Overview

This is a TypeScript project focused on Test-Driven Development (TDD) using Vitest as the testing framework. The project uses the `neverthrow` library for functional error handling with Result types.

## Commands

- **Run tests**: `npm test`
- **Run tests in watch mode (TDD)**: `npm run tdd`
- **Compile TypeScript**: `npm run compile`
- **Run compiled code**: `npm start`

## Architecture

- **Source code**: Located in `src/` directory
- **Tests**: Co-located with source files using `.test.ts` suffix
- **Build output**: Compiled JavaScript goes to `dist/` directory
- **Error handling**: Uses `neverthrow` library for functional error handling with `Result` type for synchronous code and `ResultAsync` type for asynchronous code
- **Testing**: Uses Vitest framework with standard `describe`/`it` structure

## Development Workflow

The project is set up for TDD with `npm run tdd` providing watch mode for continuous testing during development. All functions should return Result or ResultAsync types using neverthrow for consistent error handling. After Claude has made edits and they've been approved by the developer and you save, no need to run `npm test`; the developer should have `npm run tdd` running, so the tests will run once you save.

## Typing Rules

### prefer unknown instead of any

Do not use the `any` type, instead use `unknown`. If you have to convert `unknown` to some other type, ask the developer what to do, with type narrowing suggestions if applicable.

### prefer named types instead of anonymous types

When creating types, ensure you name them instead of using anonymous types. For example, the return value for the `getPeople` function below has a `Promise<{ statusCode: number; body: string }>` return type. The Promise contains a `{ statusCode: number; body: string }`, but no one knows what to call it because it does not have a name, and we're not even sure what it is used for unless we guess. Thus it is not good code.

```typescript
export const getPeople = async (
    readPeopleFunc: () => Promise<Person[]>,
    event: Event
): Promise<{ statusCode: number; body: string }> => {
    //
}
```

Just like you name variables descriptive names, you should name your types descriptive names as well. Here is an example of naming the type above:

```typescript
type Response = { statusCode: number; body: string }
```

Then we can use those named types in our code:
```typescript
export const getPeople = async (
    readPeopleFunc: () => Promise<Person[]>,
    event: Event
): Promise<Response> => {
    //
}
```

### Promise vs ResultAsync

When a function returns a Promise, ask if we should be returning an AsyncResult instead. Promises compose just like Results do, but their error handling is not type safe, and we're looking to make our program as type safe as possible.

For example, the below funtion returns a `Promise<Reponse>`:

```typescript
export const getPeople = async (
    readPeopleFunc: () => Promise<Person[]>,
    event: Event
): Promise<Response> => {
    //
}
```

Instead, we should endeavor to return `ResultAsync` for all functions that return a `Promise`. A more type safe return type example would look like the following:

```typescript
export const getPeople = async (
    readPeopleFunc: () => Promise<Person[]>,
    event: Event
): ResultAsync<Response, Error> => {
    //
}
```