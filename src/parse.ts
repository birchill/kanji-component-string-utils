import type { Components, BaseComponent, RootComponent } from './index.js';

export function parse(input: string): Components {
  const components: Components = [];
  let rest = input;

  while (rest.length > 0) {
    let component: RootComponent;
    ({ component, rest } = consumeComponent(rest));

    if (rest[0] === '[') {
      let subComponents: Array<BaseComponent>;
      ({ subComponents, rest } = consumeSubComponents(rest));
      component.sub = subComponents;
    }

    components.push(component);
  }

  return components;
}

function consumeComponent(input: string): {
  component: BaseComponent;
  rest: string;
} {
  const c = String.fromCodePoint(input.codePointAt(0)!);
  if (c === '*') {
    throw new Error('Invalid radical indicator');
  }
  let component: BaseComponent = { c };

  let rest = input.slice(c.length);

  if (rest[0] === '*') {
    component.is_rad = true;
    rest = rest.slice(1);
  }

  if (rest[0] === '{') {
    let variant: string;
    ({ variant, rest } = consumeVariant(rest));
    component.var = variant;
  }

  return { component, rest };
}

function consumeVariant(input: string): { variant: string; rest: string } {
  const match = input.match(/^\{(\d{3}(?:-[a-z0-9]+)?)\}(.*)/s);
  if (!match) {
    throw new Error(`Invalid variant format: ${input}`);
  }
  return { variant: match[1]!, rest: match[2]! };
}

function consumeSubComponents(input: string): {
  subComponents: BaseComponent[];
  rest: string;
} {
  const subComponents: Array<BaseComponent> = [];
  let rest = input.slice(1); // Remove opening '['

  if (rest.length === 0) {
    throw new Error('Unclosed subcomponent bracket');
  }

  while (rest[0] !== ']') {
    let component: BaseComponent;
    ({ component, rest } = consumeComponent(rest));
    subComponents.push(component);

    if (rest.length === 0) {
      throw new Error('Unclosed subcomponent bracket');
    }
  }

  return { subComponents, rest: rest.slice(1) }; // Remove closing ']'
}
