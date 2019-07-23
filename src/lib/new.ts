import * as fs from 'fs';
import path from 'path';

import { filesToBuild } from './root-files';
import { IBuildFile, IPackageAnswers } from '../models/node';
import { Question } from 'inquirer';

const currentDir: string = process.cwd();

const inqQuestions: Question[] = [
  {
    type: 'input',
    name: 'name',
    message: `What is the author's name?`,
    default: ''
  },
  {
    type: 'input',
    name: 'description',
    message: 'Describe your project',
    default: 'Node.js API with Typescript'
  }
];

const srcChildren = ['config', 'controllers', 'models', 'public', 'types'];
const publicChildren = ['js', 'fonts', 'images'];
const staticAssets = [
  { file: 'server.ts', dest: path.join('src', 'server.ts') },
  { file: 'app.ts', dest: path.join('src', 'app.ts') },
  { file: 'staticAssets.ts', dest: 'staticAssets.ts' },
  { file: 'index.html', dest: path.join('src', 'public', 'index.html') },
  { file: 'tsconfig.json', dest: 'tsconfig.json' },
  { file: 'jest.config.js', dest: 'jest.config.js' },
  { file: 'node-ts.png', dest: path.join('src', 'public', 'images', 'node-ts.png') }
];

const bootstrap = (appName: string, answers: IPackageAnswers): Promise<string[]> => {
  return new Promise(async (resolve, reject) => {
    const consoles: string[] = [];
    try {
      await Promise.all([
        createDir(appName, 'src'),
        createDir(appName, '__tests__'),
        createFile(appName, 'dist/\nnode_modules/ \n.env', '.gitignore'),
        createFile(appName, '', '.env'),
        createChildrenDir(path.join(appName, 'src'), srcChildren),
        createChildrenDir(path.join(appName, 'src', 'public'), publicChildren),
        createRootFiles(appName, filesToBuild, answers),
        copyStaticBatch(appName)
      ]).then(response => {
        response.forEach((results: string[] | string) => {
          if (typeof results === 'string') {
            consoles.push(results);
          } else {
            results.forEach((result: string) => {
              consoles.push(result);
            });
          }
        });
      });
      resolve(consoles);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Create root folder for the Node.ts API
 * @param appName name of application root folder
 */
const createRootDir = (appName: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!fs.existsSync(appName)) {
        resolve(await createDir(appName));
      } else {
        reject(`${appName}/ already exists in ${currentDir}`);
      }
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Create the source directory and all the child dir and files
 * @param appName name application root
 * @param directory name
 */
const createChildrenDir = (parentDirPath: string, dirToCreate: string[]): Promise<string[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const consoles: string[] = await processDirectoryArray(parentDirPath, dirToCreate);
      resolve(consoles);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Function to create directories from array of strings
 * @param path location to create directories inside
 * @param array array of dir names
 */
const processDirectoryArray = async (filePath: string, array: any[]): Promise<string[]> => {
  const promises = array.map((dir: string) => createDir(filePath, dir));
  return await Promise.all(promises);
};

/**
 * Function to create root JSON files eg. Package.json, Jest.config.js...
 * @param path path to parent directory
 * @param files array of @IBuildFile to create files from
 * @param answers answers from inquirer to populate package.json with
 */
const createRootFiles = (filePath: string, files: IBuildFile[], answers: IPackageAnswers): Promise<string[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const consoles: string[] = await processJSONFileArray(filePath, files, answers);
      resolve(consoles);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Function used to create multiple JSON files at once
 * @param path location to create files in
 * @param array array of files to build
 * @param answers answers used to populate files
 */
const processJSONFileArray = async (filePath: string, array: any[], answers: IPackageAnswers): Promise<string[]> => {
  const promises = array.map((file: IBuildFile) => createJSONFile(filePath, file.name, file.content, answers));
  return await Promise.all(promises);
};

/**
 * Function that copies static assets to the new project.
 * @param appName appName used in the destination path
 */
const copyStaticBatch = async (appName: string) => {
  const promises = staticAssets.map((asset: any) => {
    return copyFile(path.join(__dirname, '..', 'static', asset.file), path.join(currentDir, appName, asset.dest));
  });
  return await Promise.all(promises);
};

/**
 * Generic-ish function to create .json files, returns a promise
 * when file has been created or an error occurs.
 * @param path path to create the jsonfiles
 * @param fileName name of json file to be created
 * @param fileFunc function to return the specific json object
 * @param config optional parameter if function is a tsconfig file
 */
const createJSONFile = (
  filePath: string,
  fileName: string,
  fileFunc: (file: string, answers: IPackageAnswers) => any,
  answers: IPackageAnswers
): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join('.', filePath, fileName), JSON.stringify(fileFunc(filePath, answers), null, '\t'), err => {
      if (err) reject(err);
      resolve(path.join(filePath, fileName));
    });
  });
};

/**
 * Function that creates directories
 * Returns a Promise<boolean> to indicate whether success and to continue...
 * @param appName The name passed to the create command
 * @param dryRun optional command argument to run command as test only
 */
const createDir = (filePath: string, directoryName?: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    let filePathConcat: string;
    if (directoryName) {
      filePathConcat = path.join(filePath, directoryName);
    } else {
      filePathConcat = filePath;
    }
    fs.mkdir(path.join('.', filePathConcat), null, err => {
      if (err) return reject(err);
      resolve(filePathConcat);
    });
  });
};

/**
 * Function to create individual files
 * @param path path to location for file
 * @param fileName name of file to be created at @path
 */
const createFile = (filePath: string, content: string | {}, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join('.', filePath, fileName), content, err => {
      if (err) reject(err);
      resolve(path.join(filePath, fileName));
    });
  });
};

/**
 * Function that copies a file from one location to a new one.
 * @param filePath Path to file wanted to be copied
 * @param destinationPath Destination to crete copy of file
 */
const copyFile = (filePath: string, destinationPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.copyFile(filePath, destinationPath, err => {
      if (err) reject(err);
      resolve(destinationPath);
    });
  });
};

/**
 * Deletes directory if any actions are unsuccessful
 * @param appName name application root
 * @param directoryName name of directory to delete
 */
const deleteDir = (filePath: string, directory: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.rmdir(path.join('.', filePath, directory), err => {
      if (err) reject(err);
      resolve(path.join(filePath, directory));
    });
  });
};

/**
 * Function to delete files
 * @param appName name application root
 * @param fileName name of file to delete
 */
const deleteFile = (filePath: string, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.unlink(path.join('.', filePath, fileName), err => {
      if (err) reject(err);
      resolve(path.join(filePath, fileName));
    });
  });
};

export { bootstrap, createRootDir, inqQuestions };
