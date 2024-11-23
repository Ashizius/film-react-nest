#!/bin/bash

#sudo apt remove -y docker docker-engine [docker.io](http://docker.io/) containerd runc

sudo apt update 
sudo apt install \
  apt-transport-https \
  ca-certificates \
  gnupg-agent \
  software-properties-common -y 
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc 

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null   

sudo apt update  

sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y

sudo systemctl status docker