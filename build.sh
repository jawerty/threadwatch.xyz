# run in directory

# get node/npm
sudo apt update
apt install npm
sudo apt install nodejs

# get mongodb
curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt update
sudo apt install mongodb-org
sudo systemctl start mongod.service
sudo systemctl enable mongod

# selenium set up
sudo apt-get install xvfb
Xvfb :1 -screen 0 1024x768x24 & export DISPLAY=:1
sudo apt install firefox
sudo npm install -g geckodriver --unsafe-perm=true --allow-root
export PATH=$PATH:/usr/local/bin/geckodriver


# package build
npm install pm2 -g
npm install
cd server
npm install
npm run build
cd ..

