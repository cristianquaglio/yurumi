FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

RUN npm install -g serve

EXPOSE 5173

CMD ["yarn", "dev"]