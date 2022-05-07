const exp = require('constants');
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use("/build/", express.static(path.join(__dirname, "node_modules/three/build")));
app.use("/jsm/", express.static(path.join(__dirname, "node_modules/three/examples/jsm")));

app.listen(port, () => console.log(`App listening on port ${port}!`));