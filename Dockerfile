FROM node:20-alpine AS deps
WORKDIR /server

COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /server

COPY --from=deps /server/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /server/.medusa/server

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=9000
ENV MEDUSA_WORKER_MODE=server

COPY --from=builder /server/.medusa/server ./

RUN npm ci --omit=dev

EXPOSE 9000

CMD ["sh", "-c", "npm run predeploy && npm run start"]
