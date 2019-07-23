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

program.version('0.1.0', '-v, --version');

/**
 * Command to bootstrap new Node.ts project
 */
program
  .command('new <projectName>')
  .alias('n')
  .description('Create a new node.ts project')
  .action((projectName: string) => {
    console.log('');
    inquirer.prompt(inqQuestions).then((answers: any) => {
      createRootDir(projectName)
        .then(async rootDir => {
          try {
            const filesCreated = await bootstrap(projectName, answers);
            console.log('');
            filesCreated.forEach(file => {
              console.log(`${logSymbols.success} ${successLog('CREATED')} ${file}`);
            });
            console.log('');

            const spinner = ora(`${chalk.blue('Creating Project')}`).start();

            spinner.text = `${chalk.blue('Installing Dependencies')}`;
            spinner.succeed(await spawnProcess(projectName, 'npm', ['i']));

            spinner.text = `${chalk.blue('Initializing Git')}`;
            spinner.succeed(await gitInitProcess(projectName));

            spinner.stop();

            console.log(
              ' \u{1F389} ',
              chalk.blue.bold(`${projectName} created successfully! Run 'npm run serve' inside ${projectName} to start your first server.`)
            );
          } catch (err) {
            console.error(`${logSymbols.error} ${errorLog('ERROR')} ${err}`);
            await del(projectName);
            process.exit(1);
          }
        })
        .catch(err => {
          console.error(`${logSymbols.error} ${errorLog('ERROR')} ${err}`);
          process.exit(1);
        });
    });
  });

/**
 * Command to add new controllers or models to your API.
 * Pass the name along with either flag to create the model/controller in the current working directory.
 * Will be implemented in 0.2.0...
 */
program
  .command('add <itemName>')
  .alias('a')
  .option('-c --controller')
  .option('-m --model')
  .description('Add a new Controller/Model in your cwd')
  .action((itemName: string, options) => {
    console.log(itemName, 'This command has not yet been implemented, will be added in 0.2.0');
  });

/**
 * Command to catch all invalid commands and direct user to --help.
 */
program.on('command:*', () => {
  console.error(`${logSymbols.error} ${errorLog('ERROR')} Invalid Command: See --help to see the list of available commands.`);
  process.exit(1);
});

program.parse(process.argv);
