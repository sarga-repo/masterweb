FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git python3 make g++
RUN corepack enable && corepack prepare pnpm@11.7.0 --activate

COPY cms/package.json cms/pnpm-lock.yaml cms/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY cms/ ./

EXPOSE 1337
CMD ["pnpm", "develop"]
