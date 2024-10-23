import { expect, test, describe } from 'vitest';

import { parse } from './parse'; // Assuming the parser is in a file named parser.ts

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

  test('handles non-BMP characters', () => {
    const result = parse('𠮷{056-kanmuri}[⼠⼝]');
    expect(result).toEqual([
      { c: '𠮷', var: '056-kanmuri', sub: [{ c: '⼠' }, { c: '⼝' }] },
    ]);
  });

  test('throws error on invalid variant format', () => {
    expect(() => parse('⼁{30}')).toThrow('Invalid variant format');
  });

  test('throws error on unclosed subcomponent bracket', () => {
    expect(() => parse('⼁[⼠⼝')).toThrow('Unclosed subcomponent bracket');
    expect(() => parse('⼁[')).toThrow('Unclosed subcomponent bracket');
  });

  test('handles empty string', () => {
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
