import { expect, test } from 'bun:test';
import { difference } from './price';

test('price', () => {
  expect(difference(10, 20)).toBe(-0.5);
  expect(difference(10, 10)).toBe(0);
  expect(difference(20, 10)).toBe(1);
});
