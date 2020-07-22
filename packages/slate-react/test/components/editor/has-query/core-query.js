/** @jsx h */

import Plain from '@slate-fork/slate-plain-serializer'

const defaultValue = Plain.deserialize('')

export const input = { defaultValue }

export default function(editor) {
  return editor.hasQuery('isVoid')
}

export const output = true
