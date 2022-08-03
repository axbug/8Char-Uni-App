/**
 * @description Draw a polyline path
 * @param {Object} ctx        Canvas 2d context
 * @param {Array} points      The points that makes up a polyline
 * @param {Boolean} beginPath Whether to execute beginPath
 * @param {Boolean} closePath Whether to execute closePath
 * @return {Undefined} Void
 */
export function drawPolylinePath (ctx, points, beginPath = false, closePath = false) {
  if (!ctx || points.length < 2) return false

  if (beginPath) ctx.beginPath()

  points.forEach((point, i) =>
    point && (i === 0 ? ctx.moveTo(...point) : ctx.lineTo(...point)))

  if (closePath) {
	  ctx.closePath()
	  ctx.draw()
  }
}

/**
 * @description Draw a bezier curve path
 * @param {Object} ctx        Canvas 2d context
 * @param {Array} points      The points that makes up a bezier curve
 * @param {Array} moveTo      The point need to excute moveTo
 * @param {Boolean} beginPath Whether to execute beginPath
 * @param {Boolean} closePath Whether to execute closePath
 * @return {Undefined} Void
 */
export function drawBezierCurvePath (ctx, points, moveTo = false, beginPath = false, closePath = false) {
  if (!ctx || !points) return false

  if (beginPath) ctx.beginPath()

  if (moveTo) ctx.moveTo(...moveTo)

  points.forEach(item => (item && ctx.bezierCurveTo(...item[0], ...item[1], ...item[2])))

  if (closePath) {
	  ctx.closePath()
	   ctx.draw()
  }
}

export default {
  drawPolylinePath,
  drawBezierCurvePath
}
