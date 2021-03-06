/** @jsx h */

import h from '@slate-fork/slate-hyperscript'

export const input = (
  <block type="paragraph">
    <inline type="link">word</inline>
  </block>
)

export const output = {
  object: 'block',
  type: 'paragraph',
  data: {},
  nodes: [
    {
      object: 'inline',
      type: 'link',
      data: {},
      nodes: [
        {
          object: 'text',
          text: 'word',
          marks: [],
        },
      ],
    },
  ],
}
