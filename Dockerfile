FROM node:24-bookworm-slim
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npx --yes pnpm@11.25.0 install --frozen-lockfile --prod
COPY public ./public
COPY server ./server
COPY migrations ./migrations
ENV HOST=0.0.0.0 PORT=4173 DATA_DIR=/app/data
EXPOSE 4173
CMD ["node", "--experimental-vm-modules", "server/index.mjs"]
