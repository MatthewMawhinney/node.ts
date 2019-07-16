#!/usr/bin/env node

import program from 'commander';
import inquirer from 'inquirer';
import logSymbols from 'log-symbols';
import chalk from 'chalk';
import simplegit from 'simple-git/promise';

import { bootstrap, inqQuestions } from './lib/create';

const errorLog: (message: string | any) => void = chalk.red.inverse;
const successLog: (message: string) => void = chalk.green.bold;

program
  .command('create <projectName>')
  .alias('cr')
  .description('Create a new node-ts project')
  .action((projectName: string, options) => {
    inquirer.prompt(inqQuestions).then(async (answers: any) => {
      try {
        let consoles = await bootstrap(projectName, answers);
        consoles.forEach(resultToConsole => {
          console.log(
            `${logSymbols.success} ${successLog('CREATED')}: ${resultToConsole}`
          );
        });
        let git = simplegit(`./${projectName}`);
        await git
          .outputHandler((command, stdout, stderr) => {
            stdout.pipe(process.stdout);
            stderr.pipe(process.stderr);
          })
          .init()
          .then(() => git.add('./*'));
        // .then(() => git.commit('Init commit'));
      } catch (err) {
        console.log(`${logSymbols.error} ${errorLog('ERROR')}: ${err}`);
      }
    });
  });

program
  .command('new <itemName>')
  .alias('n')
  .option('-c --controller')
  .option('-m --model')
  .option('-t --type')
  .option('-d --dry-run')
  .description('New Controller/Model/Types')
  .action((itemName: string) => {
    bootstrap(itemName);
  });

program.parse(process.argv);
