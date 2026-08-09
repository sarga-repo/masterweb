FROM node:22-alpine
WORKDIR /app
RUN corepack enable
COPY frontend-motorsport/package.json frontend-motorsport/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY frontend-motorsport/ ./
EXPOSE 3001
# The dev script binds --port 3001; --hostname exposes it outside the container.
CMD ["pnpm", "dev", "--hostname", "0.0.0.0"]
