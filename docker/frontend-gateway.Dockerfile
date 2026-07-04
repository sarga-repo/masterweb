FROM node:22-alpine
WORKDIR /app
RUN corepack enable
COPY frontend-gateway/package.json frontend-gateway/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install
COPY frontend-gateway/ ./
EXPOSE 3000
CMD ["pnpm", "dev", "--hostname", "0.0.0.0"]
