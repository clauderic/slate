/** @jsx h */

import { Mark } from '@slate-fork/slate'
import h from '../../../../helpers/h'

export const input = (
  <text>
    <b />
  </text>
)

export default function(t) {
  return t.updateMark(0, 1, Mark.create('bold'), { data: { x: 1 } })
}

export const output = input
