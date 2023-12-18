import { capitalize } from './capitalize';

describe('capitalize', () => {
  it('should capitalize text', () => {
    expect(capitalize('hola')).toBe('Hola');
  });

  it('should leave string empty', () => {
    expect(capitalize('')).toBe('');
  });
});
