const { abs, sqrt, sin, cos, max, min, PI } = Math

/**
 * @description Clone an object or array
 * @param {Object|Array} object Cloned object
 * @param {Boolean} recursion   Whether to use recursive cloning
 * @return {Object|Array} Clone object
 */
export function deepClone (object, recursion = false) {
  if (!object) return object

  const { parse, stringify } = JSON

  if (!recursion) return parse(stringify(object))

  const clonedObj = object instanceof Array ? [] : {}

  if (object && typeof object === 'object') {
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        if (object[key] && typeof object[key] === 'object') {
          clonedObj[key] = deepClone(object[key], true)
        } else {
          clonedObj[key] = object[key]
        }
      }
    }
  }

  return clonedObj
}

/**
 * @description Eliminate line blur due to 1px line width
 * @param {Array} points Line points
 * @return {Array} Line points after processed
 */
export function eliminateBlur (points) {
  return points.map(([x, y]) => [parseInt(x) + 0.5, parseInt(y) + 0.5])
}

/**
 * @description Check if the point is inside the circle
 * @param {Array} point Postion of point
 * @param {Number} rx   Circle x coordinate
 * @param {Number} ry   Circle y coordinate
 * @param {Number} r    Circle radius
 * @return {Boolean} Result of check
 */
export function checkPointIsInCircle (point, rx, ry, r) {
  return getTwoPointDistance(point, [rx, ry]) <= r
}

/**
 * @description Get the distance between two points
 * @param {Array} point1 point1
 * @param {Array} point2 point2
 * @return {Number} Distance between two points
 */
export function getTwoPointDistance ([xa, ya], [xb, yb]) {
  const minusX = abs(xa - xb)
  const minusY = abs(ya - yb)

  return sqrt(minusX * minusX + minusY * minusY)
}

/**
 * @description Check if the point is inside the polygon
 * @param {Array} point  Postion of point
 * @param {Array} points The points that makes up a polyline
 * @return {Boolean} Result of check
 */
export function checkPointIsInPolygon (point, polygon) {
  let counter = 0

  const [x, y] = point

  const pointNum = polygon.length

  for (let i = 1, p1 = polygon[0]; i <= pointNum; i++) {
    const p2 = polygon[i % pointNum]
    if (x > min(p1[0], p2[0]) && x <= max(p1[0], p2[0])) {
      if (y <= max(p1[1], p2[1])) {
        if (p1[0] !== p2[0]) {
          const xinters = (x - p1[0]) * (p2[1] - p1[1]) / (p2[0] - p1[0]) + p1[1]

          if (p1[1] === p2[1] || y <= xinters) {
            counter++
          }
        }
      }
    }

    p1 = p2
  }

  return counter % 2 === 1
}

/**
 * @description Check if the point is inside the sector
 * @param {Array} point       Postion of point
 * @param {Number} rx         Sector x coordinate
 * @param {Number} ry         Sector y coordinate
 * @param {Number} r          Sector radius
 * @param {Number} startAngle Sector start angle
 * @param {Number} endAngle   Sector end angle
 * @param {Boolean} clockWise Whether the sector angle is clockwise
 * @return {Boolean} Result of check
 */
export function checkPointIsInSector (point, rx, ry, r, startAngle, endAngle, clockWise) {
  if (!point) return false

  if (getTwoPointDistance(point, [rx, ry]) > r) return false

  if (!clockWise) [startAngle, endAngle] = deepClone([endAngle, startAngle])

  const reverseBE = startAngle > endAngle

  if (reverseBE) [startAngle, endAngle] = [endAngle, startAngle]

  const minus = endAngle - startAngle

  if (minus >= PI * 2) return true

  const [x, y] = point

  const [bx, by] = getCircleRadianPoint(rx, ry, r, startAngle)
  const [ex, ey] = getCircleRadianPoint(rx, ry, r, endAngle)

  const vPoint = [x - rx, y - ry]
  let vBArm = [bx - rx, by - ry]
  let vEArm = [ex - rx, ey - ry]

  const reverse = minus > PI

  if (reverse) [vBArm, vEArm] = deepClone([vEArm, vBArm])

  let inSector = isClockWise(vBArm, vPoint) && !isClockWise(vEArm, vPoint)

  if (reverse) inSector = !inSector

  if (reverseBE) inSector = !inSector

  return inSector
}

/**
 * @description Determine if the point is in the clockwise direction of the vector
 * @param {Array} vArm   Vector
 * @param {Array} vPoint Point
 * @return {Boolean} Result of check
 */
function isClockWise (vArm, vPoint) {
  const [ax, ay] = vArm
  const [px, py] = vPoint

  return -ay * px + ax * py > 0
}

/**
 * @description Check if the point is inside the polyline
 * @param {Array} point      Postion of point
 * @param {Array} polyline   The points that makes up a polyline
 * @param {Number} lineWidth Polyline linewidth
 * @return {Boolean} Result of check
 */
export function checkPointIsNearPolyline (point, polyline, lineWidth) {
  const halfLineWidth = lineWidth / 2

  const moveUpPolyline = polyline.map(([x, y]) => [x, y - halfLineWidth])
  const moveDownPolyline = polyline.map(([x, y]) => [x, y + halfLineWidth])

  const polygon = [...moveUpPolyline, ...moveDownPolyline.reverse()]

  return checkPointIsInPolygon(point, polygon)
}

/**
 * @description Check if the point is inside the rect
 * @param {Array} point   Postion of point
 * @param {Number} x      Rect start x coordinate
 * @param {Number} y      Rect start y coordinate
 * @param {Number} width  Rect width
 * @param {Number} height Rect height
 * @return {Boolean} Result of check
 */
export function checkPointIsInRect ([px, py], x, y, width, height) {
  if (px < x) return false
  if (py < y) return false

  if (px > x + width) return false
  if (py > y + height) return false

  return true
}

/**
 * @description Get the coordinates of the rotated point
 * @param {Number} rotate Degree of rotation
 * @param {Array} point   Postion of point
 * @param {Array} origin  Rotation center
 * @param {Array} origin  Rotation center
 * @return {Number} Coordinates after rotation
 */
export function getRotatePointPos (rotate = 0, point, origin = [0, 0]) {
  if (!point) return false

  if (rotate % 360 === 0) return point

  const [x, y] = point

  const [ox, oy] = origin

  rotate *= PI / 180

  return [
    (x - ox) * cos(rotate) - (y - oy) * sin(rotate) + ox,
    (x - ox) * sin(rotate) + (y - oy) * cos(rotate) + oy
  ]
}

/**
 * @description Get the coordinates of the scaled point
 * @param {Array} scale  Scale factor
 * @param {Array} point  Postion of point
 * @param {Array} origin Scale center
 * @return {Number} Coordinates after scale
 */
export function getScalePointPos (scale = [1, 1], point, origin = [0, 0]) {
  if (!point) return false

  if (scale === 1) return point

  const [x, y] = point

  const [ox, oy] = origin

  const [xs, ys] = scale

  const relativePosX = x - ox
  const relativePosY = y - oy

  return [
    relativePosX * xs + ox,
    relativePosY * ys + oy
  ]
}

/**
 * @description Get the coordinates of the scaled point
 * @param {Array} translate Translation distance
 * @param {Array} point     Postion of point
 * @return {Number} Coordinates after translation
 */
export function getTranslatePointPos (translate, point) {
  if (!translate || !point) return false

  const [x, y] = point
  const [tx, ty] = translate

  return [x + tx, y + ty]
}

/**
 * @description Get the distance from the point to the line
 * @param {Array} point     Postion of point
 * @param {Array} lineBegin Line start position
 * @param {Array} lineEnd   Line end position
 * @return {Number} Distance between point and line
 */
export function getDistanceBetweenPointAndLine (point, lineBegin, lineEnd) {
  if (!point || !lineBegin || !lineEnd) return false

  const [x, y] = point
  const [x1, y1] = lineBegin
  const [x2, y2] = lineEnd

  const a = y2 - y1
  const b = x1 - x2
  const c = y1 * (x2 - x1) - x1 * (y2 - y1)

  const molecule = abs(a * x + b * y + c)
  const denominator = sqrt(a * a + b * b)

  return molecule / denominator
}

/**
 * @description Get the coordinates of the specified radian on the circle
 * @param {Number} x      Circle x coordinate
 * @param {Number} y      Circle y coordinate
 * @param {Number} radius Circle radius
 * @param {Number} radian Specfied radian
 * @return {Array} Postion of point
 */
export function getCircleRadianPoint (x, y, radius, radian) {
  return [x + cos(radian) * radius, y + sin(radian) * radius]
}

/**
 * @description Get the points that make up a regular polygon
 * @param {Number} x     X coordinate of the polygon inscribed circle
 * @param {Number} y     Y coordinate of the polygon inscribed circle
 * @param {Number} r     Radius of the polygon inscribed circle
 * @param {Number} side  Side number
 * @param {Number} minus Radian offset
 * @return {Array} Points that make up a regular polygon
 */
export function getRegularPolygonPoints (rx, ry, r, side, minus = PI * -0.5) {
  const radianGap = PI * 2 / side

  const radians = new Array(side).fill('').map((t, i) => i * radianGap + minus)

  return radians.map(radian => getCircleRadianPoint(rx, ry, r, radian))
}

export default {
  deepClone,
  eliminateBlur,
  checkPointIsInCircle,
  checkPointIsInPolygon,
  checkPointIsInSector,
  checkPointIsNearPolyline,
  getTwoPointDistance,
  getRotatePointPos,
  getScalePointPos,
  getTranslatePointPos,
  getCircleRadianPoint,
  getRegularPolygonPoints,
  getDistanceBetweenPointAndLine
}
