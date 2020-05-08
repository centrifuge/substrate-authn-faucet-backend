FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .
RUN ls -l

RUN yarn install
RUN yarn build
# If you are building your code for production
# RUN npm ci --only=production

# Actual service container
FROM node:12
WORKDIR /usr/src/app
COPY --from=0 /usr/src/app/build build
COPY --from=0 /usr/src/app/package.json package.json
RUN ls -l
ENV NODE_ENV production
RUN yarn install

EXPOSE 8080
CMD [ "node", "build/server.js" ]