# cid.contact Web UI
[![Deploy Pages](https://github.com/ipni/cid.contact/actions/workflows/pages.yml/badge.svg)](https://github.com/ipni/cid.contact/actions/workflows/pages.yml)

This repository contains the web UI of [cid.contact](https://cid.contact)

## Deployment
The content here is built and deployed on merge to `main` via GitHub Pages [action](.github/workflows/deploy.yml).

## Build
To build the project locally, run
```shell
npm ci
npm run build
```

This will generate the static content into `out`directory.
