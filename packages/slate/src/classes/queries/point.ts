import { Editor, Path, Point, PointRef } from '../..'
import { POINT_REFS } from '../../symbols'

class PointQueries {
  /**
   * Create a mutable ref for a `Point` object, which will stay in sync as new
   * operations are applied to the this.
   */

  createPointRef(
    this: Editor,
    point: Point,
    options: { affinity?: 'backward' | 'forward' | null } = {}
  ): PointRef {
    const { affinity = 'forward' } = options
    const ref: PointRef = new PointRef({
      point,
      affinity,
      onUnref: () => delete this[POINT_REFS][ref.id],
    })

    this[POINT_REFS][ref.id] = ref
    return ref
  }
}

export default PointQueries
