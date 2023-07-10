/*
 * Script to handle post-installation tasks.
 */
import { exec } from 'child_process';
import fs from 'fs';
import { join } from 'path';


const commands = [
  'npm list --all',                       // display dependency tree
  'ng run l2cecommercefe:collect-vars',   // update environment
]

for (let cmd of commands) {
  console.log(`postinstall: ${cmd}`);
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`${cmd} exec error: ${error}`);
      return;
    }
    console.log(`${cmd} stdout: ${stdout}`);
    if (cmd.startsWith('ng')) {
      try {
        for (let f of [
          'environment.ts',
          'environment.prod.ts',
        ]) {
          const filepath = join('src/environments', f);
          fs.accessSync(filepath, fs.constants.R_OK | fs.constants.W_OK)
          console.log(`file: ${f} can read/write`);

          const data = fs.readFileSync(filepath, 'utf8');
          console.log(`file: ${f} -----------`);
          console.log(data);
          console.log(`----------------------`);
        }
      } catch (err) {
        console.error(err);
      }
    }
  });
}
