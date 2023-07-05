/*
 * Script to generate the application configuration as part of Heroku deployment.
 */
import replace from 'replace-in-file';
import fs from 'fs';
import { join } from 'path';

const config_dir = 'src/app/config'
// replace windows path separator with '/'
// https://github.com/adamreisnz/replace-in-file/issues/165
const config_file = join(config_dir, 'app-config.ts').replaceAll("\\", "/");
const template_file = join(config_dir, 'sample-app-config.ts').replaceAll("\\", "/");

const options = {
  files: [
    config_file
  ],
  from: [
    /<Client ID of okta application>/g,
    /<okta domain>/g,
    /<address of host>/g,
    /<host port>/g,
    /<host protocol>/g,
    /<Publishable key from Stripe API keys>/g,
    ],
  to: [
    process.env.OKTA_CLIENT_ID,
    process.env.OKTA_DOMAIN,
    process.env.HOST_ADDR,
    process.env.HOST_PORT,
    process.env.HOST_PROTOCOL,
    process.env.STRIPE_API_KEY
    ],
  countMatches: true,
};

// make copy of template
fs.copyFileSync(template_file, config_file);

try {
  for (let f of options.files) {
    const data = fs.readFileSync(f, 'utf8');
    console.log(data);
  }
} catch (err) {
  console.error(err);
}

try {
    // set environment variable SKIP_CFG to non-falsy value to skip config update
    if (!process.env.SKIP_CFG) {
      const results = replace.sync(options);
      console.log(
        "[Build] Replacement results ",
        results.map(
          (f) => `${f.file}: ${f.hasChanged}/${f.numReplacements}/${f.numMatches}`
        )
      );
    } else {
      console.log('app-config replacement skipped');
    }
}
catch (error) {
    console.error('Error occurred:', error);
}
