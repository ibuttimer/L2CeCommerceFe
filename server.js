/*
 * Express server to serve the application in a Heroku deployment.
 */
import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import debug from 'debug';
import https from 'https'
import fs from 'fs'
import cors from 'cors';


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
const sslEnabled = String(process.env.SSL_ENABLED || 'true') == 'true';
const sslCrt = process.env.SSL_CRT || 'security certificate not specified';
const sslKey = process.env.SSL_KEY || 'private key not specified';

log('config: domain=%s heroku=%o port=%s', domain, heroku, port);
log('config: allowedOrigins=%s', allowedOrigins);
log('config: ssl=%o crt=%s key=%s', sslEnabled, sslCrt, sslKey);

// Serve only the static files from the dist directory
app.use(express.static(dist_dir));
log('serving from %s', dist_dir);

// enable CORS
var corsOptions = {
    /* Dynamic origin config as per https://www.npmjs.com/package/cors#configuring-cors-w-dynamic-origin.
       The value passed as 'origin' is 'request.headers.origin' and this may be null in an number of cases
       (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin), so allow all for now.
     */ 
    // origin: function (origin, callback) {
    //     var ok = (allowedOrigins.indexOf(origin) > -1);
    
    //     log('cors %s %o', origin, ok);
    
    //     if (ok) {
    //       callback(null, true)
    //     } else {
    //       callback(new Error('Not allowed by CORS'))
    //     }
    //   },
    origin: '*',
    methods: 'GET,HEAD,OPTIONS,POST,PUT,DELETE',
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
    credentials: true
};

app.options('*', cors()); // enable pre-flight across-the-board, include before other routes

app.get('/*', cors(corsOptions), function(req, res) {
    res.sendFile('index.html', { root: dist_dir });
});

// min suggested by http://expressjs.com/en/advanced/best-practice-security.html#use-tls
app.disable('x-powered-by');

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

