## setup

* `npm i`
* Replace `<my_api_key>` in `.env.local` with your API key for cats API.
  * If you are on Windows and not using WSL, the script to create .env.local will fail, and you will need to create the file yourself, it needs to contain the following line: VITE_CAT_API_KEY=<your key goes here>

##

## npm scripts

## Build and dev scripts

- `dev` – start development server
- `build` – build production version of the app
- `preview` – locally preview production build

### Testing scripts

- `typecheck` – checks TypeScript types
- `lint` – runs biome
- `prettier:check` – checks files with Prettier
- `vitest` – runs vitest tests
- `vitest:watch` – starts vitest watch
- `test` – runs `vitest`, `prettier:check`, `lint` and `typecheck` scripts

### Other scripts

- `prettier:write` – formats all files with Prettier
