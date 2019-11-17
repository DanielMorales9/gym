FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist /var/www/ui

ENTRYPOINT "nginx-debug" "-g" "daemon off;"
