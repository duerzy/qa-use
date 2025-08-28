FROM node:23-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate

# Configure npm/pnpm to use a faster mirror (can be overridden by build arg)
ARG NPM_REGISTRY=https://registry.npmmirror.com
RUN npm config set registry ${NPM_REGISTRY} \
  && pnpm config set registry ${NPM_REGISTRY}

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Builder --------------------------------------------------------------------

FROM node:23-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

# Keep registry in builder stage as well (in case any postinstall/fetch occurs)
ARG NPM_REGISTRY=https://registry.npmmirror.com
RUN npm config set registry ${NPM_REGISTRY} \
  && pnpm config set registry ${NPM_REGISTRY}

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

# Runner ---------------------------------------------------------------------

FROM node:23-alpine AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

# Keep registry config for runtime installs (if any)
ARG NPM_REGISTRY=https://registry.npmmirror.com
RUN npm config set registry ${NPM_REGISTRY} \
  && pnpm config set registry ${NPM_REGISTRY}

WORKDIR /app
ENV NODE_ENV=production


COPY --from=builder /app ./

EXPOSE 3000

CMD ["pnpm", "start"]
