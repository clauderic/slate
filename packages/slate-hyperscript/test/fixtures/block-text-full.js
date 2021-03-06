/** @jsx h */

import h from '@slate-fork/slate-hyperscript'

export const input = (
  <block type="paragraph">
    <text>word</text>
  </block>
)

export const output = {
  object: 'block',
  type: 'paragraph',
  data: {},
  nodes: [
    {
      object: 'text',
      text: 'word',
      marks: [],
    },
  ],
}
