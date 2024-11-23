#!/bin/bash
sudo docker rm $(docker ps --filter status=exited -q)
sudo docker rmi -f $(docker images -aq)
