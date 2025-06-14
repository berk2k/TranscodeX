const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const express = require('express');
const uploadRoutes = require('./routes/upload.route');
const fs = require('fs');

const tempDir = path.resolve(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const app = express();

app.use(express.json());
app.use('/api', uploadRoutes);

module.exports = app;
