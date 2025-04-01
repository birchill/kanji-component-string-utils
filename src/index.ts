export type BaseComponent = { c: string; var?: string; is_rad?: true };
export type RootComponent = BaseComponent & { sub?: Array<BaseComponent> };
export type Components = Array<RootComponent>;

export { parse } from './parse.js';
export { serialize } from './serialize.js';
