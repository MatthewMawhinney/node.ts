#!/usr/bin/env node

import program from 'commander';
import bootstrap from '../lib/create';
const pckg = require('../../package.json');

program.version(pckg.version);

program
  .command('create <projectName>')
  .alias('cr')
  .option('-d, --dry-run', 'Do a dry-run of the commands result')
  .description('Create a new node-ts project')
  .action((projectName: string, options) => {
    bootstrap(projectName, options.dryRun);
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
