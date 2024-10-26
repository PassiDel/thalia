# syntax = docker/dockerfile:1

ARG BUN_VERSION=1.1.29
FROM oven/bun:${BUN_VERSION}

ENV NODE_ENV=production

WORKDIR /src

# Build & Run

COPY --link queue/package.json queue/bun.lockb ./

COPY --link queue/ ./

RUN bun install

CMD [ "bun", "run", "src/worker.ts" ]
LABEL org.opencontainers.image.source=https://github.com/PassiDel/thalia-worker