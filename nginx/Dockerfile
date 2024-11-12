FROM nginx
COPY ./install_cert.sh /src/usr/
RUN /src/usr/install_cert.sh
COPY nginx.conf /etc/nginx/conf.d/default
#COPY postgres.conf /etc/nginx/conf.d/postgres.conf
#COPY postgres.conf /etc/nginx/sites-available/postgres.conf
#RUN ln -s /etc/nginx/sites-available/ashizius.nomorepartiesco.ru.conf /etc/nginx/sites-enabled/ashizius.nomorepartiesco.ru.conf
#RUN ln -s /etc/nginx/sites-available/postgres.conf /etc/nginx/sites-enabled/postgres.conf
#RUN nginx -t
#RUN systemctl reload nginx
EXPOSE 80

