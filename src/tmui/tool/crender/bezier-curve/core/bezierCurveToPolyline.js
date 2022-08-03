const { sqrt, pow, ceil, abs } = Math

// Initialize the number of points per curve
const defaultSegmentPointsNum = 50

/**
 * @example data structure of bezierCurve
 * bezierCurve = [
 *  // Starting point of the curve
 *  [10, 10],
 *  // BezierCurve segment data (controlPoint1, controlPoint2, endPoint)
 *  [
 *    [20, 20], [40, 20], [50, 10]
 *  ],
 *  ...
 * ]
 */

/**
 * @description               Abstract the curve as a polyline consisting of N points
 * @param {Array} bezierCurve bezierCurve data
 * @param {Number} precision  calculation accuracy. Recommended for 1-20. Default = 5
 * @return {Object}           Calculation results and related data
 * @return {Array}            Option.segmentPoints Point data that constitutes a polyline after calculation
 * @return {Number}           Option.cycles Number of iterations
 * @return {Number}           Option.rounds The number of recursions for the last iteration
 */
function abstractBezierCurveToPolyline (bezierCurve, precision = 5) {
  const segmentsNum = bezierCurve.length - 1

  const startPoint = bezierCurve[0]
  const endPoint = bezierCurve[segmentsNum][2]

  const segments = bezierCurve.slice(1)

  const getSegmentTPointFuns = segments.map((seg, i) => {
    let beginPoint = (i === 0) ? startPoint : segments[i - 1][2]

    return createGetBezierCurveTPointFun(beginPoint, ...seg)
  })

  // Initialize the curve to a polyline
  let segmentPointsNum = new Array(segmentsNum).fill(defaultSegmentPointsNum)
  let segmentPoints = getSegmentPointsByNum(getSegmentTPointFuns, segmentPointsNum)

  // Calculate uniformly distributed points by iteratively
  const result = calcUniformPointsByIteration(segmentPoints, getSegmentTPointFuns, segments, precision)

  result.segmentPoints.push(endPoint)

  return result
}

/**
 * @description  Generate a method for obtaining corresponding point by t according to curve data
 * @param {Array} beginPoint    BezierCurve begin point. [x, y]
 * @param {Array} controlPoint1 BezierCurve controlPoint1. [x, y]
 * @param {Array} controlPoint2 BezierCurve controlPoint2. [x, y]
 * @param {Array} endPoint      BezierCurve end point. [x, y]
 * @return {Function} Expected function
 */
function createGetBezierCurveTPointFun (beginPoint, controlPoint1, controlPoint2, endPoint) {
  return function (t) {
    const tSubed1 = 1 - t

    const tSubed1Pow3 = pow(tSubed1, 3)
    const tSubed1Pow2 = pow(tSubed1, 2)

    const tPow3 = pow(t, 3)
    const tPow2 = pow(t, 2)

    return [
      beginPoint[0] * tSubed1Pow3 + 3 * controlPoint1[0] * t * tSubed1Pow2 + 3 * controlPoint2[0] * tPow2 * tSubed1 + endPoint[0] * tPow3,
      beginPoint[1] * tSubed1Pow3 + 3 * controlPoint1[1] * t * tSubed1Pow2 + 3 * controlPoint2[1] * tPow2 * tSubed1 + endPoint[1] * tPow3
    ]
  }
}

/**
 * @description Get the distance between two points
 * @param {Array} point1 BezierCurve begin point. [x, y]
 * @param {Array} point2 BezierCurve controlPoint1. [x, y]
 * @return {Number} Expected distance
 */
function getTwoPointDistance ([ax, ay], [bx, by]) {
  return sqrt(pow(ax - bx, 2) + pow(ay - by, 2))
}

/**
 * @description Get the sum of the array of numbers
 * @param {Array} nums An array of numbers
 * @return {Number} Expected sum
 */
function getNumsSum (nums) {
  return nums.reduce((sum, num) => sum + num, 0)
}

/**
 * @description Get the distance of multiple sets of points
 * @param {Array} segmentPoints Multiple sets of point data
 * @return {Array} Distance of multiple sets of point data
 */
function getSegmentPointsDistance (segmentPoints) {
  return segmentPoints.map((points, i) => {
    return new Array(points.length - 1)
      .fill(0)
      .map((temp, j) => getTwoPointDistance(points[j], points[j + 1]))
  })
}

/**
 * @description Get the distance of multiple sets of points
 * @param {Array} segmentPoints Multiple sets of point data
 * @return {Array} Distance of multiple sets of point data
 */
function getSegmentPointsByNum (getSegmentTPointFuns, segmentPointsNum) {
  return getSegmentTPointFuns.map((getSegmentTPointFun, i) => {
    const tGap = 1 / segmentPointsNum[i]

    return new Array(segmentPointsNum[i])
      .fill('')
      .map((foo, j) => getSegmentTPointFun(j * tGap))
  })
}

/**
 * @description Get the sum of deviations between line segment and the average length
 * @param {Array} segmentPointsDistance Segment length of polyline
 * @param {Number} avgLength            Average length of the line segment
 * @return {Number} Deviations
 */
function getAllDeviations (segmentPointsDistance, avgLength) {
  return segmentPointsDistance
    .map(seg => seg.map(s => abs(s - avgLength)))
    .map(seg => getNumsSum(seg))
    .reduce((total, v) => total + v, 0)
}

/**
 * @description Calculate uniformly distributed points by iteratively
 * @param {Array} segmentPoints        Multiple setd of points that make up a polyline
 * @param {Array} getSegmentTPointFuns Functions of get a point on the curve with t
 * @param {Array} segments             BezierCurve data
 * @param {Number} precision           Calculation accuracy
 * @return {Object} Calculation results and related data
 * @return {Array}  Option.segmentPoints Point data that constitutes a polyline after calculation
 * @return {Number} Option.cycles Number of iterations
 * @return {Number} Option.rounds The number of recursions for the last iteration
 */
function calcUniformPointsByIteration (segmentPoints, getSegmentTPointFuns, segments, precision) {
  // The number of loops for the current iteration
  let rounds = 4

  // Number of iterations
  let cycles = 1

  do {
    // Recalculate the number of points per curve based on the last iteration data
    let totalPointsNum = segmentPoints.reduce((total, seg) => total + seg.length, 0)

    // Add last points of segment to calc exact segment length
    segmentPoints.forEach((seg, i) => seg.push(segments[i][2]))

    let segmentPointsDistance = getSegmentPointsDistance(segmentPoints)

    let lineSegmentNum = segmentPointsDistance.reduce((total, seg) => total + seg.length, 0)

    let segmentlength = segmentPointsDistance.map(seg => getNumsSum(seg))

    let totalLength = getNumsSum(segmentlength)

    let avgLength = totalLength / lineSegmentNum

    // Check if precision is reached
    let allDeviations = getAllDeviations(segmentPointsDistance, avgLength)

    if (allDeviations <= precision) break

    totalPointsNum = ceil(avgLength / precision * totalPointsNum * 1.1)

    const segmentPointsNum = segmentlength.map(length => ceil(length / totalLength * totalPointsNum))

    // Calculate the points after redistribution
    segmentPoints = getSegmentPointsByNum(getSegmentTPointFuns, segmentPointsNum)

    totalPointsNum = segmentPoints.reduce((total, seg) => total + seg.length, 0)

    let segmentPointsForLength = JSON.parse(JSON.stringify(segmentPoints))

    segmentPointsForLength.forEach((seg, i) => seg.push(segments[i][2]))

    segmentPointsDistance = getSegmentPointsDistance(segmentPointsForLength)

    lineSegmentNum = segmentPointsDistance.reduce((total, seg) => total + seg.length, 0)

    segmentlength = segmentPointsDistance.map(seg => getNumsSum(seg))

    totalLength = getNumsSum(segmentlength)

    avgLength = totalLength / lineSegmentNum

    const stepSize = 1 / totalPointsNum / 10

    // Recursively for each segment of the polyline
    getSegmentTPointFuns.forEach((getSegmentTPointFun, i) => {
      const currentSegmentPointsNum = segmentPointsNum[i]

      const t = new Array(currentSegmentPointsNum).fill('').map((foo, j) => j / segmentPointsNum[i])

      // Repeated recursive offset
      for (let r = 0; r < rounds; r++) {
        let distance = getSegmentPointsDistance([segmentPoints[i]])[0]

        const deviations = distance.map(d => d - avgLength)

        let offset = 0

        for (let j = 0; j < currentSegmentPointsNum; j++) {
          if (j === 0) return

          offset += deviations[j - 1]

          t[j] -= stepSize * offset

          if (t[j] > 1) t[j] = 1
          if (t[j] < 0) t[j] = 0
          segmentPoints[i][j] = getSegmentTPointFun(t[j])
        }
      }
    })

    rounds *= 4

    cycles++
  } while (rounds <= 1025)

  segmentPoints = segmentPoints.reduce((all, seg) => all.concat(seg), [])

  return {
    segmentPoints,
    cycles,
    rounds
  }
}

/**
 * @description Get the polyline corresponding to the Bezier curve
 * @param {Array} bezierCurve BezierCurve data
 * @param {Number} precision  Calculation accuracy. Recommended for 1-20. Default = 5
 * @return {Array|Boolean} Point data that constitutes a polyline after calculation (Invalid input will return false)
 */
export function bezierCurveToPolyline (bezierCurve, precision = 5) {
  if (!bezierCurve) {
    console.error('bezierCurveToPolyline: Missing parameters!')

    return false
  }

  if (!(bezierCurve instanceof Array)) {
    console.error('bezierCurveToPolyline: Parameter bezierCurve must be an array!')

    return false
  }

  if (typeof precision !== 'number') {
    console.error('bezierCurveToPolyline: Parameter precision must be a number!')

    return false
  }

  const { segmentPoints } = abstractBezierCurveToPolyline(bezierCurve, precision)

  return segmentPoints
}

/**
 * @description Get the bezier curve length
 * @param {Array} bezierCurve bezierCurve data
 * @param {Number} precision  calculation accuracy. Recommended for 5-10. Default = 5
 * @return {Number|Boolean} BezierCurve length (Invalid input will return false)
 */
export function getBezierCurveLength (bezierCurve, precision = 5) {
  if (!bezierCurve) {
    console.error('getBezierCurveLength: Missing parameters!')

    return false
  }

  if (!(bezierCurve instanceof Array)) {
    console.error('getBezierCurveLength: Parameter bezierCurve must be an array!')

    return false
  }

  if (typeof precision !== 'number') {
    console.error('getBezierCurveLength: Parameter precision must be a number!')

    return false
  }

  const { segmentPoints } = abstractBezierCurveToPolyline(bezierCurve, precision)

  // Calculate the total length of the points that make up the polyline
  const pointsDistance = getSegmentPointsDistance([segmentPoints])[0]
  const length = getNumsSum(pointsDistance)

  return length
}

export default bezierCurveToPolyline
