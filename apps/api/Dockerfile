FROM node:20-alpine3.18 AS base

# The web Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update this Dockerfile, the Dockerfile in the web workspace and copy that over to Dockerfile in the docs.

FROM base AS builder

RUN apk -U upgrade 
# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune api --docker


FROM base AS installer
RUN apk -U upgrade 
WORKDIR /app

# Add lockfile and package.json's of isolated subworkspace
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
# First install dependencies (as they change less often)
RUN npm ci

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN npx turbo run build --filter=api...

FROM base AS runner

RUN apk -U upgrade && \
    apk fix && \
    apk --no-cache --update add git git-lfs gpg less openssh patch && \
    git lfs install
    
WORKDIR /app

COPY --from=installer /app .

CMD node apps/api/dist/index.js
