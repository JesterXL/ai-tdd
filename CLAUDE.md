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