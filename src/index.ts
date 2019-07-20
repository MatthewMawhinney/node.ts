#!/usr/bin/env node

import program from 'commander';
import inquirer from 'inquirer';
import logSymbols from 'log-symbols';
import chalk from 'chalk';
import ora from 'ora';
import del from 'del';

import { bootstrap, createRootDir, inqQuestions } from './lib/new';
import { spawnProcess, gitInitProcess } from './lib/child-process';

const errorLog: (message: string | any) => void = chalk.red.inverse;
const successLog: (message: string) => void = chalk.green.bold;

program
  .command('new <projectName>')
  .alias('n')
  .description('Create a new node.ts project')
  .action((projectName: string, options) => {
    inquirer.prompt(inqQuestions).then((answers: any) => {
      createRootDir(projectName)
        .then(async rootDir => {
          try {
            const filesCreated = await bootstrap(projectName, answers);
            filesCreated.forEach(file => {
              console.log(`${logSymbols.success} ${successLog('CREATED')} ${file}`);
            });

            const spinner = ora(`${chalk.blue('Creating Project')}`).start();

            spinner.text = `${chalk.blue('Initializing Typescript')}`;
            spinner.succeed(await spawnProcess(projectName, 'tsc', ['--init']));

            spinner.text = `${chalk.blue('Installing Dependencies')}`;
            spinner.succeed(await spawnProcess(projectName, 'npm', ['i']));

            spinner.text = `${chalk.blue('Initializing Git')}`;
            spinner.succeed(await gitInitProcess(projectName));

            spinner.stop();
          } catch (err) {
            console.error(`${logSymbols.error} ${errorLog('ERROR')} ${err}`);
            await del(`./${projectName}`);
            process.exit(1);
          }
        })
        .catch(err => {
          console.error(`${logSymbols.error} ${errorLog('ERROR')} ${err}`);
          process.exit(1);
        });
    });
  });

// program
//   .command('new <itemName>')
//   .alias('n')
//   .option('-c --controller')
//   .option('-m --model')
//   .option('-t --type')
//   .option('-d --dry-run')
//   .description('New Controller/Model/Types')
//   .action((itemName: string) => {
//     bootstrap(itemName);
//   });

/**
 * Command to catch all invalid commands and direct user to --help.
 */
program.on('command:*', () => {
  console.error(`${logSymbols.error} ${errorLog('ERROR')} Invalid Command: See --help to see the list of available commands.`);
  process.exit(1);
});

program.parse(process.argv);
