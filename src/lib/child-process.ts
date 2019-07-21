import path from 'path';
import spawn from 'cross-spawn';
import simplegit from 'simple-git/promise';

/**
 * Function to pass commands to child_process spawnSync, returns a promise.
 * @param appRoot The directory to run the proccess in.
 * @param command The shell command to run.
 * @param args An array of string arguments for the command.
 */
const spawnProcess = (appRoot: string, command: string, args: string[]): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const spawnOutput = await spawn(command, args, {
        cwd: appRoot
      });
      spawnOutput.stdout!.on('data', data => {
        resolve(data.toString());
      });
    } catch (err) {
      if (err) reject(err);
    }
  });
};

const gitInitProcess = (appRoot: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    let result: string = '';
    const git = simplegit(path.join('./', appRoot));
    try {
      await git
        .outputHandler((command, stdout, stderr) => {
          stdout.on('data', data => {
            result = data.toString();
          });
        })
        .init()
        .then(() => git.add('./*'))
        .then(() => {
          git.commit('Init Node.ts Commit!');
          resolve(result);
        });
    } catch (err) {
      reject(err);
    }
  });
};

export { spawnProcess, gitInitProcess };
