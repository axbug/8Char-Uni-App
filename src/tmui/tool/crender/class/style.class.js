import { getRgbaValue, getColorFromRgbValue } from '../color'

import { deepClone } from '../plugin/util'

/**
 * @description Class Style
 * @param {Object} style  Style configuration
 * @return {Style} Instance of Style
 */
export default class Style {
  constructor (style) {
    this.colorProcessor(style)

    const defaultStyle = {
      /**
       * @description Rgba value of graph fill color
       * @type {Array}
       * @default fill = [0, 0, 0, 1]
       */
      fill: [0, 0, 0, 1],
      /**
       * @description Rgba value of graph stroke color
       * @type {Array}
       * @default stroke = [0, 0, 0, 1]
       */
      stroke: [0, 0, 0, 0],
      /**
       * @description Opacity of graph
       * @type {Number}
       * @default opacity = 1
       */
      opacity: 1,
      /**
       * @description LineCap of Ctx
       * @type {String}
       * @default lineCap = null
       * @example lineCap = 'butt'|'round'|'square'
       */
      lineCap: null,
      /**
       * @description Linejoin of Ctx
       * @type {String}
       * @default lineJoin = null
       * @example lineJoin = 'round'|'bevel'|'miter'
       */
      lineJoin: null,
      /**
       * @description LineDash of Ctx
       * @type {Array}
       * @default lineDash = null
       * @example lineDash = [10, 10]
       */
      lineDash: null,
      /**
       * @description LineDashOffset of Ctx
       * @type {Number}
       * @default lineDashOffset = null
       * @example lineDashOffset = 10
       */
      lineDashOffset: null,
      /**
       * @description ShadowBlur of Ctx
       * @type {Number}
       * @default shadowBlur = 0
       */
      shadowBlur: 0,
      /**
       * @description Rgba value of graph shadow color
       * @type {Array}
       * @default shadowColor = [0, 0, 0, 0]
       */
      shadowColor: [0, 0, 0, 0],
      /**
       * @description ShadowOffsetX of Ctx
       * @type {Number}
       * @default shadowOffsetX = 0
       */
      shadowOffsetX: 0,
      /**
       * @description ShadowOffsetY of Ctx
       * @type {Number}
       * @default shadowOffsetY = 0
       */
      shadowOffsetY: 0,
      /**
       * @description LineWidth of Ctx
       * @type {Number}
       * @default lineWidth = 0
       */
      lineWidth: 0,
      /**
       * @description Center point of the graph
       * @type {Array}
       * @default graphCenter = null
       * @example graphCenter = [10, 10]
       */
      graphCenter: null,
      /**
       * @description Graph scale
       * @type {Array}
       * @default scale = null
       * @example scale = [1.5, 1.5]
       */
      scale: null,
      /**
       * @description Graph rotation degree
       * @type {Number}
       * @default rotate = null
       * @example rotate = 10
       */
      rotate: null,
      /**
       * @description Graph translate distance
       * @type {Array}
       * @default translate = null
       * @example translate = [10, 10]
       */
      translate: null,
      /**
       * @description Cursor status when hover
       * @type {String}
       * @default hoverCursor = 'pointer'
       * @example hoverCursor = 'default'|'pointer'|'auto'|'crosshair'|'move'|'wait'|...
       */
      hoverCursor: 'pointer',
      /**
       * @description Font style of Ctx
       * @type {String}
       * @default fontStyle = 'normal'
       * @example fontStyle = 'normal'|'italic'|'oblique'
       */
      fontStyle: 'normal',
      /**
       * @description Font varient of Ctx
       * @type {String}
       * @default fontVarient = 'normal'
       * @example fontVarient = 'normal'|'small-caps'
       */
      fontVarient: 'normal',
      /**
       * @description Font weight of Ctx
       * @type {String|Number}
       * @default fontWeight = 'normal'
       * @example fontWeight = 'normal'|'bold'|'bolder'|'lighter'|Number
       */
      fontWeight: 'normal',
      /**
       * @description Font size of Ctx
       * @type {Number}
       * @default fontSize = 10
       */
      fontSize: 10,
      /**
       * @description Font family of Ctx
       * @type {String}
       * @default fontFamily = 'Arial'
       */
	  padding:0,
	  lineHeight:1,//行高
	  wrap:true,//是否自动断行。
	  ellipsis:false,//一行，超过省略号。
	  letterSpacing:0,
      fontFamily: 'Arial',
	  textDecoration:'none',
      /**
       * @description TextAlign of Ctx
       * @type {String}
       * @default textAlign = 'center'
       * @example textAlign = 'start'|'end'|'left'|'right'|'center'
       */
      textAlign: 'left',
      /**
       * @description TextBaseline of Ctx
       * @type {String}
       * @default textBaseline = 'middle'
       * @example textBaseline = 'top'|'bottom'|'middle'|'alphabetic'|'hanging'
       */
      textBaseline: 'middle',
      /**
       * @description The color used to create the gradient
       * @type {Array}
       * @default gradientColor = null
       * @example gradientColor = ['#000', '#111', '#222']
       */
      gradientColor: null,
      /**
       * @description Gradient type
       * @type {String}
       * @default gradientType = 'linear'
       * @example gradientType = 'linear' | 'radial'
       */
      gradientType: 'linear',
      /**
       * @description Gradient params
       * @type {Array}
       * @default gradientParams = null
       * @example gradientParams = [x0, y0, x1, y1] (Linear Gradient)
       * @example gradientParams = [x0, y0, r0, x1, y1, r1] (Radial Gradient)
       */
      gradientParams: null,
      /**
       * @description When to use gradients
       * @type {String}
       * @default gradientWith = 'stroke'
       * @example gradientWith = 'stroke' | 'fill'
       */
      gradientWith: 'stroke',
      /**
       * @description Gradient color stops
       * @type {String}
       * @default gradientStops = 'auto'
       * @example gradientStops = 'auto' | [0, .2, .3, 1]
       */
      gradientStops: 'auto',
      /**
       * @description Extended color that supports animation transition
       * @type {Array|Object}
       * @default colors = null
       * @example colors = ['#000', '#111', '#222', 'red' ]
       * @example colors = { a: '#000', b: '#111' }
       */
      colors: null
    }

    Object.assign(this, defaultStyle, style)
  }
}

/**
 * @description Set colors to rgba value
 * @param {Object} style style config
 * @param {Boolean} reverse Whether to perform reverse operation
 * @return {Undefined} Void
 */
Style.prototype.colorProcessor = function (style, reverse = false) {
  const processor = reverse ? getColorFromRgbValue : getRgbaValue

  const colorProcessorKeys = ['fill', 'stroke', 'shadowColor']

  const allKeys = Object.keys(style)

  const colorKeys = allKeys.filter(key => colorProcessorKeys.find(k => k === key))

  colorKeys.forEach(key => (style[key] = processor(style[key])))

  const { gradientColor, colors } = style

  if (gradientColor) style.gradientColor = gradientColor.map(c => processor(c))

  if (colors) {
    const colorsKeys = Object.keys(colors)

    colorsKeys.forEach(key => (colors[key] = processor(colors[key])))
  }
}

/**
 * @description Init graph style
 * @param {Object} ctx Context of canvas
 * @return {Undefined} Void
 */
Style.prototype.initStyle = function (ctx,shape) {
  initTransform(ctx, this)

  initGraphStyle(ctx, this)

  initGradient(ctx, this,shape)
}

/**
 * @description Init canvas transform
 * @param {Object} ctx  Context of canvas
 * @param {Style} style Instance of Style
 * @return {Undefined} Void
 */
function initTransform (ctx, style) {
  ctx.save()

  const { graphCenter, rotate, scale, translate } = style

  if (!(graphCenter instanceof Array)) return
  if(graphCenter.length>0)  ctx.translate(...graphCenter);

  if (rotate) ctx.rotate(rotate * Math.PI / 180)

  if (scale instanceof Array) ctx.scale(...scale)

  if (translate) ctx.translate(...translate)

  ctx.translate(-graphCenter[0], -graphCenter[1])
}

const autoSetStyleKeys = [
  'lineCap', 'lineJoin', 'lineDashOffset',
  'shadowOffsetX', 'shadowOffsetY', 'lineWidth',
  'textAlign', 'textBaseline'
]

/**
 * @description Set the style of canvas ctx
 * @param {Object} ctx  Context of canvas
 * @param {Style} style Instance of Style
 * @return {Undefined} Void
 */
function initGraphStyle (ctx, style) {
  let { fill, stroke, shadowColor, opacity } = style

  autoSetStyleKeys.forEach(key => {
    if (key || typeof key === 'number') ctx[key] = style[key]
  })

  fill = [...fill]
  stroke = [...stroke]
  shadowColor = [...shadowColor]

  fill[3] *= opacity
  stroke[3] *= opacity
  shadowColor[3] *= opacity
  
  ctx.fillStyle = getColorFromRgbValue(fill)
  ctx.strokeStyle = getColorFromRgbValue(stroke)
  ctx.shadowColor = getColorFromRgbValue(shadowColor)

  let { lineDash, shadowBlur } = style

  if (lineDash) {
    lineDash = lineDash.map(v => v >= 0 ? v : 0)

    ctx.setLineDash(lineDash)
  }

  if (typeof shadowBlur === 'number') ctx.shadowBlur = shadowBlur > 0 ? shadowBlur : 0.001

  const { fontStyle, fontVarient, fontWeight, fontSize, fontFamily } = style

  ctx.font = fontStyle + ' ' + fontVarient + ' ' + fontWeight + ' ' + fontSize + 'px' + ' ' + fontFamily
}

/**
 * @description Set the gradient color of canvas ctx
 * @param {Object} ctx  Context of canvas
 * @param {Style} style Instance of Style
 * @return {Undefined} Void
 */
function initGradient (ctx, style,shape) {
  if (!gradientValidator(style)) return
  
  let { gradientColor, gradientParams, gradientType, gradientWith, gradientStops, opacity } = style

  gradientColor = gradientColor.map(color => {
    let colorOpacity = color[3] * opacity

    let clonedColor = [...color]

    clonedColor[3] = colorOpacity

    return clonedColor
  })

  gradientColor = gradientColor.map(c => getColorFromRgbValue(c))

  if (gradientStops === 'auto') gradientStops = getAutoColorStops(gradientColor)
  let gra = [...gradientParams];
  if(gradientType =='linear'){
	  gra[0] =shape.x + gradientParams[0]
	  gra[1] =shape.y + gradientParams[1]
	  gra[2] =shape.x +gradientParams[2]
	  gra[3] =shape.y +gradientParams[3]
  }
  
  const gradient = ctx[`create${gradientType.slice(0, 1).toUpperCase() + gradientType.slice(1)}Gradient`](...gra)

  gradientStops.forEach((stop, i) => gradient.addColorStop(stop, gradientColor[i]))

  ctx[`${gradientWith}Style`] = gradient
}

/**
 * @description Check if the gradient configuration is legal
 * @param {Style} style Instance of Style
 * @return {Boolean} Check Result
 */
function gradientValidator (style) {
  const { gradientColor, gradientParams, gradientType, gradientWith, gradientStops } = style

  if (!gradientColor || !gradientParams) return false

  if (gradientColor.length === 1) {
    console.warn('The gradient needs to provide at least two colors')

    return false
  }

  if (gradientType !== 'linear' && gradientType !== 'radial') {
    console.warn('GradientType only supports linear or radial, current value is ' + gradientType)

    return false
  }

  const gradientParamsLength = gradientParams.length

  if (
    (gradientType === 'linear' && gradientParamsLength !== 4) ||
    (gradientType === 'radial' && gradientParamsLength !== 6)
  ) {
    console.warn('The expected length of gradientParams is ' + (gradientType === 'linear' ? '4' : '6'))

    return false
  }

  if (gradientWith !== 'fill' && gradientWith !== 'stroke') {
    console.warn('GradientWith only supports fill or stroke, current value is ' + gradientWith)

    return false
  }

  if (gradientStops !== 'auto' && !(gradientStops instanceof Array)) {
    console.warn(`gradientStops only supports 'auto' or Number Array ([0, .5, 1]), current value is ` + gradientStops)

    return false
  }

  return true
}

/**
 * @description Get a uniform gradient color stop
 * @param {Array} color Gradient color
 * @return {Array} Gradient color stop
 */
function getAutoColorStops (color) {
  const stopGap = 1 / (color.length - 1)

  return color.map((foo, i) => stopGap * i)
}

/**
 * @description Restore canvas ctx transform
 * @param {Object} ctx  Context of canvas
 * @return {Undefined} Void
 */
Style.prototype.restoreTransform = function (ctx) {
  ctx.restore()
}

/**
 * @description Update style data
 * @param {Object} change Changed data
 * @return {Undefined} Void
 */
Style.prototype.update = function (change) {
  this.colorProcessor(change)

  Object.assign(this, change)
}

/**
 * @description Get the current style configuration
 * @return {Object} Style configuration
 */
Style.prototype.getStyle = function () {
  const clonedStyle = deepClone(this, true)

  this.colorProcessor(clonedStyle, true)

  return clonedStyle
}
