import { expect, test, describe } from 'vitest';

import { parse } from './parse.js'; // Assuming the parser is in a file named parser.ts

describe('parse function', () => {
  test('parses a single character', () => {
    const result = parse('⼁');
    expect(result).toEqual([{ c: '⼁' }]);
  });

  test('parses a character with variant', () => {
    const result = parse('⼁{030-hen}');
    expect(result).toEqual([{ c: '⼁', var: '030-hen' }]);
  });

  test('parses multiple characters with variants', () => {
    const result = parse('⼁⼗⼝{030-hen}');
    expect(result).toEqual([
      { c: '⼁' },
      { c: '⼗' },
      { c: '⼝', var: '030-hen' },
    ]);
  });

  test('parses characters with sub-components', () => {
    const result = parse('壮[⺦⼠]⾐');
    expect(result).toEqual([
      { c: '壮', sub: [{ c: '⺦' }, { c: '⼠' }] },
      { c: '⾐' },
    ]);
  });

  test('parses sub-components with variants', () => {
    const result = parse('⺅吉[⼠{012-2}⼝]');
    expect(result).toEqual([
      { c: '⺅' },
      { c: '吉', sub: [{ c: '⼠', var: '012-2' }, { c: '⼝' }] },
    ]);
  });

  test('parses characters with both variant and sub-components', () => {
    const result = parse('⺅吉{056-kanmuri}[⼠⼝]');
    expect(result).toEqual([
      { c: '⺅' },
      { c: '吉', var: '056-kanmuri', sub: [{ c: '⼠' }, { c: '⼝' }] },
    ]);
  });

  test('parses a radical indicator', () => {
    const result = parse('前[丷㇐⽉⺉]⼑*');
    expect(result).toEqual([
      { c: '前', sub: [{ c: '丷' }, { c: '㇐' }, { c: '⽉' }, { c: '⺉' }] },
      { c: '⼑', is_rad: true },
    ]);
  });

  test('parses a radical indicator in a sub-component', () => {
    const result = parse('⼝{030-hen}兄[⼝*⼉]');
    expect(result).toEqual([
      { c: '⼝', var: '030-hen' },
      { c: '兄', sub: [{ c: '⼝', is_rad: true }, { c: '⼉' }] },
    ]);
  });

  test('handles non-BMP characters', () => {
    const result = parse('𠮷{056-kanmuri}[⼠⼝]');
    expect(result).toEqual([
      { c: '𠮷', var: '056-kanmuri', sub: [{ c: '⼠' }, { c: '⼝' }] },
    ]);
  });

  test('throws on invalid variant format', () => {
    expect(() => parse('⼁{30}')).toThrow('Invalid variant format');
  });

  test('throws on unclosed subcomponent bracket', () => {
    expect(() => parse('⼁[⼠⼝')).toThrow('Unclosed subcomponent bracket');
    expect(() => parse('⼁[')).toThrow('Unclosed subcomponent bracket');
  });

  test('throws on invalid placement of radical indicator', () => {
    expect(() => parse('⼝{030-hen}*兄[⼝⼉]')).toThrow(
      'Invalid radical indicator'
    );
    expect(() => parse('⼝{030-hen}兄[⼝⼉]*')).toThrow(
      'Invalid radical indicator'
    );
  });

  test('handles an empty string', () => {
    const result = parse('');
    expect(result).toEqual([]);
  });

  test('handles complex mixed input', () => {
    const result = parse('𠮷{056-2}⼁[⺦{012-hen}⼠]⾐{030}⼗');
    expect(result).toEqual([
      { c: '𠮷', var: '056-2' },
      { c: '⼁', sub: [{ c: '⺦', var: '012-hen' }, { c: '⼠' }] },
      { c: '⾐', var: '030' },
      { c: '⼗' },
    ]);
  });
});
