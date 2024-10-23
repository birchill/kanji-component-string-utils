import type { Components, RootComponent, SubComponent } from './index.js';

export function serializeComponents(components: Components): string {
  return components.map(serializeComponent).join('');
}

function serializeComponent(component: RootComponent): string {
  let result = component.c;
  if (component.var) {
    result += `{${component.var}}`;
  }
  if (component.sub) {
    result += `[${component.sub.map(serializeSubComponent).join('')}]`;
  }
  return result;
}

function serializeSubComponent(component: SubComponent): string {
  let result = component.c;
  if (component.var) {
    result += `{${component.var}}`;
  }
  return result;
}
