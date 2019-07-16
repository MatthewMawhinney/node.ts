export interface IPackage {
  name: string;
  version: string;
  description: string;
  main: string;
  dependencies: {};
  devDependencies: {};
  scripts: {};
  author: string;
  license: string;
}

export interface IBuildFile {
  name: string;
  content: Function;
}

export interface IPackageAnswers {
  name: string;
  description: string;
}
