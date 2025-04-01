import type { BaseComponent, Components, RootComponent } from './index.js';

export function serialize(components: Components): string {
  return components.map(serializeComponent).join('');
}

function serializeComponent(component: RootComponent): string {
  let result = component.c;
  if (component.is_rad) {
    result += '*';
  }
  if (component.var) {
    result += `{${component.var}}`;
  }
  if (component.sub) {
    result += `[${component.sub.map(serializeSubComponent).join('')}]`;
  }
  return result;
}

function serializeSubComponent(component: BaseComponent): string {
  let result = component.c;
  if (component.is_rad) {
    result += '*';
  }
  if (component.var) {
    result += `{${component.var}}`;
  }
  return result;
}
