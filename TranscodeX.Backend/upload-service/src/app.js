const express = require('express');
const uploadRoutes = require('./routes/upload.route');
const fs = require('fs');


if (!fs.existsSync('./temp')) {
  fs.mkdirSync('./temp');
}

const app = express();

app.use(express.json());
app.use('/api', uploadRoutes);

module.exports = app;
