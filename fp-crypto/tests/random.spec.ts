import { random, randomInRange, randomFirstName, randomFullName, generateRandomUser } from '../src/random'

test('Expect "random" number 2811915801 with seed 1', () => {
  expect(random(1)[0]).toBe(2811915801)
  expect(random(1)[0]).toBe(2811915801)
})

test('Expect "random" number 2461393960 with seed 2811915801', () => {
  expect(random(2811915801)[0]).toBe(2461393960)
  expect(random(2811915801)[0]).toBe(2461393960)
})

test('Expect result to be between 0 and 10', () => {
  const seed1 = 1
  const [random1, seed2] = randomInRange(0, 10)(seed1)
  const [random2, seed3] = randomInRange(0, 10)(seed2)
  expect(random1).toBeGreaterThanOrEqual(0)
  expect(random1).toBeLessThanOrEqual(10)
  expect(random2).toBeGreaterThanOrEqual(0)
  expect(random2).toBeLessThanOrEqual(10)
})

test('Expect "Nicole" for seed 1', () => {
  expect(randomFirstName(1)[0]).toBe('Nicole')
})

test('Expect "Nicole Gray" for seed 1', () => {
  expect(randomFullName(1)[0]).toBe('Nicole Gray')
})

test('Randomly generate Nicole Gray, 58 and Eagles fan with seed 1', () => {
  const [u, seed] = generateRandomUser(1)
  expect(u.name).toBe('Nicole Gray')
  expect(u.favoriteTeam).toBe('Eagles')
  expect(u.age).toBe(58)
})
