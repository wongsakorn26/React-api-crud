
# Setup and build the react

FROM node:9.4.0-alpine as react

WORKDIR /usr/app/react/
COPY react/package*.json ./
RUN npm install -qy
COPY react/ ./
RUN npm run build


# Setup the server

FROM node:9.4.0-alpine

WORKDIR /usr/app/
COPY --from=react /usr/app/react/build/ ./react/build/

WORKDIR /usr/app/server/
COPY server/package*.json ./
RUN npm install -qy
COPY server/ ./

ENV PORT 8000

EXPOSE 8000

CMD ["npm", "start"]
