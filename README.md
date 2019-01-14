# MythX-JS-SDK

## Description
Collection of reusable functions and classes used in mythx apps.

## Technologies (Pre-requisites)
1. Node.js >= 8.10
2. Typescript

## Project Structure

| Name          | Description                                                |
|---------------|------------------------------------------------------------|
| **dist**      | Contains the distributable (output)                        |
| **src**       | Contains source code that will be compiled to the dist dir |
| **test**      | Contains tests                                             |
| tsconfig.json | Config settings for compiling TypeScript code              |
| tslint.json  	| Config settings for TSLint code style checking             |

##  Building

Simply run `npm run build` Typescript code which lives in `src` will be transpiled to `*.js` in `dist` folder.

## Testing

To run tests run `npm test`
