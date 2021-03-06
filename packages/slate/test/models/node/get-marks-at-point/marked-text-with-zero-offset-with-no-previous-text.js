/** @jsx h */

import h from '../../../helpers/h'
import { Set } from 'immutable'
import { Mark } from '@slate-fork/slate'

export const input = (
  <value>
    <document>
      <paragraph>
        <b>
          <cursor />Cat is Cute
        </b>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getInsertMarksAtPoint(selection.start)
}

export const output = Set.of(Mark.create('bold'))
