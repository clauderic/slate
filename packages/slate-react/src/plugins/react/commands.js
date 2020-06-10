import sanitizeDomOnError from '../../utils/sanitize-dom-on-error'

/**
 * A set of commands for the React plugin.
 *
 * @return {Object}
 */

function CommandsPlugin() {
  /**
   * Takes a `node`, find the matching `domNode` and uses it to set the text
   * in the `node`.
   *
   * @param {Editor} editor
   * @param {Node} node
   */

  function reconcileNode(editor, node) {
    const { value } = editor
    const { document, selection } = value
    const path = document.getPath(node.key)

    const domElement = editor.findDOMNode(path)
    const block = document.getClosestBlock(path)

    // Get text information
    const { text } = node
    let { textContent: domText } = domElement

    const isLastNode = block.nodes.last() === node
    const lastChar = domText.charAt(domText.length - 1)

    // COMPAT: If this is the last leaf, and the DOM text ends in a new line,
    // we will have added another new line in <Leaf>'s render method to account
    // for browsers collapsing a single trailing new lines, so remove it.
    if (isLastNode && lastChar === '\n') {
      domText = domText.slice(0, -1)
    }

    // If the text is no different, abort.
    // Ignore all zero-width spaces here.  There will definitely be some in the dom
    // and we don't want those to make slate thing that the dom does not match the slate AST:
    if (text.replace(/[\uFEFF\b]/g, '') === domText.replace(/[\uFEFF\b]/g, ''))
      return

    let entire = selection.moveAnchorTo(path, 0).moveFocusTo(path, text.length)

    entire = document.resolveRange(entire)

    console.warn('!!  Forced to reconcile dom node :((')

    // Change the current value to have the leaf's text replaced.
    editor.insertTextAtRange(
      entire,
      domText.replace(/[\uFEFF\b]/g, ''),
      node.marks
    )
    return
  }

  /**
   * Takes text from the `domNode` and uses it to set the text in the matching
   * `node` in Slate.
   *
   * @param {Editor} editor
   * @param {DOMNode} domNode
   */

  function reconcileDOMNode(editor, domNode) {
    return sanitizeDomOnError(editor, domNode, () => {
      const domElement = domNode.parentElement.closest('[data-key]')
      const node = editor.findNode(domElement)
      editor.reconcileNode(node)
    }).value
  }

  return {
    commands: {
      reconcileNode,
      reconcileDOMNode,
    },
  }
}

export default CommandsPlugin
