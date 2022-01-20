/*
 * Script to generate the application configuration as part of Heroku deployment.
 */
import replace from 'replace-in-file';
import fs from 'fs';
import { join } from 'path';

const config_dir = 'src/app/config'
const config_file = join(config_dir, 'app-config.ts');
const template_file = join(config_dir, 'sample-app-config.ts');
const options = {
  files: config_file,
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
};

// make copy of template
fs.copyFileSync(template_file, options.files);

try {
    const results = replace.sync(options);
    console.log('Replacement results:', results);
}
catch (error) {
    console.error('Error occurred:', error);
}
