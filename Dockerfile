FROM 172.20.0.223:5000/nginx:1.10-alpine

RUN mkdir -p /usr/share/nginx/html/dist
RUN mkdir -p /usr/share/nginx/html/help
COPY production/dist/ /usr/share/nginx/html/dist
COPY production/help/ /usr/share/nginx/html/help
COPY production/index.html /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
