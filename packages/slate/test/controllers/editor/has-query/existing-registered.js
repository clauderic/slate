/** @jsx h */

import { Editor } from '@slate-fork/slate'

export const input = new Editor().registerQuery('customQuery')

export default function(editor) {
  return editor.hasQuery('customQuery')
}

export const output = true
