sudo certbot --nginx
sudo systemctl reload nginx
# Запишем скрипт перезапуска в файл /etc/letsencrypt/renewal-hooks/post/nginx-reload.sh
echo -e '#!/bin/bash\nnginx -t && systemctl reload nginx' | sudo tee /etc/letsencrypt/renewal-hooks/post/nginx-reload.sh
# Выдадим права на исполнение скрипта
sudo chmod a+x /etc/letsencrypt/renewal-hooks/post/nginx-reload.sh