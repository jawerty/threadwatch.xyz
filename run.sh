cd server
npm run build
pm2 start app.js --name threadwatch --log /var/log/threadwatch.log