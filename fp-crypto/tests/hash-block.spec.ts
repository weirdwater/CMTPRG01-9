import { Block } from "../src/api/types"
import { hashBlock } from "../src/hash-block"

const block0: Block = {
  _id: "5c5003d55c63d51f191cadd6",
  algorithm: "mod10sha,0000",
  hash: "000078454c038871fa4d67b0022a30baaf25eaa231f8991b108e2624f052f3f8",
  nonce: "10312",
  timestamp: 1548747788716,
  __v: 0,
  data: [
      {
          _id: "5c4f20695c63d51f191cadd1",
          from: "CMGT Mining Corporation",
          to: "Bob PIKAB",
          amount: 1,
          timestamp: 1548689513858
      }
  ]
}

const hash0 = '00005d430ce77ad654b5309a770350bfb4cf49171c682330a2eccc98fd8853cf'

test('Block hashes match', () => {
  expect(hashBlock(block0)).toBe(hash0)
})
