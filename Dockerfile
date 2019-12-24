FROM node:12 as builder
# need python to build some dependencies

WORKDIR /app/

COPY package.json package-lock.json /app/
# copy and install deps asap in order to cache this build step

RUN npm ci
# install exactly the packages (and versions) from the package-lock.json

FROM node:12-alpine as app
# use alpine image to reduce final image size

WORKDIR /app/

COPY --from=builder /app .
COPY *.json babel.config.js .prettierrc /app/
COPY src/ src/

RUN npm run build
# build the final javascript

CMD ["npm", "run", "start"]
