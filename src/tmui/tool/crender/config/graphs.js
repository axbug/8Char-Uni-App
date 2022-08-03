import beziercurve from '../bezier-curve'
import {
	calcLength,
	getPointOnQuadraticBezier,
	getTensionPointsClosed,
	expandPoints
} from '../bezier-curve/core/path2d'

import {
	deepClone,
	eliminateBlur,
	checkPointIsInCircle,
	getTwoPointDistance,
	checkPointIsInSector,
	getRegularPolygonPoints,
	checkPointIsInPolygon,
	checkPointIsNearPolyline,
	checkPointIsInRect
} from '../plugin/util'

import {
	drawPolylinePath,
	drawBezierCurvePath
} from '../plugin/canvas'

const {
	polylineToBezierCurve,
	bezierCurveToPolyline
} = beziercurve

export const circle = {
	shape: {
		rx: 0,
		ry: 0,
		r: 0
	},

	validator({
		shape
	}) {
		const {
			rx,
			ry,
			r
		} = shape

		if (typeof rx !== 'number' || typeof ry !== 'number' || typeof r !== 'number') {
			console.error('Circle shape configuration is abnormal!')

			return false
		}

		return true
	},

	draw({
		ctx
	}, {
		shape
	}) {
		ctx.beginPath()

		const {
			rx,
			ry,
			r
		} = shape

		ctx.arc(rx, ry, r > 0 ? r : 0.01, 0, Math.PI * 2)

		ctx.fill()
		ctx.stroke()

		ctx.closePath()

		// ctx.draw()
	},

	hoverCheck(position, {
		shape
	}) {
		const {
			rx,
			ry,
			r
		} = shape

		return checkPointIsInCircle(position, rx, ry, r)
	},

	setGraphCenter(e, {
		shape,
		style
	}) {
		const {
			rx,
			ry
		} = shape

		style.graphCenter = [rx, ry]
	},

	move({
		movementX,
		movementY
	}, {
		shape
	}) {
		this.attr('shape', {
			rx: shape.rx + movementX,
			ry: shape.ry + movementY
		})
	}
}

export const ellipse = {
	shape: {
		rx: 0,
		ry: 0,
		hr: 0,
		vr: 0
	},

	validator({
		shape
	}) {
		const {
			rx,
			ry,
			hr,
			vr
		} = shape

		if (typeof rx !== 'number' || typeof ry !== 'number' || typeof hr !== 'number' || typeof vr !== 'number') {
			console.error('Ellipse shape configuration is abnormal!')

			return false
		}

		return true
	},

	draw({
		ctx
	}, {
		shape
	}) {
		ctx.beginPath()

		let {
			rx,
			ry,
			hr,
			vr
		} = shape

		ctx.ellipse(rx, ry, hr > 0 ? hr : 0.01, vr > 0 ? vr : 0.01, 0, 0, Math.PI * 2)

		ctx.fill()
		ctx.stroke()

		ctx.closePath()
		// ctx.draw()
	},

	hoverCheck(position, {
		shape
	}) {
		const {
			rx,
			ry,
			hr,
			vr
		} = shape

		const a = Math.max(hr, vr)
		const b = Math.min(hr, vr)

		const c = Math.sqrt(a * a - b * b)

		const leftFocusPoint = [rx - c, ry]
		const rightFocusPoint = [rx + c, ry]

		const distance = getTwoPointDistance(position, leftFocusPoint) + getTwoPointDistance(position,
			rightFocusPoint)

		return distance <= 2 * a
	},

	setGraphCenter(e, {
		shape,
		style
	}) {
		const {
			rx,
			ry
		} = shape

		style.graphCenter = [rx, ry]
	},

	move({
		movementX,
		movementY
	}, {
		shape
	}) {
		this.attr('shape', {
			rx: shape.rx + movementX,
			ry: shape.ry + movementY
		})
	}
}

export const rect = {
	shape: {
		x: 0,
		y: 0,
		w: 0,
		h: 0
	},

	validator({
		shape
	}) {
		const {
			x,
			y,
			w,
			h
		} = shape

		if (typeof x !== 'number' || typeof y !== 'number' || typeof w !== 'number' || typeof h !== 'number') {
			console.error('Rect shape configuration is abnormal!')

			return false
		}

		return true
	},

	draw({
		ctx
	}, {
		shape
	}) {
		ctx.beginPath()

		let {
			x,
			y,
			w,
			h
		} = shape

		ctx.rect(x, y, w, h)

		ctx.fill()
		ctx.stroke()

		ctx.closePath()
		// ctx.draw()


	},

	hoverCheck(position, {
		shape
	}) {
		let {
			x,
			y,
			w,
			h
		} = shape

		return checkPointIsInRect(position, x, y, w, h)
	},

	setGraphCenter(e, {
		shape,
		style
	}) {
		const {
			x,
			y,
			w,
			h
		} = shape

		style.graphCenter = [x + w / 2, y + h / 2]
	},

	move({
		movementX,
		movementY
	}, {
		shape
	}) {
		this.attr('shape', {
			x: shape.x + movementX,
			y: shape.y + movementY
		})
	}
}

export const rectRound = {
	shape: {
		x: 0,
		y: 0,
		w: 0,
		h: 0,
		radius:[0,0,0,0],
		close:false,//true时为填充，否则描边。
	},

	validator({
		shape
	}) {
		const {
			x,
			y,
			w,
			h
		} = shape

		if (typeof x !== 'number' || typeof y !== 'number' || typeof w !== 'number' || typeof h !== 'number') {
			console.error('Rect shape configuration is abnormal!')

			return false
		}

		return true
	},

	draw({
		ctx
	}, {
		shape
	}) {
		ctx.beginPath()

		let {
			x,
			y,
			w,
			h,
			radius,
			close
		} = shape
		
		if(typeof radius ==='number'){
			radius = [radius,radius,radius,radius]
		}
			const cxt = ctx;
		 let width = w,height = h;
		  var  r0 = radius[0],r1 = radius[1],r2 = radius[2],r3 = radius[3];
		  cxt.beginPath();
		  //从右下角顺时针绘制，弧度从0到1/2PI  
		  cxt.arc(width - r0+x, height - r0+y, r0, 0, Math.PI / 2);
	
		  //矩形下边线  
		  cxt.lineTo(r1+x, height+y);
	
		  //左下角圆弧，弧度从1/2PI到PI  
		  cxt.arc(r1+x, height - r1+y, r1, Math.PI / 2, Math.PI);
	
		  //矩形左边线  
		  cxt.lineTo(x, r2+y);
	
		  //左上角圆弧，弧度从PI到3/2PI  
		  cxt.arc(r2+x, r2+y, r2, Math.PI, Math.PI * 3 / 2);
	
		  //上边线  
		  cxt.lineTo(width - r3+x, y);
	
		  //右上角圆弧  
		  cxt.arc(width - r3+x, r3+y, r3, Math.PI * 3 / 2, Math.PI * 2);
	
		  //右边线  
		  cxt.lineTo(width+x, height+y-r0);
		  ctx.stroke()
		  if(close){
			  ctx.fill()
		  }

		cxt.closePath();


	},

	hoverCheck(position, {
		shape,style,
	}) {
		let {
			x,
			y,
			w,
			h
		} = shape
		let {lineWidth} = style;
		return checkPointIsInRect(position, x-lineWidth, y-lineWidth, w+lineWidth, h+lineWidth)
	},

	setGraphCenter(e, {
		shape,
		style
	}) {
		const {
			x,
			y,
			w,
			h
		} = shape

		style.graphCenter = [x + w / 2, y + h / 2]
	},

	move({
		movementX,
		movementY
	}, {
		shape
	}) {
		this.attr('shape', {
			x: shape.x + movementX,
			y: shape.y + movementY
		})
	}
}


export const ring = {
	shape: {
		rx: 0,
		ry: 0,
		r: 0
	},

	validator({
		shape
	}) {
		const {
			rx,
			ry,
			r
		} = shape

		if (typeof rx !== 'number' || typeof ry !== 'number' || typeof r !== 'number') {
			console.error('Ring shape configuration is abnormal!')

			return false
		}

		return true
	},

	draw({
		ctx
	}, {
		shape
	}) {
		ctx.beginPath()

		const {
			rx,
			ry,
			r
		} = shape

		ctx.arc(rx, ry, r > 0 ? r : 0.01, 0, Math.PI * 2)

		ctx.stroke()

		ctx.closePath()
		// ctx.draw()
	},

	hoverCheck(position, {
		shape,
		style
	}) {
		const {
			rx,
			ry,
			r
		} = shape

		const {
			lineWidth
		} = style

		const halfLineWidth = lineWidth / 2

		const minDistance = r - halfLineWidth
		const maxDistance = r + halfLineWidth

		const distance = getTwoPointDistance(position, [rx, ry])

		return (distance >= minDistance && distance <= maxDistance)
	},

	setGraphCenter(e, {
		shape,
		style
	}) {
		const {
			rx,
			ry
		} = shape

		style.graphCenter = [rx, ry]
	},

	move({
		movementX,
		movementY
	}, {
		shape
	}) {
		this.attr('shape', {
			rx: shape.rx + movementX,
			ry: shape.ry + movementY
		})
	}
}

export const arc = {
	shape: {
		rx: 0,
		ry: 0,
		r: 0,
		startAngle: 0,
		endAngle: 0,
		clockWise: true
	},

	validator({
		shape
	}) {
		const keys = ['rx', 'ry', 'r', 'startAngle', 'endAngle']

		if (keys.find(key => typeof shape[key] !== 'number')) {
			console.error('Arc shape configuration is abnormal!')

			return false
		}

		return true
	},

	draw({
		ctx
	}, {
		shape
	}) {
		ctx.beginPath()

		const {
			rx,
			ry,
			r,
			startAngle,
			endAngle,
			clockWise
		} = shape

		ctx.arc(rx, ry, r > 0 ? r : 0.001, startAngle, endAngle, !clockWise)

		ctx.stroke()

		ctx.closePath()
		// ctx.draw(true)
	},

	hoverCheck(position, {
		shape,
		style
	}) {
		const {
			rx,
			ry,
			r,
			startAngle,
			endAngle,
			clockWise
		} = shape

		const {
			lineWidth
		} = style

		const halfLineWidth = lineWidth / 2

		const insideRadius = r - halfLineWidth
		const outsideRadius = r + halfLineWidth

		return !checkPointIsInSector(position, rx, ry, insideRadius, startAngle, endAngle, clockWise) &&
			checkPointIsInSector(position, rx, ry, outsideRadius, startAngle, endAngle, clockWise)
	},

	setGraphCenter(e, {
		shape,
		style
	}) {
		const {
			rx,
			ry
		} = shape

		style.graphCenter = [rx, ry]
	},

	move({
		movementX,
		movementY
	}, {
		shape
	}) {
		this.attr('shape', {
			rx: shape.rx + movementX,
			ry: shape.ry + movementY
		})
	}
}

export const sector = {
	shape: {
		rx: 0,
		ry: 0,
		r: 0,
		startAngle: 0,
		endAngle: 0,
		clockWise: true
	},

	validator({
		shape
	}) {
		const keys = ['rx', 'ry', 'r', 'startAngle', 'endAngle']

		if (keys.find(key => typeof shape[key] !== 'number')) {
			console.error('Sector shape configuration is abnormal!')

			return false
		}

		return true
	},

	draw({
		ctx
	}, {
		shape
	}) {
		ctx.beginPath()

		const {
			rx,
			ry,
			r,
			startAngle,
			endAngle,
			clockWise
		} = shape

		ctx.arc(rx, ry, r > 0 ? r : 0.01, startAngle, endAngle, !clockWise)

		ctx.lineTo(rx, ry)

		ctx.closePath()

		ctx.stroke()
		ctx.fill()
		// ctx.draw()
	},

	hoverCheck(position, {
		shape
	}) {
		const {
			rx,
			ry,
			r,
			startAngle,
			endAngle,
			clockWise
		} = shape

		return checkPointIsInSector(position, rx, ry, r, startAngle, endAngle, clockWise)
	},

	setGraphCenter(e, {
		shape,
		style
	}) {
		const {
			rx,
			ry
		} = shape

		style.graphCenter = [rx, ry]
	},

	move({
		movementX,
		movementY
	}, {
		shape
	}) {
		const {
			rx,
			ry
		} = shape

		this.attr('shape', {
			rx: rx + movementX,
			ry: ry + movementY
		})
	}
}

export const regPolygon = {
	shape: {
		rx: 0,
		ry: 0,
		r: 0,
		side: 0
	},

	validator({
		shape
	}) {
		const {
			side
		} = shape

		const keys = ['rx', 'ry', 'r', 'side']

		if (keys.find(key => typeof shape[key] !== 'number')) {
			console.error('RegPolygon shape configuration is abnormal!')

			return false
		}

		if (side < 3) {
			console.error('RegPolygon at least trigon!')

			return false
		}

		return true
	},

	draw({
		ctx
	}, {
		shape,
		cache
	}) {
		ctx.beginPath()

		const {
			rx,
			ry,
			r,
			side
		} = shape

		if (!cache.points || cache.rx !== rx || cache.ry !== ry || cache.r !== r || cache.side !== side) {
			const points = getRegularPolygonPoints(rx, ry, r, side)

			Object.assign(cache, {
				points,
				rx,
				ry,
				r,
				side
			})
		}

		const {
			points
		} = cache

		drawPolylinePath(ctx, points)

		ctx.closePath()

		ctx.stroke()
		ctx.fill()
		// ctx.draw()
	},

	hoverCheck(position, {
		cache
	}) {
		let {
			points
		} = cache

		return checkPointIsInPolygon(position, points)
	},

	setGraphCenter(e, {
		shape,
		style
	}) {
		const {
			rx,
			ry
		} = shape

		style.graphCenter = [rx, ry]
	},

	move({
		movementX,
		movementY
	}, {
		shape,
		cache
	}) {
		const {
			rx,
			ry
		} = shape

		cache.rx += movementX
		cache.ry += movementY

		this.attr('shape', {
			rx: rx + movementX,
			ry: ry + movementY
		})

		cache.points = cache.points.map(([x, y]) => [x + movementX, y + movementY])
	}
}

export const polyline = {
	shape: {
		points: [],
		close: false
	},

	validator({
		shape
	}) {
		const {
			points
		} = shape

		if (!(points instanceof Array)) {
			console.error('Polyline points should be an array!')

			return false
		}

		return true
	},

	draw({
		ctx
	}, {
		shape,
		style: {
			lineWidth
		}
	}) {
		ctx.beginPath()

		let {
			points,
			close
		} = shape

		if (lineWidth === 1) points = eliminateBlur(points)

		drawPolylinePath(ctx, points)

		if (close) {
			ctx.closePath()

			ctx.fill()
			ctx.stroke()
		} else {
			ctx.stroke()

		}
		// ctx.draw()
	},

	hoverCheck(position, {
		shape,
		style
	}) {
		const {
			points,
			close
		} = shape

		const {
			lineWidth
		} = style

		if (close) {
			return checkPointIsInPolygon(position, points)
		} else {
			return checkPointIsNearPolyline(position, points, lineWidth)
		}
	},

	setGraphCenter(e, {
		shape,
		style
	}) {
		const {
			points
		} = shape

		style.graphCenter = points[0]
	},

	move({
		movementX,
		movementY
	}, {
		shape
	}) {
		const {
			points
		} = shape

		const moveAfterPoints = points.map(([x, y]) => [x + movementX, y + movementY])

		this.attr('shape', {
			points: moveAfterPoints
		})
	}
}

export const smoothline = {
	shape: {
		points: [],
		close: false
	},

	validator({
		shape
	}) {
		const {
			points
		} = shape

		if (!(points instanceof Array)) {
			console.error('Smoothline points should be an array!')

			return false
		}

		return true
	},

	draw({
		ctx
	}, {
		shape,
		cache
	}) {
		const {
			points,
			close
		} = shape

		if (!cache.points || cache.points.toString() !== points.toString()) {
			const bezierCurve = polylineToBezierCurve(points, close)
			const hoverPoints = bezierCurveToPolyline(bezierCurve)

			Object.assign(cache, {
				points: deepClone(points, true),
				bezierCurve,
				hoverPoints
			})
		}

		const {
			bezierCurve
		} = cache

		ctx.beginPath()

		drawBezierCurvePath(ctx, bezierCurve.slice(1), bezierCurve[0])

		if (close) {
			ctx.closePath()

			ctx.fill()
			ctx.stroke()
		} else {
			ctx.stroke()
		}
		// ctx.draw()
	},

	hoverCheck(position, {
		cache,
		shape,
		style
	}) {
		const {
			hoverPoints
		} = cache

		const {
			close
		} = shape

		const {
			lineWidth
		} = style

		if (close) {
			return checkPointIsInPolygon(position, hoverPoints)
		} else {
			return checkPointIsNearPolyline(position, hoverPoints, lineWidth)
		}
	},

	setGraphCenter(e, {
		shape,
		style
	}) {
		const {
			points
		} = shape

		style.graphCenter = points[0]
	},

	move({
		movementX,
		movementY
	}, {
		shape,
		cache
	}) {
		const {
			points
		} = shape

		const moveAfterPoints = points.map(([x, y]) => [x + movementX, y + movementY])

		cache.points = moveAfterPoints

		const [fx, fy] = cache.bezierCurve[0]
		const curves = cache.bezierCurve.slice(1)

		cache.bezierCurve = [
			[fx + movementX, fy + movementY],
			...curves.map(curve => curve.map(([x, y]) => [x + movementX, y + movementY]))
		]

		cache.hoverPoints = cache.hoverPoints.map(([x, y]) => [x + movementX, y + movementY])

		this.attr('shape', {
			points: moveAfterPoints
		})
	}
}

export const bezierCurve = {
	shape: {
		points: [],
		close: false
	},

	validator({
		shape
	}) {
		const {
			points
		} = shape

		if (!(points instanceof Array)) {
			console.error('BezierCurve points should be an array!')

			return false
		}

		return true
	},

	draw({
		ctx
	}, {
		shape,
		cache
	}) {
		let {
			points,
			close
		} = shape

		if (!cache.points || cache.points.toString() !== points.toString()) {
			const hoverPoints = bezierCurveToPolyline(points, 20)

			Object.assign(cache, {
				points: deepClone(points, true),
				hoverPoints
			})
		}

		ctx.beginPath()

		drawBezierCurvePath(ctx, points.slice(1), points[0])

		if (close) {
			ctx.closePath()

			ctx.fill()
			ctx.stroke()
		} else {
			ctx.stroke()
		}
		// ctx.draw()
	},

	hoverCheck(position, {
		cache,
		shape,
		style
	}) {
		const {
			hoverPoints
		} = cache

		const {
			close
		} = shape

		const {
			lineWidth
		} = style

		if (close) {
			return checkPointIsInPolygon(position, hoverPoints)
		} else {
			return checkPointIsNearPolyline(position, hoverPoints, lineWidth)
		}
	},

	setGraphCenter(e, {
		shape,
		style
	}) {
		const {
			points
		} = shape

		style.graphCenter = points[0]
	},

	move({
		movementX,
		movementY
	}, {
		shape,
		cache
	}) {
		const {
			points
		} = shape

		const [fx, fy] = points[0]
		const curves = points.slice(1)

		const bezierCurve = [
			[fx + movementX, fy + movementY],
			...curves.map(curve => curve.map(([x, y]) => [x + movementX, y + movementY]))
		]

		cache.points = bezierCurve
		cache.hoverPoints = cache.hoverPoints.map(([x, y]) => [x + movementX, y + movementY])

		this.attr('shape', {
			points: bezierCurve
		})
	}
}

export const text = {
	shape: {
		content: '',
		position: [],
		x: 0,
		y: 0,
		rowGap: 0
	},

	validator({
		shape,
		style
	}, ctx) {
		const {
			content,
			position,
			rowGap
		} = shape

		if (typeof content !== 'string') {
			console.error('Text content should be a string!')

			return false
		}

		if (!(position instanceof Array)) {
			console.error('Text position should be an array!')

			return false
		}

		if (typeof rowGap !== 'number') {
			console.error('Text rowGap should be a number!')

			return false
		}
		this.textWidth = 0
		this.textHeight = 0

		return true
	},
	measureSize(ctx, text) {
		var _context = ctx,
			fontSize = this.fontSize(),
			metrics;
		_context.save();
		_context.font = ctx.font;
		metrics = _context.measureText(text + "");
		_context.restore();
		return {
			width: metrics.width,
			height: fontSize,
		};
	},
	draw({
		ctx,
		area
	}, {
		shape,
		style
	}) {

		let {
			content,
			position,
			maxWidth,
			rowGap,

		} = shape
		let {
			lineWidth
		} = style;
		const {
			textBaseline,
			font,

		} = ctx
		const [w, h] = area
		const fontSize = parseInt(font.replace(/\D/g, ''))

		let [x, y] = position

		content = content.split('\n')
		const rowNum = content.length

		const lineHeight = fontSize + rowGap
		const allHeight = rowNum * lineHeight - rowGap

		let offset = 0

		if (textBaseline === 'middle') {
			offset = allHeight / 2
			y += fontSize / 2
		}

		if (textBaseline === 'bottom') {
			offset = allHeight
			y += fontSize
		}

		position = new Array(rowNum).fill(0).map((foo, i) => [x, y + i * lineHeight - offset])

		if (typeof maxWidth == 'undefined' || !maxWidth) maxWidth = w
		// #ifdef H5
		maxWidth = maxWidth * ctx.dpr
		
		// #endif
		let maxwi = []
		ctx.beginPath()
		content.forEach((text, i) => {
			ctx.fillText(text, ...position[i], maxWidth)
			if (lineWidth > 0) {
				ctx.strokeText(text, ...position[i], maxWidth)
			}

			maxwi.push(ctx.measureText(text + "").width)

		})

		ctx.closePath()
		this.textWidth = Math.max(...maxwi)
		
		this.textHeight = allHeight

	},

	hoverCheck(position, {
		cache,
		shape,
		style
	}) {
		const [x, y] = shape.position;
		const {
			textBaseline
		} = style;
		var w = this?.textWidth ?? 0;
		var h = this?.textHeight ?? 0;

		let isCheck = false;

		if (textBaseline == 'top') {
			if (position[0] >= x && position[0] <= x + w && position[1] >= y && position[1] <= y + h) {
				isCheck = true;
			}
		} else if (textBaseline == 'bottom') {
			if (position[0] >= x && position[0] <= x + w && position[1] >= y + h && position[1] <= y + h * 2) {
				isCheck = true;
			}
		} else if (textBaseline == 'middle') {
			if (position[0] >= x && position[0] <= x + w && position[1] >= y - h / 2 && position[1] <= y + h - h /
				2) {
				isCheck = true;
			}
		}
		return isCheck;

	},

	setGraphCenter(e, {
		shape,
		style
	}) {
		const {
			position
		} = shape

		style.graphCenter = [...position]
	},

	move({
		movementX,
		movementY
	}, {
		shape
	}) {
		const {
			position: [x, y]
		} = shape

		this.attr('shape', {
			position: [x + movementX, y + movementY]
		})
	}
}

export const path = {
	shape: {
		points: [],
		close: false
	},

	validator({
		shape
	}) {
		const {
			points
		} = shape

		if (!(points instanceof Array)) {
			console.error('Polyline points should be an array!')

			return false
		}

		return true
	},

	draw({
		ctx
	}, {
		shape,
		style: {
			lineWidth
		}
	}) {
		ctx.beginPath()

		let {
			points,
			close
		} = shape

		if (lineWidth === 1) points = eliminateBlur(points)

		drawPolylinePath(ctx, points)

		if (close) {
			ctx.closePath()

			ctx.fill()
			ctx.stroke()
		} else {
			ctx.stroke()

		}
		ctx.draw()
	},

	hoverCheck(position, {
		shape,
		style
	}) {
		const {
			points,
			close
		} = shape

		const {
			lineWidth
		} = style

		if (close) {

			return checkPointIsInPolygon(position, points)
		} else {
			return checkPointIsNearPolyline(position, points, lineWidth)
		}
	},

	setGraphCenter(e, {
		shape,
		style
	}) {
		const {
			points
		} = shape

		style.graphCenter = points[0]
	},

	move({
		movementX,
		movementY
	}, {
		shape
	}) {
		const {
			points
		} = shape

		const moveAfterPoints = points.map(([x, y]) => [x + movementX, y + movementY])

		this.attr('shape', {
			points: moveAfterPoints
		})
	}
}

export const image = {
	shape: {
		x: 0,
		y: 0,
		w: 0,
		h: 0,
		sx: 0,
		sy: 0,
		src: ''
	},

	validator({
		shape
	}) {
		const {
			x,
			y,
			w,
			h,
			src
		} = shape

		if (typeof x !== 'number' || typeof y !== 'number' || typeof w !== 'number' || typeof h !== 'number' || !
			src) {
			console.error('image x,y,w,h,src必填。')

			return false
		}

		return true
	},

	draw({
		ctx,
		cav
	}, {
		shape
	}) {

		let {
			x,
			y,
			w,
			h,
			sx,
			sy,
			src
		} = shape

		let t = this;
		// #ifdef MP-WEIXIN
		//1加载中，2加载完成，3从未加载。
		if (typeof this['isLoad'] == 'undefined' || this['isLoad'] == 3) {
			
			this['isLoad'] = 1;
			const bg = cav.createImage()


			bg.onload = () => {

				setTimeout(function() {
					console.warn('tm-render:图片加载完成')
					ctx.drawImage(bg, x, y, w, h)
					t['isLoad'] = 2;
					shape.src = bg
					if(t?.load){
						t.load();
					}
				}, 400)
			}
			bg.onerror = () => t['isLoad'] = 3
			bg.src = src;
		}
		if (this['isLoad'] == 2) {
			
			ctx.drawImage(src, x, y, w, h)
			
		} else {
			console.log('image loadding...');
		}

		// #endif

		// #ifndef MP-WEIXIN
		
		if(typeof this['isLoad'] =='undefined') this['isLoad'] = 3;
		if(this['isLoad']===3){
			this['isLoad'] = 1;
			
			setTimeout(()=>{
				t['isLoad'] = 2;
				if(this?.load){
					this.load();
				}
			},1200)
		}
		
		ctx.drawImage(src, x, y, w, h, sx, sy)
		
		// #endif


	},

	hoverCheck(position, {
		shape
	}) {
		let {
			x,
			y,
			w,
			h
		} = shape

		return checkPointIsInRect(position, x, y, w, h)
	},

	setGraphCenter(e, {
		shape,
		style
	}) {
		const {
			x,
			y,
			w,
			h
		} = shape

		style.graphCenter = [x + w / 2, y + h / 2]
	},

	move({
		movementX,
		movementY
	}, {
		shape
	}) {
		this.attr('shape', {
			x: shape.x + movementX,
			y: shape.y + movementY
		})
	}
}

export const star = {
	shape: {
		points: [],
		close: false,
		x: 0,
		y: 0,
		numPoints: 5, //星星的角数量
		innerRadius: 40, //内部凹进去的比例
		outerRadius: 70, //角向外凸出的比例。
	},

	validator({
		shape
	}) {
		const {
			points,
			x,
			y
		} = shape

		if (typeof x !== 'number' || typeof y !== 'number') {
			console.error('Polyline points should be an array!')

			return false
		}

		return true
	},

	draw({
		ctx
	}, {
		shape,
		style: {
			lineWidth
		}
	}) {
		let context = ctx;
		let {
			points,
			close,
			x,
			y,
			numPoints,
			innerRadius,
			outerRadius
		} = shape;

		context.beginPath();
		context.moveTo(x, y - outerRadius);


		points.push([x, y - outerRadius])

		for (var n = 1; n <= numPoints * 2; n++) {
			var radius = n % 2 === 0 ? outerRadius : innerRadius;
			var x2 = radius * Math.sin((n * Math.PI) / numPoints);
			var y2 = -1 * radius * Math.cos((n * Math.PI) / numPoints);
			context.lineTo(x2 + x, y2 + y);

			points.push([x2 + x, y2 + y])
		}

		this.shape.points = points;
		if (lineWidth === 1) points = eliminateBlur(points)

		if (close) {
			ctx.closePath()

			ctx.fill()
			ctx.stroke()
		} else {
			ctx.stroke()

		}
		// ctx.draw()
	},

	hoverCheck(position, {
		shape,
		style
	}) {
		const {
			points,
			close
		} = shape

		const {
			lineWidth
		} = style

		if (close) {
			return checkPointIsInPolygon(position, points)
		} else {
			return checkPointIsNearPolyline(position, points, lineWidth)
		}
	},

	setGraphCenter(e, {
		shape,
		style
	}) {
		const {
			points
		} = shape

		style.graphCenter = points[0]
	},

	move({
		movementX,
		movementY
	}, {
		shape
	}) {
		const {
			points
		} = shape

		const moveAfterPoints = points.map(([x, y]) => [x + movementX, y + movementY])

		this.attr('shape', {
			points: moveAfterPoints
		})
	}
}

export const arrow = {
	shape: {
		points: [],
		close: true,
		x: 0,
		y: 0,
		tension: 0, //弯曲程度。
		pointerLength: 0, //箭头指针长度。
		pointerWidth: 0, //箭头指针宽度。
		pointerAtBeginning: false, //我们需要在两边画指针吗？默认值为 false。
		pointerAtEnding: true, //结束端显示箭头。
		hitPoints: [], //检测命中点。
	},

	validator({
		shape
	}) {
		const {
			points,
			x,
			y,
			close,
			tension,
			pointerLength,
			pointerWidth,
			pointerAtBeginning,
			pointerAtEnding
		} = shape

		if (typeof x !== 'number' || typeof y !== 'number') {
			console.error('Polyline points should be an array!')

			return false
		}

		return true
	},

	draw({
		ctx
	}, {
		shape,
		style: {
			lineWidth
		}
	}) {
		let context = ctx;

		let {
			points,
			x,
			y,
			close,
			tension,
			pointerLength,
			pointerWidth,
			pointerAtBeginning,
			pointerAtEnding
		} = shape
		let old_x = points[2] - points[0]
		let old_y = points[3] - points[1]
		points[0] = this.shape.x
		points[1] = this.shape.y
		points[2] = this.shape.x + old_x
		points[3] = this.shape.y + old_y
		var PI2 = Math.PI * 2;

		var tp = points;
		var fromTension = tension !== 0 && points.length > 4;
		if (fromTension) {

			if (close) {
				tp = getTensionPointsClosed(points, tension);
			} else {
				tp = expandPoints(points, tension);
			}
			console.log(tp);
		}
		var length = pointerLength;
		var n = points.length;
		var dx, dy;
		if (fromTension) {
			const lp = [
				tp[tp.length - 4],
				tp[tp.length - 3],
				tp[tp.length - 2],
				tp[tp.length - 1],
				points[n - 2],
				points[n - 1],
			];
			const lastLength = calcLength(tp[tp.length - 4], tp[tp.length - 3], 'C', lp);
			const previous = getPointOnQuadraticBezier(Math.min(1, 1 - length / lastLength), lp[0], lp[1], lp[2],
				lp[3], lp[4], lp[5]);
			dx = points[n - 2] - previous.x;
			dy = points[n - 1] - previous.y;
		} else {
			dx = points[n - 2] - points[n - 4];
			dy = points[n - 1] - points[n - 3];
		}
		var radians = (Math.atan2(dy, dx) + PI2) % PI2;
		var width = pointerWidth;
		this.shape.hitPoints = []
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(points[0], points[1]);
		// #ifdef H5 || APP-VUE
		ctx.lineTo(points[2], points[3]);
		// #endif
		// #ifdef MP
		ctx.lineTo(points[2], points[3]);
		// #endif
		ctx.closePath();
		if (pointerAtEnding) {
			ctx.translate(points[n - 2], points[n - 1]);
			ctx.rotate(radians);
			// #ifdef H5 || APP-VUE

			ctx.moveTo(points[2], points[3]);
			ctx.lineTo(points[2], points[3] - width / 2);
			ctx.lineTo(length + points[2], points[3]);
			ctx.lineTo(points[2], width / 2 + points[3]);

			// #endif
			// #ifdef MP
			ctx.moveTo(0, 0);
			ctx.lineTo(-length, width / 2);
			ctx.lineTo(-length, -width / 2);
			// #endif
			ctx.closePath();
			ctx.restore();
			this.shape.hitPoints.push([points[2], points[3] - width / 2]);
			this.shape.hitPoints.push([length + points[2], points[3]]);
			this.shape.hitPoints.push([points[2], width / 2 + points[3]]);

		}
		if (pointerAtBeginning) {
			if (pointerAtBeginning) {
				ctx.save();
			}

			ctx.translate(x, y);
			if (fromTension) {
				dx = (tp[0] + tp[2]) / 2 - points[0];
				dy = (tp[1] + tp[3]) / 2 - points[1];
			} else {
				dx = points[2] - points[0];
				dy = points[3] - points[1];
			}
			ctx.rotate((Math.atan2(-dy, -dx) + PI2) % PI2);
			// #ifdef H5 || APP-VUE
			ctx.moveTo(points[0], points[1]);
			ctx.lineTo(points[0], points[1] - width / 2);
			ctx.lineTo(-length + points[0], points[1]);
			ctx.lineTo(points[0], width / 2 + points[1]);
			// #endif

			// #ifdef MP
			ctx.moveTo(0, 0);
			ctx.lineTo(-length, width / 2);
			ctx.lineTo(-length, -width / 2);
			// #endif

			ctx.closePath();
			ctx.restore();

		}

		if (close) {

			ctx.fill()
			ctx.stroke()
		} else {
			ctx.stroke()

		}

	},

	hoverCheck(position, {
		shape,
		style
	}) {
		const {
			points,
			hitPoints,
			close,
			pointerLength,
			pointerWidth
		} = shape

		const {
			lineWidth
		} = style

		//   if (close) {
		// console.log( checkPointIsInPolygon(position, hitPoints));
		//     return checkPointIsInPolygon(position, hitPoints)
		//   } else {
		//     return checkPointIsNearPolyline(position, hitPoints, lineWidth)
		//   }
		// #ifdef H5 || APP-VUE
		return checkPointIsInRect(position, points[2], points[3] - pointerWidth / 2, pointerLength, pointerWidth)
		// #endif
		// #ifdef MP
		return checkPointIsInRect(position, points[2] - pointerLength, points[3] - pointerWidth / 2, pointerLength,
			pointerWidth)
		// #endif
	},

	setGraphCenter(e, {
		shape,
		style
	}) {
		const {
			points
		} = shape

		style.graphCenter = points[0]
	},

	move({
		movementX,
		movementY
	}, {
		shape
	}) {
		const {
			points
		} = shape

		const moveAfterPoints = points.map(([x, y]) => [x + movementX, y + movementY])

		this.attr('shape', {
			points: moveAfterPoints
		})
	}
}


const graphs = new Map([

	['rectRound', rectRound],
	['arrow', arrow],
	['star', star],
	['image', image],
	['path', path],
	['circle', circle],
	['ellipse', ellipse],
	['rect', rect],
	['ring', ring],
	['arc', arc],
	['sector', sector],
	['regPolygon', regPolygon],
	['polyline', polyline],
	['smoothline', smoothline],
	['bezierCurve', bezierCurve],
	['text', text]
])

export default graphs

/**
 * @description Extend new graph
 * @param {String} name   Name of Graph
 * @param {Object} config Configuration of Graph
 * @return {Undefined} Void
 */
export function extendNewGraph(name, config) {
	if (!name || !config) {
		console.error('ExtendNewGraph Missing Parameters!')

		return
	}

	if (!config.shape) {
		console.error('Required attribute of shape to extendNewGraph!')

		return
	}

	if (!config.validator) {
		console.error('Required function of validator to extendNewGraph!')

		return
	}

	if (!config.draw) {
		console.error('Required function of draw to extendNewGraph!')

		return
	}

	graphs.set(name, config)
}
