#!/usr/bin/env node

import program from 'commander';
import inquirer from 'inquirer';
import { bootstrap, inqQuestions } from './lib/create';
const pckg = require('../../package.json');

program.version(pckg.version);

program
  .command('create <projectName>')
  .alias('cr')
  .description('Create a new node-ts project')
  .action((projectName: string, options) => {
    inquirer.prompt(inqQuestions).then((answers: any) => {
      bootstrap(projectName, answers);
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
