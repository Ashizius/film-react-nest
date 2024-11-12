#!/bin/bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
# Вместо 20 укажите необходимую версию Node.js 
nvm install 20
# Выберите установленную версию, вместо 20 укажите нужную версию
nvm use 20
node -v