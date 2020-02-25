import { last, tailFrom } from "../src/arrays"

test('last retrieves the correct tail of an array.', () => {
  expect(last(['A', 'B', 'C', 'D', 'E', 'F', 'G'], 4)).toEqual(['D', 'E', 'F', 'G'])
  expect(last(['A', 'B', 'C', 'D'], 3)).toEqual(['B', 'C', 'D'])
  expect(last(['A', 'B', 'C'], 3)).toEqual(['A', 'B', 'C'])
})

test('tailFrom always returns the tail from a specific number of entries', () => {
  expect(tailFrom(0)(['A', 'B', 'C', 'D', 'E', 'F', 'G'])).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
  expect(tailFrom(1)(['A', 'B', 'C', 'D', 'E', 'F', 'G'])).toEqual(['B', 'C', 'D', 'E', 'F', 'G'])
  expect(tailFrom(4)(['A', 'B', 'C', 'D', 'E', 'F', 'G'])).toEqual(['E', 'F', 'G'])
  expect(tailFrom(5)(['A', 'B', 'C', 'D', 'E', 'F', 'G'])).toEqual(['F', 'G'])
  expect(tailFrom(7)(['A', 'B', 'C', 'D', 'E', 'F', 'G'])).toEqual([])
  expect(tailFrom(10)(['A', 'B', 'C', 'D', 'E', 'F', 'G'])).toEqual([])
  expect(tailFrom(-10)(['A', 'B', 'C', 'D', 'E', 'F', 'G'])).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
})
