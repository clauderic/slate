import Debug from 'debug'
import Plain from '@slate-fork/slate-plain-serializer'
import getWindow from 'get-window'
import CompositionManager from './composition-manager'
import getEventTransfer from '../../utils/get-event-transfer'

/**
 * @type {Debug}
 */

const debug = Debug('slate:android')

/**
 * Fixes a selection within the DOM when the cursor is in Slate's special
 * zero-width block. Slate handles empty blocks in a special manner and the
 * cursor can end up either before or after the non-breaking space. This
 * causes different behavior in Android and so we make sure the seleciton is
 * always before the zero-width space.
 *
 * @param {Window} window
 */

function fixSelectionInZeroWidthBlock(window) {
  const domSelection = window.getSelection()
  const { anchorNode } = domSelection
  if (anchorNode == null) return
  const { dataset } = anchorNode.parentElement
  const isZeroWidth = dataset ? dataset.slateZeroWidth === 'n' : false

  if (
    isZeroWidth &&
    anchorNode.textContent.length === 1 &&
    domSelection.anchorOffset !== 0
  ) {
    const range = window.document.createRange()
    range.setStart(anchorNode, 0)
    range.setEnd(anchorNode, 0)
    domSelection.removeAllRanges()
    domSelection.addRange(range)
  }
}

/**
 * Android Plugin
 *
 * @param {Editor} options.editor
 */

function AndroidPlugin({ editor }) {
  const observer = new CompositionManager(editor)

  /**
   * handle `onSelect`
   *
   * @param {Event} event
   */

  function onSelect(event) {
    const window = getWindow(event.target)
    fixSelectionInZeroWidthBlock(window)
    observer.onSelect(event)
  }

  /**
   * handle `onComponentDidMount`
   */

  function onComponentDidMount() {
    observer.connect()
  }

  /**
   * handle `onComponentDidUpdate`
   */

  function onComponentDidUpdate() {
    observer.connect()
  }

  /**
   * handle `onComponentWillUnmount`
   *
   * @param {Event} event
   */

  function onComponentWillUnmount() {
    observer.disconnect()
  }

  /**
   * handle `onRender`
   *
   * @param {Event} event
   */

  function onRender() {
    observer.connect()
  }

  function onKeyDown() {
    observer.setUserActionPerformed()
  }

  /**
   * handle `onCommand`
   *
   * @param {Command} command
   * @param {Editor} editor
   * @param {Function} next
   */

  function onCommand(command, _editor, next) {
    if (command.type === 'clearUserActionPerformed') {
      observer.clearUserActionPerformed()
    }

    next()
  }

  /**
   * handle `onFocus`
   *
   * @param {Event} event
   */

  function onFocus() {
    editor.focus()
  }

  /**
   * handle `onFocus`
   *
   * @param {Event} event
   */

  function onBlur() {
    editor.blur()
  }

  /**
   * Default paste handler if no other more specific user plugin handles onPaste.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  function onPaste(event, _editor, next) {
    debug('onPaste', { event })

    const { value } = editor
    const transfer = getEventTransfer(event)
    const { type, fragment, text } = transfer

    if (type === 'fragment') {
      event.preventDefault()
      editor.insertFragment(fragment)
    }

    if (type === 'text' || type === 'html') {
      if (!text) return next()
      const { document, selection, startBlock } = value
      if (editor.isVoid(startBlock)) return next()

      event.preventDefault()

      const defaultBlock = startBlock
      const defaultMarks = document.getInsertMarksAtRange(selection)
      const frag = Plain.deserialize(text, { defaultBlock, defaultMarks })
        .document
      editor.insertFragment(frag)
    }

    next()
  }

  return {
    onBlur,
    onPaste,
    onCommand,
    onComponentDidMount,
    onComponentDidUpdate,
    onComponentWillUnmount,
    onFocus,
    onKeyDown,
    onRender,
    onSelect,
  }
}

export default AndroidPlugin
