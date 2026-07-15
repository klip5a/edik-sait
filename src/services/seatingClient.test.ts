import { describe, expect, it } from 'vitest'
import { lookupSeat } from './seatingClient'

describe('lookupSeat', () => {
  it('reports an unconfigured endpoint without exposing mock guest data', async () => {
    await expect(lookupSeat('Иван Иванов')).resolves.toEqual({ status: 'unconfigured' })
  })
})
