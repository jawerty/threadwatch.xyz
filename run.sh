cd server
npm run build
pm2 start app.js --name threadwatch --log /var/log/threadwatch.log --interpreter=/root/.nvm/versions/node/v14.17.0/bin/node