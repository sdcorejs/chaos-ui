# Packaging and release

No packages are published by this foundation. CI never runs npm publish and needs no registry write token.

## Playground deployment

The `Verify and deploy playground` workflow runs `pnpm check` on pushes and pull requests. A successful push to `main` rebuilds only `apps/playground` with `GITHUB_PAGES_BASE=/chaos-ui/`, uploads `apps/playground/dist` as a Pages artifact, then deploys it to [the live playground](https://sdcorejs.github.io/chaos-ui/). The deploy job uses the `github-pages` environment and scopes `pages: write` and `id-token: write` to deployment. The repository's Pages source must be GitHub Actions. Manual runs from `main` can redeploy the same code.

Local development uses Vite's `/` base. To inspect the deploy build locally, set `GITHUB_PAGES_BASE=/chaos-ui/` for `pnpm --filter @chaos-ui/playground build`; no environment variable is needed for `pnpm dev` or the examples. Pages deploys the playground only, not the examples or npm packages.

Use Node 24.19.0 and pnpm 11.19.0. Run:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm check
```

`pnpm build:packages` builds core, then React, then Angular. ng-packagr creates the Angular Package Format under `packages/angular/dist`, including secondary entrypoint exports. Partial compilation is configured in the library tsconfig; Angular consumers perform final linking. Never publish Angular source or a fully compiled application as a library.

`pnpm test:pack` packs only the three library packages, checks their manifests/contents, installs the tarballs outside the workspace, imports all public entries without DOM, typechecks contracts, and builds React/Angular consumers against the installed artifacts. It rejects accidental fixture exports, workspace dependency protocols and missing declarations. Test artifacts remain under `.artifacts` and temporary paths reported by the script.

For a future explicitly authorized release: choose versions and changelogs, run the entire gate, review tarball contents and provenance, then publish core → React → Angular. Angular must publish its built `dist` directory (the source package's `publishConfig.directory` also points there). Core/React pack from their package roots with `files` allowlists. Copy the repository MIT license and package README into every distributable. Never publish root, apps or examples.

Expand peer versions only after testing each proposed support line with packed consumers and browser integration. Add release automation only once versioning, changelog and credential policy are decided.
