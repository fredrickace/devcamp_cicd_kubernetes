FROM node:latest

RUN curl -L --fail https://github.com/docker/compose/releases/download/1.28.5/run.sh -o /usr/local/bin/docker-compose
RUN chmod +x /usr/local/bin/docker-compose

RUN mkdir -p /app/src
# Create app directory

RUN npm install -g nodemon

WORKDIR /app/src
# Install app dependencies
COPY package.json /app/src

RUN npm install
# Copy app source code
COPY . .
#Expose port and start application
EXPOSE 5000

CMD [ "npm", "run", "dev" ]