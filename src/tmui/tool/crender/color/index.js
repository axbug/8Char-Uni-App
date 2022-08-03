import colorKeywords from './config/keywords'

const hexReg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
const rgbReg = /^(rgb|rgba|RGB|RGBA)/
const rgbaReg = /^(rgba|RGBA)/

/**
 * @description Color validator
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {String|Boolean} Valid color Or false
 */
function validator (color) {
  let isHex = hexReg.test(color)
  let isRgb = rgbReg.test(color)

  if (isHex || isRgb) return color

  color = getColorByKeyword(color)

  if (!color) {
    console.error('Color: Invalid color!')

    return false
  }

  return color
}

/**
 * @description Get color by keyword
 * @param {String} keyword Color keyword like red, green and etc.
 * @return {String|Boolean} Hex or rgba color (Invalid keyword will return false)
 */
function getColorByKeyword (keyword) {
  if (!keyword) {
    console.error('getColorByKeywords: Missing parameters!')

    return false
  }

  if (!colorKeywords.has(keyword)) return false

  return colorKeywords.get(keyword)
}

/**
 * @description Get the Rgb value of the color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {Array<Number>|Boolean} Rgb value of the color (Invalid input will return false)
 */
export function getRgbValue (color) {
  if (!color) {
    console.error('getRgbValue: Missing parameters!')

    return false
  }

  color = validator(color)

  if (!color) return false

  const isHex = hexReg.test(color)
  const isRgb = rgbReg.test(color)

  const lowerColor = color.toLowerCase()

  if (isHex) return getRgbValueFromHex(lowerColor)
  if (isRgb) return getRgbValueFromRgb(lowerColor)
}

/**
 * @description Get the rgb value of the hex color
 * @param {String} color Hex color
 * @return {Array<Number>} Rgb value of the color
 */
function getRgbValueFromHex (color) {
  color = color.replace('#', '')

  if (color.length === 3) color = Array.from(color).map(hexNum => hexNum + hexNum).join('')

  color = color.split('')

  return new Array(3).fill(0).map((t, i) => parseInt(`0x${color[i * 2]}${color[i * 2 + 1]}`))
}

/**
 * @description Get the rgb value of the rgb/rgba color
 * @param {String} color Hex color
 * @return {Array} Rgb value of the color
 */
function getRgbValueFromRgb (color) {
  return color
    .replace(/rgb\(|rgba\(|\)/g, '')
    .split(',')
    .slice(0, 3)
    .map(n => parseInt(n))
}

/**
 * @description Get the Rgba value of the color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {Array<Number>|Boolean} Rgba value of the color (Invalid input will return false)
 */
export function getRgbaValue (color) {
  if (!color) {
    console.error('getRgbaValue: Missing parameters!')

    return false
  }

  const colorValue = getRgbValue(color)

  if (!colorValue) return false

  colorValue.push(getOpacity(color))

  return colorValue
}

/**
 * @description Get the opacity of color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {Number|Boolean} Color opacity (Invalid input will return false)
 */
export function getOpacity (color) {
  if (!color) {
    console.error('getOpacity: Missing parameters!')

    return false
  }

  color = validator(color)

  if (!color) return false

  const isRgba = rgbaReg.test(color)

  if (!isRgba) return 1

  color = color.toLowerCase()

  return Number(color.split(',').slice(-1)[0].replace(/[)|\s]/g, ''))
}

/**
 * @description Convert color to Rgb|Rgba color
 * @param {String} color   Hex|Rgb|Rgba color or color keyword
 * @param {Number} opacity The opacity of color
 * @return {String|Boolean} Rgb|Rgba color (Invalid input will return false)
 */
export function toRgb (color, opacity) {
  if (!color) {
    console.error('toRgb: Missing parameters!')

    return false
  }

  const rgbValue = getRgbValue(color)

  if (!rgbValue) return false

  const addOpacity = typeof opacity === 'number'

  if (addOpacity) return 'rgba(' + rgbValue.join(',') + `,${opacity})`

  return 'rgb(' + rgbValue.join(',') + ')'
}

/**
 * @description Convert color to Hex color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {String|Boolean} Hex color (Invalid input will return false)
 */
export function toHex (color) {
  if (!color) {
    console.error('toHex: Missing parameters!')

    return false
  }

  if (hexReg.test(color)) return color

  color = getRgbValue(color)
  if (!color) return false

  return '#' + color
    .map(n => Number(n).toString(16))
    .map(n => n === '0' ? '00' : n)
    .join('')
}

/**
 * @description Get Color from Rgb|Rgba value
 * @param {Array<Number>} value Rgb|Rgba color value
 * @return {String|Boolean} Rgb|Rgba color (Invalid input will return false)
 */
export function getColorFromRgbValue (value) {
  if (!value) {
    console.error('getColorFromRgbValue: Missing parameters!')

    return false
  }

  const valueLength = value.length

  if (valueLength !== 3 && valueLength !== 4) {
    console.error('getColorFromRgbValue: Value is illegal!')

    return false
  }

  let color = (valueLength === 3 ? 'rgb(' : 'rgba(')

  color += value.join(',') + ')'

  return color
}

/**
 * @description Deepen color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {Number} Percent of Deepen (1-100)
 * @return {String|Boolean} Rgba color (Invalid input will return false)
 */
export function darken (color, percent = 0) {
  if (!color) {
    console.error('darken: Missing parameters!')

    return false
  }

  let rgbaValue = getRgbaValue(color)

  if (!rgbaValue) return false

  rgbaValue = rgbaValue
    .map((v, i) => (i === 3 ? v : v - Math.ceil(2.55 * percent)))
    .map(v => (v < 0 ? 0 : v))

  return getColorFromRgbValue(rgbaValue)
}

/**
 * @description Brighten color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {Number} Percent of brighten (1-100)
 * @return {String|Boolean} Rgba color (Invalid input will return false)
 */
export function lighten (color, percent = 0) {
  if (!color) {
    console.error('lighten: Missing parameters!')

    return false
  }

  let rgbaValue = getRgbaValue(color)

  if (!rgbaValue) return false

  rgbaValue = rgbaValue
    .map((v, i) => (i === 3 ? v : v + Math.ceil(2.55 * percent)))
    .map(v => (v > 255 ? 255 : v))

  return getColorFromRgbValue(rgbaValue)
}

/**
 * @description Adjust color opacity
 * @param {String} color   Hex|Rgb|Rgba color or color keyword
 * @param {Number} Percent of opacity
 * @return {String|Boolean} Rgba color (Invalid input will return false)
 */
export function fade (color, percent = 100) {
  if (!color) {
    console.error('fade: Missing parameters!')

    return false
  }

  const rgbValue = getRgbValue(color)

  if (!rgbValue) return false

  const rgbaValue = [...rgbValue, percent / 100]

  return getColorFromRgbValue(rgbaValue)
}

export default {
  fade,
  toHex,
  toRgb,
  darken,
  lighten,
  getOpacity,
  getRgbValue,
  getRgbaValue,
  getColorFromRgbValue
}
