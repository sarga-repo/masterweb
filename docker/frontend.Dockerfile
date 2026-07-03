FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.7.0 --activate

COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY frontend/ ./

EXPOSE 3000
CMD ["pnpm", "dev", "--hostname", "0.0.0.0"]
