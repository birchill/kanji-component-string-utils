import type { Components, RootComponent, SubComponent } from './index.js';

export function parse(input: string): Components {
  const components: Components = [];
  let rest = input;

  while (rest.length > 0) {
    const c = [...rest][0]!;
    rest = rest.slice(c.length);

    const component: RootComponent = { c };

    if (rest[0] === '{') {
      const { variant, rest: newRest } = parseVariant(rest);
      component.var = variant;
      rest = newRest;
    }

    if (rest[0] === '[') {
      const { subComponents, rest: newRest } = parseSubComponents(rest);
      component.sub = subComponents;
      rest = newRest;
    }

    components.push(component);
  }

  return components;
}

function parseVariant(input: string): { variant: string; rest: string } {
  const match = input.match(/^\{(\d{3}(?:-[a-z0-9]+)?)\}(.*)/s);
  if (!match) {
    throw new Error(`Invalid variant format: ${input}`);
  }
  return { variant: match[1]!, rest: match[2]! };
}

function parseSubComponents(input: string): {
  subComponents: SubComponent[];
  rest: string;
} {
  const subComponents: SubComponent[] = [];
  let rest = input.slice(1); // Remove opening '['

  if (rest.length === 0) {
    throw new Error('Unclosed subcomponent bracket');
  }

  while (rest[0] !== ']') {
    const c = [...rest][0]!;
    rest = rest.slice(c.length);

    if (rest[0] === '{') {
      const { variant, rest: newRest } = parseVariant(rest);
      subComponents.push({ c, var: variant });
      rest = newRest;
    } else {
      subComponents.push({ c });
    }

    if (rest.length === 0) {
      throw new Error('Unclosed subcomponent bracket');
    }
  }

  return { subComponents, rest: rest.slice(1) }; // Remove closing ']'
}
