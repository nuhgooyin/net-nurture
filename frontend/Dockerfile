# Build the Angular App
# basically, this compiles the Angular project to static HTML and js files.
FROM node:22-alpine3.19 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
RUN npm i --package-lock-only
RUN npm ci
COPY . ./
RUN npm run build

# Serve these static files with NGINX.
FROM nginx:1.26.1-alpine3.19
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
