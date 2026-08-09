FROM node:22-alpine
WORKDIR /app
RUN corepack enable
COPY frontend-horsesport/package.json frontend-horsesport/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY frontend-horsesport/ ./
EXPOSE 3002
# The dev script binds --port 3002; --hostname exposes it outside the container.
CMD ["pnpm", "dev", "--hostname", "0.0.0.0"]
