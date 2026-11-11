# linux/arm64 is supported by node:24-bookworm-slim on Oracle Ampere A1.
# Do not bake Turso tokens, SSH keys or cloud credentials into this image.
FROM node:24-bookworm-slim
ENV NODE_ENV=production PORT=10000 HOST=0.0.0.0 DATA_DIR=/data
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install --global pnpm@11.25.0 \
    && pnpm install --frozen-lockfile --prod
COPY --chown=node:node server/ ./server/
COPY --chown=node:node public/ ./public/
COPY --chown=node:node migrations/ ./migrations/
RUN mkdir -p /data && chown node:node /data
USER node
EXPOSE 10000
HEALTHCHECK --interval=30s --timeout=8s --start-period=120s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:10000/api/health').then(r=>r.json()).then(x=>process.exit(x.ready===true?0:1)).catch(()=>process.exit(1))"
CMD ["node","--experimental-vm-modules","server/index.mjs"]
