# # FROM node:18 AS builder

# # WORKDIR /app
# # COPY package*.json ./
# # RUN npm install
# # COPY . .
# # RUN npm run build


# # FROM nginx:alpine

# # COPY --from=builder /app/dist /usr/share/nginx/html

# # EXPOSE 80
# FROM node:18

# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .

# EXPOSE 3025
# CMD ["npm", "run", "dev", "--", "--host", "--port", "3025"]
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# DO NOT COPY SOURCE CODE (compose will mount it)
EXPOSE 3025

CMD ["npm", "run", "dev", "--", "--host", "--port", "3025"]
