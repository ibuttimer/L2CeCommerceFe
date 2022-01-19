/*
 * Express server to serve the application in a Heroku deployment.
 */
import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import debug from 'debug';
import https from 'https'
import fs from 'fs'


const log = debug('app');

// read angular config to find outputpath
let outputPath = undefined;
try {
    const jsonString = fs.readFileSync('./angular.json')
    const angular_cfg = JSON.parse(jsonString)

    outputPath = angular_cfg.projects[angular_cfg.defaultProject]["architect"]["build"]["options"]["outputPath"];
    log('outputPath %s', outputPath);
} catch(err) {
    console.log(err)
}

if (!outputPath) {
    throw "Unable to determine 'outputPath'";
}

// https://stackoverflow.com/a/64383997
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dist_dir = join(__dirname, outputPath);

const app = express();
let heroku = ((process.env.DOMAIN || '').indexOf('heroku') >= 0);

const port = process.env.PORT || 8080;  // configured port or the default Heroku port
let sslEnabled = String(process.env.SSL_ENABLED || 'true') == 'true';
const sslCrt = process.env.SSL_CRT || 'security certificate not specified';
const sslKey = process.env.SSL_KEY || 'private key not specified';

sslEnabled = false;

// Serve only the static files from the dist directory
app.use(express.static(dist_dir));
log('serving from %s', dist_dir);

// min suggested by http://expressjs.com/en/advanced/best-practice-security.html#use-tls
app.disable('x-powered-by');

app.get('/*', function(req, res) {
    res.sendFile('index.html', { root: dist_dir });
});

// Start the app
if (sslEnabled) {
    https.createServer({
        key: fs.readFileSync(sslKey),
        cert: fs.readFileSync(sslCrt),
      },
      app
    )
    .listen(port, () => {
        log('https listening on %d', port);
    });
  }
else {
    app.listen(port, () => {
        log('http listening on %d', port);
    });
}

