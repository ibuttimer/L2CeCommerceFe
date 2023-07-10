/*
 * Script to handle post-installation tasks.
 */
import { spawn } from 'child_process';
import fs from 'fs';
import { join } from 'path';


const commands = [
  // ['npm', ['list', '--all']],                       // display dependency tree
  ['ng', ['run',  'l2cecommercefe:collect-vars']],  // update environment
]

for (let cmd of commands) {
  console.log(`postinstall: ${cmd}`);

  const cmd_ps = spawn(cmd[0], cmd[1], {
    env: process.env,
    shell: true
  });
  console.log(`env: ${process.env.L2C_HOST_ADDR} ${process.env.L2C_HOST_PORT}`);
  cmd_ps.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  cmd_ps.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  cmd_ps.on('close', (code) => {
    console.log(`${cmd[0]} exited with code ${code}`);
    if (cmd[0] === 'ng') {
      try {
        for (let f of [
          'environment.ts',
          'environment.prod.ts',
        ]) {
          const filepath = join('src/environments', f);
          fs.accessSync(filepath, fs.constants.R_OK | fs.constants.W_OK)
          console.log(`file: ${filepath} can read/write`);

          const data = fs.readFileSync(filepath, 'utf8');
          console.log(`file: ${filepath} -----------`);
          console.log(data);
          console.log(`----------------------`);
        }
      } catch (err) {
        console.error(err);
      }
    }
  });
}
