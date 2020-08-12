function getClosestWordOffsets(text, cursorOffset) {
  let left = text.slice(0, cursorOffset).search(/\S+$/)

  if (left < 0) {
    left = cursorOffset
  }

  let right = text.slice(cursorOffset).search(/\s/)

  if (right < 0) {
    right = text.length
  } else {
    right += cursorOffset
  }

  return [left, right]
}

export default function insertCompositionText(editor, insertText) {
  const { value } = editor
  const { document } = value
  const { startText } = value
  const { path, offset } = value.selection.start
  const [left, right] = getClosestWordOffsets(startText.text, offset)

  let entire = editor.value.selection
    .moveAnchorTo(path, left)
    .moveFocusTo(path, right)

  entire = document.resolveRange(entire)

  editor
    .insertTextAtRange(entire, insertText)
    .moveAnchorTo(path, left + insertText.length)
    .moveFocusTo(path, left + insertText.length)
    .restoreDOM()
}
