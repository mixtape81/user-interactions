#Official parent image
FROM node

#Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json . package-lock.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

# Expose 80 to make avaiable to outside world
EXPOSE 3000

# Command to run when the image launches
CMD [ "npm", "start" ]