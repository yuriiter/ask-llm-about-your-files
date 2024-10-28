FROM node:23-alpine3.19 AS base

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:23-alpine3.19 AS production

ENV NODE_ENV=production

WORKDIR /app

COPY --from=base /app/package.json /app/yarn.lock /app/
COPY --from=base /app/.next /app/.next
COPY --from=base /app/public /app/public
COPY --from=base /app/node_modules /app/node_modules

CMD ["yarn", "start"]
