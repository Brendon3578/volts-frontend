## multi stage dockerfile

# ---------- DEV ----------
FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json .
RUN npm install
EXPOSE 5173
COPY . .
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---------- BUILD ----------
FROM node:20-alpine AS build
WORKDIR /app
# Copy the package.json and package-lock.json files to the container
COPY package.json package-lock.json ./
# Install project dependencies
RUN npm install
# Copy the rest of the project files to the container
COPY . .
# Build the React app
RUN npm run build

# ---------- PROD ---------- -- de teste
FROM nginx:alpine AS prod
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .
EXPOSE 80

COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]

## DEV
# docker build --target dev -t app-dev .
# docker run -p 5173:5173 app-dev

## PROD
# docker build --target prod -t app-prod .
# docker run -p 80:80 app-prod
## ou docker run -p 80:80 --name test-prod app-prod
## --name é nome da imagem

## comandos uteis:
# docker stop nome_ou_id
# docker rm nome_ou_id