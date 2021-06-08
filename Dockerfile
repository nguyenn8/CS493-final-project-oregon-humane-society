FROM node:latest as ohs-api
WORKDIR /usr/src/app
COPY . .
RUN npm install
ENV PORT=8000
EXPOSE ${PORT}
CMD [ "npm", "start" ]

FROM nginx:latest as load-balancer
COPY load-balancer.conf /etc/nginx/nginx.conf
