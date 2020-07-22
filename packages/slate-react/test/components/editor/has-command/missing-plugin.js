/** @jsx h */

import Plain from '@slate-fork/slate-plain-serializer'

const defaultValue = Plain.deserialize('')

const plugins = [
  {
    commands: {
      customCommand: () => {},
    },
  },
]

export const input = { defaultValue, plugins }

export default function(editor) {
  return editor.hasCommand('otherCommand')
}

export const output = false
