export interface IPackage {
  name: string;
  version: string;
  description: string;
  main: string;
  dependencies: {};
  devDependencies: {};
  repository: {};
  scripts: {};
  author: string;
  license: string;
}

export interface IBuildFile {
  name: string;
  content: (file: string, answers: IPackageAnswers) => any;
}

export interface IPackageAnswers {
  name: string;
  description: string;
}
