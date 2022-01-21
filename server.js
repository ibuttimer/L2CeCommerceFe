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
const domain = process.env.DOMAIN || 'domain not set';
let heroku = (domain.indexOf('heroku') >= 0);

const port = process.env.PORT || "8080";  // configured port or the default Heroku port
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(",");
let sslEnabled = String(process.env.SSL_ENABLED || 'true') == 'true';
const sslCrt = process.env.SSL_CRT || 'security certificate not specified';
const sslKey = process.env.SSL_KEY || 'private key not specified';

log('config: domain=%s heroku=%o port=%s', domain, heroku, port);
log('config: allowedOrigins=%s', allowedOrigins);
log('config: ssl=%o crt=%s key=%s', sslEnabled, sslCrt, sslKey);

// Serve only the static files from the dist directory
app.use(express.static(dist_dir));
log('serving from %s', dist_dir);

// min suggested by http://expressjs.com/en/advanced/best-practice-security.html#use-tls
app.disable('x-powered-by');

// CORS on ExpressJS http://enable-cors.org/server_expressjs.html
// also http://stackoverflow.com/questions/32500073/request-header-field-access-control-allow-headers-is-not-allowed-by-itself-in-pr
app.use(function(req, res, next) {
    var origin = req.headers.origin;
    var ok = (allowedOrigins.indexOf(origin) > -1);

    if (ok) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    }
    app.disable('cors %s %o', origin, ok);

    next();
  });

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
        log('listening on https://%s:%d', domain, port);
    });
  }
else {
    app.listen(port, () => {
        log('listening on http://%s:%d', domain, port);
    });
}

