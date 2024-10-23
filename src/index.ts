export type RootComponent = {
  c: string;
  var?: string;
  sub?: Array<SubComponent>;
};
export type SubComponent = { c: string; var?: string };
export type Components = Array<RootComponent>;

export { parse } from './parse.js';
