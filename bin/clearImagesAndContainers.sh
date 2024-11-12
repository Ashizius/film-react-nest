#!/bin/bash
docker rmi -f $(docker images -aq)
docker rm $(docker ps --filter status=exited -q)
