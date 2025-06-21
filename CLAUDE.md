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

Do not use the `any` type, instead use `unknown`. If you have to convert `unknown` to some other type, ask the developer what to do, with type narrowing suggestions if applicable.