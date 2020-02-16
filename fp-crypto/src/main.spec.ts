import { add } from './main'

test('Adding 1 and 2 results in 3', () => {
  expect(add(1)(2)).toBe(3)
})
