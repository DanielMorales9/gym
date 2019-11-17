FROM nginx

COPY nginx_dev.conf /etc/nginx/nginx.conf
COPY dist /var/www/ui

ENTRYPOINT "nginx" "-g" "daemon off;"
