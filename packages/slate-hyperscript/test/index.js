import assert from 'assert'
import { Value } from '@slate-fork/slate'
import { fixtures } from '@slate-fork/slate-dev-test-utils'

describe('slate-hyperscript', () => {
  fixtures(__dirname, 'fixtures', ({ module }) => {
    const { input, output, options } = module
    const actual = input.toJSON(options)
    const expected = Value.isValue(output) ? output.toJSON() : output
    assert.deepEqual(actual, expected)
  })
})
