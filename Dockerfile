# Setup the environment
FROM node:14
WORKDIR /usr/src/app

# Copy the npm dependencies
COPY package*.json ./
RUN npm i

# Copy the source
COPY . .
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
