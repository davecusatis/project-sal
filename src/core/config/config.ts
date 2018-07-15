import { BuildType } from '../models/build-type';

declare const process: {
  env: {
    NODE_ENV?: string;
  };
};

export abstract class Config {
  public abstract buildType: BuildType;

  public optimizedBuild = process.env.NODE_ENV === 'production';
}

export class DevConfig extends Config {
  public buildType = BuildType.Dev;
}
