const express = require('express');
const routes = require("./routes/routesIndex");
const db = require("./db/db");
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.set('models', db().init())

app.use(express.static('public'))
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/t/:threadId', (req, res) => {
  res.render('index');
});

app.get('/api/thread', routes.getThreads);
app.post('/api/thread', routes.addThread);
app.get('/api/thread/:threadId', routes.getThread);
app.put('/api/thread/:theadId', routes.editThread);

app.get('/api/commenter/:commenterId', routes.getCommenter);
app.put('/api/commenter/:commenterId', routes.editCommenter);

app.get('/api/topic', routes.getTopics);

app.listen(port, () => {
  console.log(`threadwatch app listening at port ${port}`);
});