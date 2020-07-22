/** @jsx h */

import { Editor } from '@slate-fork/slate'

const plugins = [
  {
    queries: {
      customquery: () => {},
    },
  },
]

export const input = new Editor({ plugins })

export default function(editor) {
  return editor.hasQuery('otherquery')
}

export const output = false
