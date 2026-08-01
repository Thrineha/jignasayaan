FROM nginx:1.27-alpine

RUN rm /etc/nginx/conf.d/default.conf 2>/dev/null || true
COPY nginx.conf /etc/nginx/nginx.conf

# nginx:alpine already drops privileges to a low-priv `nginx` user for
# worker processes; the master process needs to stay root only to bind
# port 80/443 and open log files.

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q -O- http://127.0.0.1:80/ || exit 1

EXPOSE 80
