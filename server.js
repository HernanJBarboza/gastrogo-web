const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

const distPath = path.join(__dirname, 'dist');
// find built app folder (may be dist/<project-name>)
const fs = require('fs');
let appFolder = distPath;
if (fs.existsSync(path.join(distPath))) {
  const children = fs.readdirSync(distPath).filter(f => fs.statSync(path.join(distPath,f)).isDirectory());
  if (children.length === 1) appFolder = path.join(distPath, children[0]);
}

app.use(express.static(appFolder));
app.get('*', (req, res) => {
  res.sendFile(path.join(appFolder, 'index.html'));
});

app.listen(PORT, () => console.log(`Gastronomia-web serving from ${appFolder} on ${PORT}`));
