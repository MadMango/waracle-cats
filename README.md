## Setup

* `npm i`
* Replace `<my_api_key>` in `.env.local` with your API key for cats API.
  * If you are on Windows and not using WSL, the script to create .env.local will fail, and you will need to create the file yourself, it needs to contain the following line: VITE_CAT_API_KEY=<your key goes here>

### Build and dev scripts

- `dev` – start development server
- `build` – build production version of the app
- `preview` – locally preview production build

### Testing scripts

- `typecheck` – checks TypeScript types
- `lint` – runs biome and stylelint
- `test:unit` – runs vitest tests
- `test:unit:watch` – starts vitest watch
- `test:unit:ui` – starts vitest in ui mode
- `test:e2e` - runs playwright tests
- `test:e2e:ui` - runs playwright tests in ui mode
- `test:e2e:headed`  - runs playwright tests in headed mode
- `test` – runs `typecheck`, `lint`, `vitest`, and `build` scripts


### Other scripts

- `wipe-votes` – delete the votes if you have cast over a 100 - the API cannot return more than that in a single request.

## Caveats

1. Since there aren't multiple users, I made it possible for one person to spam the vote button, just to make it easier to visualise scores.

2. I assumed that the limit of 100 cats per request is fine, and I didn't implement pagination.
