FROM node:24-alpine
WORKDIR /app
COPY package.json ./
COPY dist ./dist
COPY server ./server
COPY scripts ./scripts
RUN mkdir -p /app/data && chown node:node /app/data
USER node
ENV HOST=0.0.0.0 PORT=4173 NODE_ENV=production COMMUNITY_DB=/app/data/community.sqlite
EXPOSE 4173
VOLUME /app/data
CMD ["node", "scripts/serve.mjs"]
