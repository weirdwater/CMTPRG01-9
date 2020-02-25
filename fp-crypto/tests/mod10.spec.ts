import { mod10, addAndMod10Array, mod10Array, alphaValues, last, tailFrom } from "../src/mod10"

test('mod10 produces the correct hash for the string "text"', () => {
  expect(mod10('text')).toBe('d0b3cb0cc9100ef243a1023b2a129d15c28489e387d3f8b687a7299afb4b5079')
})

test('Function adds array members and applies mod10 to the results', () => {
  const a = [7, 4, 3, 7, 8, 2, 9, 2, 9, 1]
  const b = [8, 7, 4, 3, 7, 0, 2, 1, 6, 7]
  expect(addAndMod10Array([a, b])).toEqual([5, 1, 7, 0, 5, 2, 1, 3, 5, 8])
})

test('correct mod10 result for array of numbers', () => {
  expect(mod10Array([1, 1, 6, 1, 0, 1, 1, 2, 0, 1, 1, 6])).toEqual([2, 7, 6, 2, 2, 4, 5, 7, 6, 8])
})

test('correct ascii values for string', () => {
  expect(alphaValues('text')).toEqual([116, 101, 120, 116])
})

test('Numeric values are not converted to ascii', () => {
  expect(alphaValues('text9')).toEqual([116, 101, 120, 116, 9])
})

test('last retrieves the correct tail of an array.', () => {
  expect(last(['A', 'B', 'C', 'D', 'E', 'F', 'G'], 4)).toEqual(['D', 'E', 'F', 'G'])
  expect(last(['A', 'B', 'C', 'D'], 3)).toEqual(['B', 'C', 'D'])
  expect(last(['A', 'B', 'C'], 3)).toEqual(['A', 'B', 'C'])
})

test('tailFrom always returns the tail from a specific number of entries', () => {
  expect(tailFrom(['A', 'B', 'C', 'D', 'E', 'F', 'G'], 0)).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
  expect(tailFrom(['A', 'B', 'C', 'D', 'E', 'F', 'G'], 1)).toEqual(['B', 'C', 'D', 'E', 'F', 'G'])
  expect(tailFrom(['A', 'B', 'C', 'D', 'E', 'F', 'G'], 4)).toEqual(['E', 'F', 'G'])
  expect(tailFrom(['A', 'B', 'C', 'D', 'E', 'F', 'G'], 5)).toEqual(['F', 'G'])
  expect(tailFrom(['A', 'B', 'C', 'D', 'E', 'F', 'G'], 7)).toEqual([])
  expect(tailFrom(['A', 'B', 'C', 'D', 'E', 'F', 'G'], 10)).toEqual([])
  expect(tailFrom(['A', 'B', 'C', 'D', 'E', 'F', 'G'], -10)).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
})

