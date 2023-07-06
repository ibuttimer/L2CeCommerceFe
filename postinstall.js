/*
 * Script to handle post-installation tasks.
 */
import { exec } from 'child_process';


const commands = [
  'npm list --all',                       // display dependency tree
  'ng run l2cecommercefe:collect-vars',   // update environment
]

for (let cmd of commands) {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}


