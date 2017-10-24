const express = require('express');

const app = express();

app.use('/build', express.static('build'))
app.use('/img', express.static('img'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/all', (req, res) => {
  console.log('tekst!!!!!');
  res.sendFile(__dirname + '/all.html');
});

app.get('/service-worker.js', (req, res) => {
  res.sendFile(__dirname + '/service-worker.js');
});

app.get('/manifest.json', (req, res) => {
  res.sendFile(__dirname + '/manifest.json');
});

app.listen(process.env.PORT || 3000);
