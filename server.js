const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8080;

// Angular 17+ builds to dist/<project-name>/browser/
let appFolder = path.join(__dirname, 'dist', 'gastronomia-web', 'browser');

// Fallback: check if browser folder exists, otherwise use dist/gastronomia-web
if (!fs.existsSync(appFolder)) {
  appFolder = path.join(__dirname, 'dist', 'gastronomia-web');
}
if (!fs.existsSync(appFolder)) {
  appFolder = path.join(__dirname, 'dist');
}

app.use(express.static(appFolder));
app.get('*', (req, res) => {
  res.sendFile(path.join(appFolder, 'index.html'));
});

app.listen(PORT, () => console.log(`GastroGo Web serving from ${appFolder} on port ${PORT}`));
