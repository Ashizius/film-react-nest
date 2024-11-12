require('dotenv').config();

const {
  DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REF = 'origin/master',
} = process.env;

module.exports = {
  // Настройка деплоя
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: 'https://github.com/Username/repository.git',
      path: DEPLOY_PATH,
      'pre-deploy': `scp ./docker-compose.yml ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH} &&
      scp .frontend/*.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH} &&
      scp .backend/*.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH} &&
      scp ./*.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}`,
      'post-deploy': 'docker compose up --build',
    },
  },
};
