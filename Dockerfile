FROM node:20

# Create app directory
WORKDIR /usr/src/app


# ENV DATABASE_USER 
# ENV DATABASE_PASS 
# ENV DATABASE_HOST
# ENV DATABASE_NAME automation_master
# ENV WEBSITE_HOME 

ENV SAVE_LOGS false

ENV PORT 8080

# Install app dependencies
COPY /package*.json ./
RUN npm install
# RUN npm install pm2 -g

# Bundle app source
COPY . ./

EXPOSE 8080

#scaling
# CMD ["pm2-runtime", "index.js", "-i","-0"]
CMD [ "node", "--env-file=.env","index.js" ]