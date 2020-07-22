import { Block, Range, Text } from '@slate-fork/slate'
import safelyGetParentKeyNode from './safely-get-parent-key-node'
import DATA_ATTRS from '../constants/data-attributes'

export default function sanitizeDomOnError(editor, domNode, fn) {
  try {
    return { failed: false, value: fn() }
  } catch (e) {
    console.warn('Safely handling caught error, reconciling dom', e)

    // Woo!  So, if we get here, something has gone horribly wrong and the browser has modified the dom in a way
    // that slate can no longer understand.  So, in this event, we are going to replace the entire line (which changes
    // the react key and forces react to re-build the dom), and this will get everything back into a working state
    // hopefully.
    const domElement = safelyGetParentKeyNode(domNode)
    if (domElement == null) return { failed: true }

    const key = domElement.getAttribute(DATA_ATTRS.KEY)
    const slateNode = editor.value.document.getNode(key)
    if (slateNode == null) return { failed: true }

    const blockNode =
      slateNode.object === 'block'
        ? slateNode
        : editor.value.document.getClosestBlock(slateNode.key)
    if (blockNode == null) return { failed: true }

    const lineIndex = editor.value.document.nodes.indexOf(blockNode)
    const selection = window.getSelection()

    if (
      selection != null &&
      selection.isCollapsed &&
      blockNode === slateNode &&
      lineIndex >= 0 &&
      domElement.tagName === 'DIV' &&
      domElement.childNodes.length === 1 &&
      (domElement.childNodes[0] === selection.anchorNode ||
        domElement === selection.anchorNode)
    ) {
      console.log('    replacing entire line via dom text')

      editor.replaceNodeByKey(
        blockNode.key,
        Block.create({
          type: 'line',
          nodes: [Text.create({ text: domElement.textContent })],
        })
      )

      const newNode = editor.value.document.nodes.get(lineIndex)
      const textNode = newNode.nodes.first()
      const point = { key: textNode.key, offset: selection.anchorOffset }
      editor.select(Range.create({ anchor: point, focus: point }))
    } else {
      console.log('    replacing entire line')
      editor.replaceNodeByKey(blockNode.key, Block.create(blockNode.toJSON()))
    }

    return { failed: true }
  }
}
