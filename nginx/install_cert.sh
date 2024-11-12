apt update
apt install -y snapd
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot
