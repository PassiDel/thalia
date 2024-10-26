# syntax = docker/dockerfile:1

ARG BUN_VERSION=1.1.29

FROM oven/bun:${BUN_VERSION} AS base

ARG PORT=3000

ENV NODE_ENV=production

WORKDIR /src

# Build
FROM base AS build

COPY --link package.json bun.lockb ./

COPY --link . .

RUN bun install --include=dev
RUN bun run build

# Run
FROM base

RUN apt-get update
RUN apt-get -y install curl

ENV PORT=$PORT

COPY --from=build /src/.output /src/.output
# Optional, only needed if you rely on unbundled dependencies
# COPY --from=build /src/node_modules /src/node_modules

HEALTHCHECK CMD curl --fail http://localhost:3000/api/health || exit 1

CMD [ "bun", "run", ".output/server/index.mjs" ]
LABEL org.opencontainers.image.source=https://github.com/PassiDel/thalia-web