/*
 * Script to handle post-installation tasks.
 */
import { exec } from 'child_process';


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
  });
}


