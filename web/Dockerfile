FROM nginx:1.17-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist /var/www/ui

ENTRYPOINT "nginx" "-g" "daemon off;"
