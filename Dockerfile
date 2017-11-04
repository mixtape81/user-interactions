#Official parent image
FROM node:boron

#Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json .

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

# Expose 8080 to make avaiable to outside world
EXPOSE 8080

# Command to run when the image launches
CMD [ "npm", "aws-server" ]