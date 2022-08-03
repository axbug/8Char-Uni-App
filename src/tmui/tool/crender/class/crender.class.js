import color from '../color'
import bezierCurve from '../bezier-curve'

import {
	deepClone
} from '../plugin/util'

import allGraph from '../config/graphs'

import Graph from './graph.class'


/**
 * @description           Class of CRender
 * @param {Object} canvas Canvas DOM
 * @return {CRender}      Instance of CRender
 */
export default class CRender {
	constructor(canvas, t, cav) {
		if (!canvas) {
			console.error('CRender Missing parameters!')

			return
		}
		if (cav) {
			this.cav = cav;
		} else {
			this.cav = null;
		}
		const ctx = canvas;
		this.t = t;
		// const { clientWidth, clientHeight } = canvas

		const area = [ctx.width, ctx.height]

		// canvas.setAttribute('width', clientWidth)
		// canvas.setAttribute('height', clientHeight)

		/**
		 * @description Context of the canvas
		 * @type {Object}
		 * @example ctx = canvas.getContext('2d')
		 */
		this.ctx = ctx
		/**
		 * @description Width and height of the canvas
		 * @type {Array}
		 * @example area = [300，100]
		 */
		this.area = area
		/**
		 * @description Whether render is in animation rendering
		 * @type {Boolean}
		 * @example animationStatus = true|false
		 */
		this.animationStatus = false
		/**
		 * @description Added graph
		 * @type {[Graph]}
		 * @example graphs = [Graph, Graph, ...]
		 */
		this.graphs = []
		/**
		 * @description Color plugin
		 * @type {Object}
		 * @link https://github.com/jiaming743/color
		 */
		this.color = color
		/**
		 * @description Bezier Curve plugin
		 * @type {Object}
		 * @link https://github.com/jiaming743/BezierCurve
		 */
		this.bezierCurve = bezierCurve
		// t.mousedown = mouseDown.bind(this);

		// bind event handler
		// canvas.addEventListener('mousedown', mouseDown.bind(this))
		// canvas.addEventListener('mousemove', mouseMove.bind(this))
		// canvas.addEventListener('mouseup', mouseUp.bind(this))
		// console.log(canvas);
	}
}

/**
 * @description        Clear canvas drawing area
 * @return {Undefined} Void
 */
CRender.prototype.clearArea = function() {
	const {
		area
	} = this

	this.ctx.clearRect(0, 0, ...area)
}

/**
 * @description           Add graph to render
 * @param {Object} config Graph configuration
 * @return {Graph}        Graph instance
 */
CRender.prototype.add = function(config = {}) {
	const {
		name
	} = config

	if (!name) {
		console.error('add Missing parameters!')

		return
	}

	const graphConfig = allGraph.get(name)

	if (!graphConfig) {
		console.warn('No corresponding graph configuration found!')

		return
	}

	const graph = new Graph(graphConfig, config)

	if (!graph.validator(graph, this.ctx)) return

	graph.render = this

	this.graphs.push(graph)

	this.sortGraphsByIndex()

	this.drawAllGraph()

	return graph
}

/**
 * @description Sort the graph by index
 * @return {Undefined} Void
 */
CRender.prototype.sortGraphsByIndex = function() {
	const {
		graphs
	} = this

	graphs.sort((a, b) => {
		if (a.index > b.index) return 1
		if (a.index === b.index) return 0
		if (a.index < b.index) return -1
	})
}

/**
 * @description         Delete graph in render
 * @param {Graph} graph The graph to be deleted
 * @return {Undefined}  Void
 */
CRender.prototype.delGraph = function(graph) {
	if (typeof graph.delProcessor !== 'function') return

	graph.delProcessor(this)

	this.graphs = this.graphs.filter(graph => graph)

	this.drawAllGraph()
}

/**
 * @description        Delete all graph in render
 * @return {Undefined} Void
 */
CRender.prototype.delAllGraph = function() {
	this.graphs.forEach(graph => graph.delProcessor(this))

	this.graphs = this.graphs.filter(graph => graph)

	this.drawAllGraph()
}

/**
 * @description        Draw all the graphs in the render
 * @return {Undefined} Void
 */
CRender.prototype.drawAllGraph = function() {
	this.clearArea()
	this.graphs.filter(graph => graph && graph.visible).forEach(graph => graph.drawProcessor(this, graph))

	if (this.ctx?.draw) {
		this.ctx.draw(true)
	}

}

/**
 * @description      Animate the graph whose animation queue is not empty
 *                   and the animationPause is equal to false
 * @return {Promise} Animation Promise
 */
CRender.prototype.launchAnimation = function() {
	const {
		animationStatus
	} = this

	if (animationStatus) return

	this.animationStatus = true

	return new Promise(resolve => {
		animation.call(this, () => {
			this.animationStatus = false

			resolve()
		}, Date.now())
	})
}

function requestAnimationFrame(callback) {
	// var now = Date.now();
	// var lastTime = 0;
	// var nextTime = Math.max(lastTime + 16, now);
	// // var idd=555
	// // clearTimeout(idd)
	// return new Promise(resolve=>setTimeout(function() { callback(resolve(lastTime = nextTime)); },nextTime - now));
	let lastFrameTime = 0
	var currTime = new Date().getTime();
	var timeToCall = Math.max(0, 16 - (currTime - lastFrameTime));
	var id = setTimeout(function() {
		callback(currTime + timeToCall);
	}, timeToCall);
	lastFrameTime = currTime + timeToCall;
	return id;

};

/**
 * @description Try to animate every graph
 * @param {Function} callback Callback in animation end
 * @param {Number} timeStamp  Time stamp of animation start
 * @return {Undefined} Void
 */
function animation(callback, timeStamp) {
	const {
		graphs
	} = this

	if (!animationAble(graphs)) {
		callback()

		return
	}

	graphs.forEach(graph => graph.turnNextAnimationFrame(timeStamp))

	this.drawAllGraph()

	// #ifdef H5
	window.requestAnimationFrame(animation.bind(this, callback, timeStamp));
	// #endif
	// #ifndef H5
	if (this.cav) {
		this.cav.requestAnimationFrame(animation.bind(this, callback, timeStamp));

	} else {
		requestAnimationFrame(animation.bind(this, callback, timeStamp))
	}

	// #endif

}


/**
 * @description Find if there are graph that can be animated
 * @param {[Graph]} graphs
 * @return {Boolean}
 */
function animationAble(graphs) {
	return graphs.find(graph => !graph.animationPause && graph.animationFrameState.length)
}
CRender.prototype.animateAble = function(graphs) {

	return this.graphs.find(graph => !graph.animationPause && graph.animationFrameState.length)
}
/**
 * @description Handler of CRender mousedown event
 * @return {Undefined} Void
 */
function mouseDown(e) {
	const {
		graphs
	} = this
	const hoverGraph = graphs.find(graph => graph.status === 'hover')

	if (!hoverGraph) return

	hoverGraph.status = 'active'
}

/**
 * @description Handler of CRender mousemove event
 * @return {Undefined} Void
 */
function mouseMove(e) {
	const {
		offsetX,
		offsetY
	} = e
	const position = [offsetX, offsetY]

	const {
		graphs
	} = this

	const activeGraph = graphs.find(graph => (graph.status === 'active' || graph.status === 'drag'))

	if (activeGraph) {
		if (!activeGraph.drag) return

		if (typeof activeGraph.move !== 'function') {
			console.error('No move method is provided, cannot be dragged!')

			return
		}

		activeGraph.moveProcessor(e)

		activeGraph.status = 'drag'

		return
	}

	const hoverGraph = graphs.find(graph => graph.status === 'hover')

	const hoverAbleGraphs = graphs.filter(graph =>
		(graph.hover && (typeof graph.hoverCheck === 'function' || graph.hoverRect)))

	const hoveredGraph = hoverAbleGraphs.find(graph => graph.hoverCheckProcessor(position, graph))

	if (hoveredGraph) {
		document.body.style.cursor = hoveredGraph.style.hoverCursor
	} else {
		document.body.style.cursor = 'default'
	}

	let [hoverGraphMouseOuterIsFun, hoveredGraphMouseEnterIsFun] = [false, false]

	if (hoverGraph) hoverGraphMouseOuterIsFun = typeof hoverGraph.mouseOuter === 'function'
	if (hoveredGraph) hoveredGraphMouseEnterIsFun = typeof hoveredGraph.mouseEnter === 'function'

	if (!hoveredGraph && !hoverGraph) return

	if (!hoveredGraph && hoverGraph) {
		if (hoverGraphMouseOuterIsFun) hoverGraph.mouseOuter(e, hoverGraph)

		hoverGraph.status = 'static'

		return
	}

	if (hoveredGraph && hoveredGraph === hoverGraph) return

	if (hoveredGraph && !hoverGraph) {
		if (hoveredGraphMouseEnterIsFun) hoveredGraph.mouseEnter(e, hoveredGraph)

		hoveredGraph.status = 'hover'

		return
	}

	if (hoveredGraph && hoverGraph && hoveredGraph !== hoverGraph) {
		if (hoverGraphMouseOuterIsFun) hoverGraph.mouseOuter(e, hoverGraph)

		hoverGraph.status = 'static'

		if (hoveredGraphMouseEnterIsFun) hoveredGraph.mouseEnter(e, hoveredGraph)

		hoveredGraph.status = 'hover'
	}
}

/**
 * @description Handler of CRender mouseup event
 * @return {Undefined} Void
 */
function mouseUp(e) {
	const {
		graphs
	} = this

	const activeGraph = graphs.find(graph => graph.status === 'active')
	const dragGraph = graphs.find(graph => graph.status === 'drag')

	if (activeGraph && typeof activeGraph.click === 'function') activeGraph.click(e, activeGraph)

	graphs.forEach(graph => graph && (graph.status = 'static'))

	if (activeGraph) activeGraph.status = 'hover'
	if (dragGraph) dragGraph.status = 'hover'
}

/**
 * @description         Clone Graph
 * @param {Graph} graph The target to be cloned
 * @return {Graph}      Cloned graph
 */
CRender.prototype.clone = function(graph) {
	const style = graph.style.getStyle()

	let clonedGraph = {
		...graph,
		style
	}

	delete clonedGraph.render

	clonedGraph = deepClone(clonedGraph, true)

	return this.add(clonedGraph)
}

function putImageData(ctx, imageData, dx, dy,
	dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
	var data = imageData.data;
	var height = imageData.height;
	var width = imageData.width;

	dirtyX = dirtyX || 0;
	dirtyY = dirtyY || 0;
	dirtyWidth = dirtyWidth !== undefined ? dirtyWidth : width;
	dirtyHeight = dirtyHeight !== undefined ? dirtyHeight : height;
	var limitBottom = dirtyY + dirtyHeight;
	var limitRight = dirtyX + dirtyWidth;
	ctx.save()
	ctx.scale(ctx.scaledpr, ctx.scaledpr)
	for (var y = dirtyY; y < limitBottom; y++) {
		for (var x = dirtyX; x < limitRight; x++) {
			var pos = y * width + x;
			ctx.fillStyle = 'rgba(' + data[pos * 4 + 0] +
				',' + data[pos * 4 + 1] +
				',' + data[pos * 4 + 2] +
				',' + (data[pos * 4 + 3] / 255) + ')';
			ctx.fillRect(x + dx, y + dy, 1, 1);
		}
	}
	ctx.restore()
}




CRender.prototype.getImageData = function(x, y, w, h) {
	let t = this;
	let dpr = 1;
	// #ifndef H5
	dpr = t.ctx.dpr;
	console.log(dpr);
	// #endif
	return new Promise((rs, rj) => {
		if (t.ctx.getImageData) {
			var data = t.ctx.getImageData(x, y, w * dpr, h * dpr)
			rs(data);

		} else {
			// #ifdef APP-VUE || APP-PLUS
			uni.canvasGetImageData({
				canvasId: t.ctx.id,
				x: x,
				y: y,
				width: w,
				height: h,
				success: (res) => rs(res),
				fail: (e) => rj(e)
			}, t.t)
			// #endif
			// #ifndef APP-VUE || APP-PLUS
			uni.canvasGetImageData({
				canvasId: t.ctx.id,
				x: x,
				y: y,
				width: w,
				height: h,
				success: (res) => rs(res),
				fail: (e) => rj(e)
			}, t.t)
			// #endif
		}
	})
}
CRender.prototype.putImageData = function(x, y, w, h, data) {
	let t = this;
	let dpr = 1;
	// #ifndef H5
	dpr = t.ctx.dpr;
	// #endif
	t.ctx.clearRect(0, 0, w, h);
	uni.showLoading({
		title: '...',
		mask: true
	})

	return new Promise((rs, rj) => {

		if (t.ctx.putImageData) {
			setTimeout(function() {
				putImageData(t.ctx, data, x, y, 0, 0, w * dpr, h * dpr);
				rs();
				uni.hideLoading()
			}, 50);
		} else {

			uni.canvasPutImageData({
				canvasId: t.ctx.id,
				x: x,
				y: y,
				width: w,
				height: h,
				data: data.data,
				success: (res) => rs(),
				fail: (e) => rj(e),
				complete: () => uni.hideLoading()
			}, t.t)
		}
	})
}
// Filters图像效果控制。
/**
 * 移植自https://konvajs.org/
 * 移植作者：https://jx2d.cn
 */

/**
 * 模糊图片
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 * @param {Object} blurRadius
 * @param {Object} type = rgba|rgb
 */
CRender.prototype.Blur = function(x, y, w, h, blurRadius, type = 'rgba') {
	var t = this;

	/*
	StackBlur - a fast almost Gaussian Blur For Canvas
	Version: 	0.5
	Author:		Mario Klingemann
	Contact: 	mario@quasimondo.com
	Website:	http://www.quasimondo.com/StackBlurForCanvas
	Twitter:	@quasimondo
	In case you find this class useful - especially in commercial projects -
	I am not totally unhappy for a small donation to my PayPal account
	mario@quasimondo.de
	Or support me on flattr: 
	https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript
	Copyright (c) 2010 Mario Klingemann
	Permission is hereby granted, free of charge, to any person
	obtaining a copy of this software and associated documentation
	files (the "Software"), to deal in the Software without
	restriction, including without limitation the rights to use,
	copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the
	Software is furnished to do so, subject to the following
	conditions:
	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	OTHER DEALINGS IN THE SOFTWARE.
	*/
	let dpr = 1;
	// #ifndef H5
	dpr = t.ctx.dpr;
	// #endif
	var mul_table = [
		512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512,
		454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512,
		482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456,
		437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512,
		497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328,
		320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456,
		446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335,
		329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512,
		505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405,
		399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328,
		324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271,
		268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456,
		451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388,
		385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335,
		332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292,
		289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259
	];


	var shg_table = [
		9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
		17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
		19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
		20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24
	];



	function stackBlurCanvasRGBA(imageData, top_x, top_y, width, height, radius) {


		var pixels = imageData.data;

		var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum,
			r_out_sum, g_out_sum, b_out_sum, a_out_sum,
			r_in_sum, g_in_sum, b_in_sum, a_in_sum,
			pr, pg, pb, pa, rbs;

		var div = radius + radius + 1;
		var w4 = width << 2;
		var widthMinus1 = width - 1;
		var heightMinus1 = height - 1;
		var radiusPlus1 = radius + 1;
		var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

		var stackStart = new BlurStack();
		var stack = stackStart;
		for (i = 1; i < div; i++) {
			stack = stack.next = new BlurStack();
			if (i == radiusPlus1) var stackEnd = stack;
		}
		stack.next = stackStart;
		var stackIn = null;
		var stackOut = null;

		yw = yi = 0;

		var mul_sum = mul_table[radius];
		var shg_sum = shg_table[radius];

		for (y = 0; y < height; y++) {
			r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;

			r_out_sum = radiusPlus1 * (pr = pixels[yi]);
			g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
			b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
			a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);

			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			a_sum += sumFactor * pa;

			stack = stackStart;

			for (i = 0; i < radiusPlus1; i++) {
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack.a = pa;
				stack = stack.next;
			}

			for (i = 1; i < radiusPlus1; i++) {
				p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
				r_sum += (stack.r = (pr = pixels[p])) * (rbs = radiusPlus1 - i);
				g_sum += (stack.g = (pg = pixels[p + 1])) * rbs;
				b_sum += (stack.b = (pb = pixels[p + 2])) * rbs;
				a_sum += (stack.a = (pa = pixels[p + 3])) * rbs;

				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				a_in_sum += pa;

				stack = stack.next;
			}


			stackIn = stackStart;
			stackOut = stackEnd;
			for (x = 0; x < width; x++) {
				pixels[yi + 3] = pa = (a_sum * mul_sum) >> shg_sum;
				if (pa != 0) {
					pa = 255 / pa;
					pixels[yi] = ((r_sum * mul_sum) >> shg_sum) * pa;
					pixels[yi + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
					pixels[yi + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
				} else {
					pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
				}

				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				a_sum -= a_out_sum;

				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				a_out_sum -= stackIn.a;

				p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;

				r_in_sum += (stackIn.r = pixels[p]);
				g_in_sum += (stackIn.g = pixels[p + 1]);
				b_in_sum += (stackIn.b = pixels[p + 2]);
				a_in_sum += (stackIn.a = pixels[p + 3]);

				r_sum += r_in_sum;
				g_sum += g_in_sum;
				b_sum += b_in_sum;
				a_sum += a_in_sum;

				stackIn = stackIn.next;

				r_out_sum += (pr = stackOut.r);
				g_out_sum += (pg = stackOut.g);
				b_out_sum += (pb = stackOut.b);
				a_out_sum += (pa = stackOut.a);

				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				a_in_sum -= pa;

				stackOut = stackOut.next;

				yi += 4;
			}
			yw += width;
		}


		for (x = 0; x < width; x++) {
			g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;

			yi = x << 2;
			r_out_sum = radiusPlus1 * (pr = pixels[yi]);
			g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
			b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
			a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);

			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			a_sum += sumFactor * pa;

			stack = stackStart;

			for (i = 0; i < radiusPlus1; i++) {
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack.a = pa;
				stack = stack.next;
			}

			yp = width;

			for (i = 1; i <= radius; i++) {
				yi = (yp + x) << 2;

				r_sum += (stack.r = (pr = pixels[yi])) * (rbs = radiusPlus1 - i);
				g_sum += (stack.g = (pg = pixels[yi + 1])) * rbs;
				b_sum += (stack.b = (pb = pixels[yi + 2])) * rbs;
				a_sum += (stack.a = (pa = pixels[yi + 3])) * rbs;

				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				a_in_sum += pa;

				stack = stack.next;

				if (i < heightMinus1) {
					yp += width;
				}
			}

			yi = x;
			stackIn = stackStart;
			stackOut = stackEnd;
			for (y = 0; y < height; y++) {
				p = yi << 2;
				pixels[p + 3] = pa = (a_sum * mul_sum) >> shg_sum;
				if (pa > 0) {
					pa = 255 / pa;
					pixels[p] = ((r_sum * mul_sum) >> shg_sum) * pa;
					pixels[p + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
					pixels[p + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
				} else {
					pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
				}

				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				a_sum -= a_out_sum;

				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				a_out_sum -= stackIn.a;

				p = (x + (((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width)) << 2;

				r_sum += (r_in_sum += (stackIn.r = pixels[p]));
				g_sum += (g_in_sum += (stackIn.g = pixels[p + 1]));
				b_sum += (b_in_sum += (stackIn.b = pixels[p + 2]));
				a_sum += (a_in_sum += (stackIn.a = pixels[p + 3]));

				stackIn = stackIn.next;

				r_out_sum += (pr = stackOut.r);
				g_out_sum += (pg = stackOut.g);
				b_out_sum += (pb = stackOut.b);
				a_out_sum += (pa = stackOut.a);

				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				a_in_sum -= pa;

				stackOut = stackOut.next;

				yi += width;
			}
		}

		return pixels;

	}


	function stackBlurCanvasRGB(imageData, top_x, top_y, width, height, radius) {


		var pixels = imageData.data;

		var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
			r_out_sum, g_out_sum, b_out_sum,
			r_in_sum, g_in_sum, b_in_sum,
			pr, pg, pb, rbs;

		var div = radius + radius + 1;
		var w4 = width << 2;
		var widthMinus1 = width - 1;
		var heightMinus1 = height - 1;
		var radiusPlus1 = radius + 1;
		var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

		var stackStart = new BlurStack();
		var stack = stackStart;
		for (i = 1; i < div; i++) {
			stack = stack.next = new BlurStack();
			if (i == radiusPlus1) var stackEnd = stack;
		}
		stack.next = stackStart;
		var stackIn = null;
		var stackOut = null;

		yw = yi = 0;

		var mul_sum = mul_table[radius];
		var shg_sum = shg_table[radius];

		for (y = 0; y < height; y++) {
			r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;

			r_out_sum = radiusPlus1 * (pr = pixels[yi]);
			g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
			b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);

			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;

			stack = stackStart;

			for (i = 0; i < radiusPlus1; i++) {
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack = stack.next;
			}

			for (i = 1; i < radiusPlus1; i++) {
				p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
				r_sum += (stack.r = (pr = pixels[p])) * (rbs = radiusPlus1 - i);
				g_sum += (stack.g = (pg = pixels[p + 1])) * rbs;
				b_sum += (stack.b = (pb = pixels[p + 2])) * rbs;

				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;

				stack = stack.next;
			}


			stackIn = stackStart;
			stackOut = stackEnd;
			for (x = 0; x < width; x++) {
				pixels[yi] = (r_sum * mul_sum) >> shg_sum;
				pixels[yi + 1] = (g_sum * mul_sum) >> shg_sum;
				pixels[yi + 2] = (b_sum * mul_sum) >> shg_sum;

				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;

				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;

				p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;

				r_in_sum += (stackIn.r = pixels[p]);
				g_in_sum += (stackIn.g = pixels[p + 1]);
				b_in_sum += (stackIn.b = pixels[p + 2]);

				r_sum += r_in_sum;
				g_sum += g_in_sum;
				b_sum += b_in_sum;

				stackIn = stackIn.next;

				r_out_sum += (pr = stackOut.r);
				g_out_sum += (pg = stackOut.g);
				b_out_sum += (pb = stackOut.b);

				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;

				stackOut = stackOut.next;

				yi += 4;
			}
			yw += width;
		}


		for (x = 0; x < width; x++) {
			g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;

			yi = x << 2;
			r_out_sum = radiusPlus1 * (pr = pixels[yi]);
			g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
			b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);

			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;

			stack = stackStart;

			for (i = 0; i < radiusPlus1; i++) {
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack = stack.next;
			}

			yp = width;

			for (i = 1; i <= radius; i++) {
				yi = (yp + x) << 2;

				r_sum += (stack.r = (pr = pixels[yi])) * (rbs = radiusPlus1 - i);
				g_sum += (stack.g = (pg = pixels[yi + 1])) * rbs;
				b_sum += (stack.b = (pb = pixels[yi + 2])) * rbs;

				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;

				stack = stack.next;

				if (i < heightMinus1) {
					yp += width;
				}
			}

			yi = x;
			stackIn = stackStart;
			stackOut = stackEnd;
			for (y = 0; y < height; y++) {
				p = yi << 2;
				pixels[p] = (r_sum * mul_sum) >> shg_sum;
				pixels[p + 1] = (g_sum * mul_sum) >> shg_sum;
				pixels[p + 2] = (b_sum * mul_sum) >> shg_sum;

				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;

				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;

				p = (x + (((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width)) << 2;

				r_sum += (r_in_sum += (stackIn.r = pixels[p]));
				g_sum += (g_in_sum += (stackIn.g = pixels[p + 1]));
				b_sum += (b_in_sum += (stackIn.b = pixels[p + 2]));

				stackIn = stackIn.next;

				r_out_sum += (pr = stackOut.r);
				g_out_sum += (pg = stackOut.g);
				b_out_sum += (pb = stackOut.b);

				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;

				stackOut = stackOut.next;

				yi += width;
			}
		}

		return pixels;

	}

	function BlurStack() {
		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.a = 0;
		this.next = null;
	}


	var b = Math.round(blurRadius);


	return this.getImageData(x, y, w, h).then((res) => {
		var data;
		if (type == 'rgb') {
			data = stackBlurCanvasRGB(res, x, y, w * dpr, h * dpr, b);
		} else {
			data = stackBlurCanvasRGBA(res, x, y, w * dpr, h * dpr, b);
		}
		console.log(res.height);
		return {
			width: res.width,
			height: res.height,
			data: data
		};
	}).then(res => {
		return this.putImageData(x, y, w, h, res);
	}).catch(e => console.error(e))

}


/**
 * 使图像反色,类似底片
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
CRender.prototype.ColorInvert = function(x, y, w, h) {
	let t = this;
	return this.getImageData(x, y, w, h).then((res) => {
		var data = res.data;
		for (var i = 0; i < res.data.length; i += 4) {
			var r = data[i];
			var g = data[i + 1];
			var b = data[i + 2];

			data[i] = 255 - r;
			data[i + 1] = 255 - g;
			data[i + 2] = 255 - b;
		}
		return {
			width: res.width,
			height: res.height,
			data: data
		};
	}).then(res => {
		return this.putImageData(x, y, w, h, res);
	}).catch(e => console.error(e))

}


/**
 * 灰度图片。
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
CRender.prototype.Grayscale = function(x, y, w, h) {
	let t = this;

	return this.getImageData(x, y, w, h).then((res) => {
		// 0.34，0.5，0.16为加权的权重。可适当调整。
		var data = res.data,
			len = data.length,
			i, brightness;
		for (i = 0; i < len; i += 4) {
			brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
			data[i] = brightness;
			data[i + 1] = brightness;
			data[i + 2] = brightness;
		}

		return {
			width: res.width,
			height: res.height,
			data: data
		};
	}).then(res => {
		return this.putImageData(x, y, w, h, res);
	}).catch(e => console.error(e))


}


/**
 * 调整图片的明暗度。
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 * @param {Object} brightness -1~1,小于0为暗，大于1为亮。0为正常。
 */
CRender.prototype.Brighten = function(x, y, w, h, brightness) {
	let t = this;

	return this.getImageData(x, y, w, h).then((res) => {
		// 0.34，0.5，0.16为加权的权重。可适当调整。
		brightness = brightness * 255
		var data = res.data,
			len = data.length,
			i;
		for (i = 0; i < len; i += 4) {
			data[i] += brightness;
			data[i + 1] += brightness;
			data[i + 2] += brightness;
		}
		return {
			width: res.width,
			height: res.height,
			data: data
		};
	}).then(res => {
		return this.putImageData(x, y, w, h, res);
	}).catch(e => console.error(e))


}


/**
 * 调整图片对比度。
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 * @param {Object} brightness -100~100
 */
CRender.prototype.Contrast = function(x, y, w, h, brightness) {
	let t = this;
	return this.getImageData(x, y, w, h).then((res) => {
		var adjust = Math.pow((brightness + 100) / 100, 2);
		var data = res.data,
			nPixels = data.length,
			red = 150,
			green = 150,
			blue = 150,
			i;
		for (i = 0; i < nPixels; i += 4) {
			red = data[i];
			green = data[i + 1];
			blue = data[i + 2];
			red /= 255;
			red -= 0.5;
			red *= adjust;
			red += 0.5;
			red *= 255;
			green /= 255;
			green -= 0.5;
			green *= adjust;
			green += 0.5;
			green *= 255;
			blue /= 255;
			blue -= 0.5;
			blue *= adjust;
			blue += 0.5;
			blue *= 255;
			red = red < 0 ? 0 : red > 255 ? 255 : red;
			green = green < 0 ? 0 : green > 255 ? 255 : green;
			blue = blue < 0 ? 0 : blue > 255 ? 255 : blue;
			data[i] = red;
			data[i + 1] = green;
			data[i + 2] = blue;
		}
		return {
			width: res.width,
			height: res.height,
			data: data
		};
	}).then(res => {
		return this.putImageData(x, y, w, h, res);
	}).catch(e => console.error(e))


}

/**
 * 浮雕
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 * @param {Object} embossStrength 浮雕强度 0~1,0为正常。
 * @param {Object} embossWhiteLevel 黑白对比强度0~1
 * @param {Object} embossDirection 浮雕的方向。top,top-left,top-right,left,right,bottom,bottom-left,bottom-right
 * @param {Object} embossBlend 是否显示黑白浮雕
 */
CRender.prototype.Emboss = function(x, y, w, h, embossStrength = 0.5, embossWhiteLevel = 0.5, embossDirection =
	"top-right", embossBlend = false) {
	let t = this;
	return this.getImageData(x, y, w, h).then((res) => {
		var strength = embossStrength * 10,
			greyLevel = embossWhiteLevel * 255,
			direction = embossDirection,
			blend = !embossBlend,
			dirY = 0,
			dirX = 0,
			data = res.data,
			w = res.width,
			h = res.height,
			w4 = w * 4,
			y = h;
		switch (direction) {
			case 'top-left':
				dirY = -1;
				dirX = -1;
				break;
			case 'top':
				dirY = -1;
				dirX = 0;
				break;
			case 'top-right':
				dirY = -1;
				dirX = 1;
				break;
			case 'right':
				dirY = 0;
				dirX = 1;
				break;
			case 'bottom-right':
				dirY = 1;
				dirX = 1;
				break;
			case 'bottom':
				dirY = 1;
				dirX = 0;
				break;
			case 'bottom-left':
				dirY = 1;
				dirX = -1;
				break;
			case 'left':
				dirY = 0;
				dirX = -1;
				break;
			default:
				Util_1.Util.error('Unknown emboss direction: ' + direction);
		}
		do {
			var offsetY = (y - 1) * w4;
			var otherY = dirY;
			if (y + otherY < 1) {
				otherY = 0;
			}
			if (y + otherY > h) {
				otherY = 0;
			}
			var offsetYOther = (y - 1 + otherY) * w * 4;
			var x = w;
			do {
				var offset = offsetY + (x - 1) * 4;
				var otherX = dirX;
				if (x + otherX < 1) {
					otherX = 0;
				}
				if (x + otherX > w) {
					otherX = 0;
				}
				var offsetOther = offsetYOther + (x - 1 + otherX) * 4;
				var dR = data[offset] - data[offsetOther];
				var dG = data[offset + 1] - data[offsetOther + 1];
				var dB = data[offset + 2] - data[offsetOther + 2];
				var dif = dR;
				var absDif = dif > 0 ? dif : -dif;
				var absG = dG > 0 ? dG : -dG;
				var absB = dB > 0 ? dB : -dB;
				if (absG > absDif) {
					dif = dG;
				}
				if (absB > absDif) {
					dif = dB;
				}
				dif *= strength;
				if (blend) {
					var r = data[offset] + dif;
					var g = data[offset + 1] + dif;
					var b = data[offset + 2] + dif;
					data[offset] = r > 255 ? 255 : r < 0 ? 0 : r;
					data[offset + 1] = g > 255 ? 255 : g < 0 ? 0 : g;
					data[offset + 2] = b > 255 ? 255 : b < 0 ? 0 : b;
				} else {
					var grey = greyLevel - dif;
					if (grey < 0) {
						grey = 0;
					} else if (grey > 255) {
						grey = 255;
					}
					data[offset] = data[offset + 1] = data[offset + 2] = grey;
				}
			} while (--x);
		} while (--y);
		return {
			width: res.width,
			height: res.height,
			data: data
		};
	}).then(res => {
		return this.putImageData(x, y, w, h, res);
	}).catch(e => console.error(e))


}

/**
 * 提高饱和度
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 * @param {Object} enhance -1~1
 */
CRender.prototype.Enhance = function(x, y, w, h, enhance) {
	let t = this;

	return this.getImageData(x, y, w, h).then((res) => {
		function remap(fromValue, fromMin, fromMax, toMin, toMax) {
			var fromRange = fromMax - fromMin,
				toRange = toMax - toMin,
				toValue;
			if (fromRange === 0) {
				return toMin + toRange / 2;
			}
			if (toRange === 0) {
				return toMin;
			}
			toValue = (fromValue - fromMin) / fromRange;
			toValue = toRange * toValue + toMin;
			return toValue;
		}
		var data = res.data,
			nSubPixels = data.length,
			rMin = data[0],
			rMax = rMin,
			r, gMin = data[1],
			gMax = gMin,
			g, bMin = data[2],
			bMax = bMin,
			b, i;
		var enhanceAmount = enhance;
		if (enhanceAmount === 0) {
			return;
		}
		for (i = 0; i < nSubPixels; i += 4) {
			r = data[i + 0];
			if (r < rMin) {
				rMin = r;
			} else if (r > rMax) {
				rMax = r;
			}
			g = data[i + 1];
			if (g < gMin) {
				gMin = g;
			} else if (g > gMax) {
				gMax = g;
			}
			b = data[i + 2];
			if (b < bMin) {
				bMin = b;
			} else if (b > bMax) {
				bMax = b;
			}
		}
		if (rMax === rMin) {
			rMax = 255;
			rMin = 0;
		}
		if (gMax === gMin) {
			gMax = 255;
			gMin = 0;
		}
		if (bMax === bMin) {
			bMax = 255;
			bMin = 0;
		}
		var rMid, rGoalMax, rGoalMin, gMid, gGoalMax, gGoalMin, bMid, bGoalMax, bGoalMin;
		if (enhanceAmount > 0) {
			rGoalMax = rMax + enhanceAmount * (255 - rMax);
			rGoalMin = rMin - enhanceAmount * (rMin - 0);
			gGoalMax = gMax + enhanceAmount * (255 - gMax);
			gGoalMin = gMin - enhanceAmount * (gMin - 0);
			bGoalMax = bMax + enhanceAmount * (255 - bMax);
			bGoalMin = bMin - enhanceAmount * (bMin - 0);
		} else {
			rMid = (rMax + rMin) * 0.5;
			rGoalMax = rMax + enhanceAmount * (rMax - rMid);
			rGoalMin = rMin + enhanceAmount * (rMin - rMid);
			gMid = (gMax + gMin) * 0.5;
			gGoalMax = gMax + enhanceAmount * (gMax - gMid);
			gGoalMin = gMin + enhanceAmount * (gMin - gMid);
			bMid = (bMax + bMin) * 0.5;
			bGoalMax = bMax + enhanceAmount * (bMax - bMid);
			bGoalMin = bMin + enhanceAmount * (bMin - bMid);
		}
		for (i = 0; i < nSubPixels; i += 4) {
			data[i + 0] = remap(data[i + 0], rMin, rMax, rGoalMin, rGoalMax);
			data[i + 1] = remap(data[i + 1], gMin, gMax, gGoalMin, gGoalMax);
			data[i + 2] = remap(data[i + 2], bMin, bMax, bGoalMin, bGoalMax);
		}
		return {
			width: res.width,
			height: res.height,
			data: data
		};
	}).then(res => {
		return this.putImageData(x, y, w, h, res);
	}).catch(e => console.error(e))




}


/**
 * 通过HSL调整图像
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 * @param {Object} hue 色相 0~259
 * @param {Object} saturation 饱和度 -2~10
 * @param {Object} luminance 明暗 -2~2
 */
CRender.prototype.HSL = function(x, y, w, h, hue = 100, saturation = 5, luminance = 0) {
	let t = this;
	return this.getImageData(x, y, w, h).then((res) => {
		var data = res.data,
			nPixels = data.length,
			v = 1,
			s = Math.pow(2, saturation),
			h = Math.abs(hue + 360) % 360,
			l = luminance * 127,
			i;
		var vsu = v * s * Math.cos((h * Math.PI) / 180),
			vsw = v * s * Math.sin((h * Math.PI) / 180);
		var rr = 0.299 * v + 0.701 * vsu + 0.167 * vsw,
			rg = 0.587 * v - 0.587 * vsu + 0.33 * vsw,
			rb = 0.114 * v - 0.114 * vsu - 0.497 * vsw;
		var gr = 0.299 * v - 0.299 * vsu - 0.328 * vsw,
			gg = 0.587 * v + 0.413 * vsu + 0.035 * vsw,
			gb = 0.114 * v - 0.114 * vsu + 0.293 * vsw;
		var br = 0.299 * v - 0.3 * vsu + 1.25 * vsw,
			bg = 0.587 * v - 0.586 * vsu - 1.05 * vsw,
			bb = 0.114 * v + 0.886 * vsu - 0.2 * vsw;
		var r, g, b, a;
		for (i = 0; i < nPixels; i += 4) {
			r = data[i + 0];
			g = data[i + 1];
			b = data[i + 2];
			a = data[i + 3];
			data[i + 0] = rr * r + rg * g + rb * b + l;
			data[i + 1] = gr * r + gg * g + gb * b + l;
			data[i + 2] = br * r + bg * g + bb * b + l;
			data[i + 3] = a;
		}
		return {
			width: res.width,
			height: res.height,
			data: data
		};
	}).then(res => {
		return this.putImageData(x, y, w, h, res);
	}).catch(e => console.error(e))

}

/**
 * 调整图像hsv
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 * @param {Object} hue 色相 0~259
 * @param {Object} saturation 饱和度 -2~10
 * @param {Object} value 明暗 -2~2
 */
CRender.prototype.HSV = function(x, y, w, h, hue = 150, saturation = 0, value = 0) {
	let t = this;
	return this.getImageData(x, y, w, h).then((res) => {
		var data = res.data,
			nPixels = data.length,
			v = Math.pow(2, value),
			s = Math.pow(2, saturation),
			h = Math.abs(hue + 360) % 360,
			i;
		var vsu = v * s * Math.cos((h * Math.PI) / 180),
			vsw = v * s * Math.sin((h * Math.PI) / 180);
		var rr = 0.299 * v + 0.701 * vsu + 0.167 * vsw,
			rg = 0.587 * v - 0.587 * vsu + 0.33 * vsw,
			rb = 0.114 * v - 0.114 * vsu - 0.497 * vsw;
		var gr = 0.299 * v - 0.299 * vsu - 0.328 * vsw,
			gg = 0.587 * v + 0.413 * vsu + 0.035 * vsw,
			gb = 0.114 * v - 0.114 * vsu + 0.293 * vsw;
		var br = 0.299 * v - 0.3 * vsu + 1.25 * vsw,
			bg = 0.587 * v - 0.586 * vsu - 1.05 * vsw,
			bb = 0.114 * v + 0.886 * vsu - 0.2 * vsw;
		var r, g, b, a;
		for (i = 0; i < nPixels; i += 4) {
			r = data[i + 0];
			g = data[i + 1];
			b = data[i + 2];
			a = data[i + 3];
			data[i + 0] = rr * r + rg * g + rb * b;
			data[i + 1] = gr * r + gg * g + gb * b;
			data[i + 2] = br * r + bg * g + bb * b;
			data[i + 3] = a;
		}
		return {
			width: res.width,
			height: res.height,
			data: data
		};
	}).then(res => {
		return this.putImageData(x, y, w, h, res);
	}).catch(e => console.error(e))

}

/**
 * 调整图像rgb通道
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 * @param {Object} r
 * @param {Object} g
 * @param {Object} b
 */
CRender.prototype.RGB = function(x, y, w, h, r = 0, g = 100, b = 30) {
	let t = this;
	return this.getImageData(x, y, w, h).then((res) => {
		var data = res.data,
			nPixels = data.length,
			red = r,
			green = g,
			blue = b,
			i, brightness;
		for (i = 0; i < nPixels; i += 4) {
			brightness =
				(0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]) / 255;
			data[i] = brightness * red;
			data[i + 1] = brightness * green;
			data[i + 2] = brightness * blue;
			data[i + 3] = data[i + 3];
		}
		return {
			width: res.width,
			height: res.height,
			data: data
		};
	}).then(res => {
		return this.putImageData(x, y, w, h, res);
	}).catch(e => console.error(e))

}

/**
 * 使图像色彩反相
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
CRender.prototype.Invert = function(x, y, w, h) {
	let t = this;
	return this.getImageData(x, y, w, h).then((res) => {
		var data = res.data,
			len = data.length,
			i;
		for (i = 0; i < len; i += 4) {
			data[i] = 255 - data[i];
			data[i + 1] = 255 - data[i + 1];
			data[i + 2] = 255 - data[i + 2];
		}
		return {
			width: res.width,
			height: res.height,
			data: data
		};
	}).then(res => {
		return this.putImageData(x, y, w, h, res);
	}).catch(e => console.error(e))

}

function pixelAt(idata, x, y) {
	var idx = (y * idata.width + x) * 4;
	var d = [];
	d.push(idata.data[idx++], idata.data[idx++], idata.data[idx++], idata.data[idx++]);
	return d;
}

function rgbDistance(p1, p2) {
	return Math.sqrt(Math.pow(p1[0] - p2[0], 2) +
		Math.pow(p1[1] - p2[1], 2) +
		Math.pow(p1[2] - p2[2], 2));
}

function rgbMean(pTab) {
	var m = [0, 0, 0];
	for (var i = 0; i < pTab.length; i++) {
		m[0] += pTab[i][0];
		m[1] += pTab[i][1];
		m[2] += pTab[i][2];
	}
	m[0] /= pTab.length;
	m[1] /= pTab.length;
	m[2] /= pTab.length;
	return m;
}

function backgroundMask(idata, threshold) {
	var rgbv_no = pixelAt(idata, 0, 0);
	var rgbv_ne = pixelAt(idata, idata.width - 1, 0);
	var rgbv_so = pixelAt(idata, 0, idata.height - 1);
	var rgbv_se = pixelAt(idata, idata.width - 1, idata.height - 1);
	var thres = threshold || 10;
	if (rgbDistance(rgbv_no, rgbv_ne) < thres &&
		rgbDistance(rgbv_ne, rgbv_se) < thres &&
		rgbDistance(rgbv_se, rgbv_so) < thres &&
		rgbDistance(rgbv_so, rgbv_no) < thres) {
		var mean = rgbMean([rgbv_ne, rgbv_no, rgbv_se, rgbv_so]);
		var mask = [];
		for (var i = 0; i < idata.width * idata.height; i++) {
			var d = rgbDistance(mean, [
				idata.data[i * 4],
				idata.data[i * 4 + 1],
				idata.data[i * 4 + 2],
			]);
			mask[i] = d < thres ? 0 : 255;
		}
		return mask;
	}
}

function applyMask(idata, mask) {
	for (var i = 0; i < idata.width * idata.height; i++) {
		idata.data[4 * i + 3] = mask[i];
	}
}

function erodeMask(mask, sw, sh) {
	var weights = [1, 1, 1, 1, 0, 1, 1, 1, 1];
	var side = Math.round(Math.sqrt(weights.length));
	var halfSide = Math.floor(side / 2);
	var maskResult = [];
	for (var y = 0; y < sh; y++) {
		for (var x = 0; x < sw; x++) {
			var so = y * sw + x;
			var a = 0;
			for (var cy = 0; cy < side; cy++) {
				for (var cx = 0; cx < side; cx++) {
					var scy = y + cy - halfSide;
					var scx = x + cx - halfSide;
					if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
						var srcOff = scy * sw + scx;
						var wt = weights[cy * side + cx];
						a += mask[srcOff] * wt;
					}
				}
			}
			maskResult[so] = a === 255 * 8 ? 255 : 0;
		}
	}
	return maskResult;
}

function dilateMask(mask, sw, sh) {
	var weights = [1, 1, 1, 1, 1, 1, 1, 1, 1];
	var side = Math.round(Math.sqrt(weights.length));
	var halfSide = Math.floor(side / 2);
	var maskResult = [];
	for (var y = 0; y < sh; y++) {
		for (var x = 0; x < sw; x++) {
			var so = y * sw + x;
			var a = 0;
			for (var cy = 0; cy < side; cy++) {
				for (var cx = 0; cx < side; cx++) {
					var scy = y + cy - halfSide;
					var scx = x + cx - halfSide;
					if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
						var srcOff = scy * sw + scx;
						var wt = weights[cy * side + cx];
						a += mask[srcOff] * wt;
					}
				}
			}
			maskResult[so] = a >= 255 * 4 ? 255 : 0;
		}
	}
	return maskResult;
}

function smoothEdgeMask(mask, sw, sh) {
	var weights = [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9];
	var side = Math.round(Math.sqrt(weights.length));
	var halfSide = Math.floor(side / 2);
	var maskResult = [];
	for (var y = 0; y < sh; y++) {
		for (var x = 0; x < sw; x++) {
			var so = y * sw + x;
			var a = 0;
			for (var cy = 0; cy < side; cy++) {
				for (var cx = 0; cx < side; cx++) {
					var scy = y + cy - halfSide;
					var scx = x + cx - halfSide;
					if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
						var srcOff = scy * sw + scx;
						var wt = weights[cy * side + cx];
						a += mask[srcOff] * wt;
					}
				}
			}
			maskResult[so] = a;
		}
	}
	return maskResult;
}

/**
 * 遮罩
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 * @param {Object} threshold 0~300遮罩强度
 */
CRender.prototype.Mask = function(x, y, w, h, threshold = 100) {
	let t = this;
	return this.getImageData(x, y, w, h).then((res) => {
		var imageData = {
			...res
		}

		var mask = backgroundMask(imageData, threshold);
		if (mask) {
			mask = erodeMask(mask, imageData.width, imageData.height);
			mask = dilateMask(mask, imageData.width, imageData.height);
			mask = smoothEdgeMask(mask, imageData.width, imageData.height);
			applyMask(imageData, mask);
		}
		return {
			width: res.width,
			height: res.height,
			data: imageData.data
		};
	}).then(res => {
		return this.putImageData(x, y, w, h, res);
	}).catch(e => console.error(e))

}

/**
 * 图像噪点
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 * @param {Object} Noise 0~4
 */
CRender.prototype.Noise = function(x, y, w, h, noise = 0.5) {
	let t = this;
	return this.getImageData(x, y, w, h).then((res) => {
		var amount = noise * 255,
			data = res.data,
			nPixels = data.length,
			half = amount / 2,
			i;
		for (i = 0; i < nPixels; i += 4) {
			data[i + 0] += half - 2 * half * Math.random();
			data[i + 1] += half - 2 * half * Math.random();
			data[i + 2] += half - 2 * half * Math.random();
		}
		return {
			width: res.width,
			height: res.height,
			data: data
		};
	}).then(res => {
		return this.putImageData(x, y, w, h, res);
	}).catch(e => console.error(e))

}

/**
 * 图像像素化
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 * @param {Object} size 0~20
 */
CRender.prototype.Pixelate = function(x, y, w, h, size = 10) {
	let t = this;
	return this.getImageData(x, y, w, h).then((res) => {

		var pixelSize = Math.ceil(size),
			width = res.width,
			height = res.height,
			x, y, i, red, green, blue, alpha, nBinsX = Math.ceil(width / pixelSize),
			nBinsY = Math.ceil(height / pixelSize),
			xBinStart, xBinEnd, yBinStart, yBinEnd, xBin, yBin, pixelsInBin, data = res.data;
		if (pixelSize <= 0) {
			return new Promise.reject("像素点不能小于0");
		}
		for (xBin = 0; xBin < nBinsX; xBin += 1) {
			for (yBin = 0; yBin < nBinsY; yBin += 1) {
				red = 0;
				green = 0;
				blue = 0;
				alpha = 0;
				xBinStart = xBin * pixelSize;
				xBinEnd = xBinStart + pixelSize;
				yBinStart = yBin * pixelSize;
				yBinEnd = yBinStart + pixelSize;
				pixelsInBin = 0;
				for (x = xBinStart; x < xBinEnd; x += 1) {
					if (x >= width) {
						continue;
					}
					for (y = yBinStart; y < yBinEnd; y += 1) {
						if (y >= height) {
							continue;
						}
						i = (width * y + x) * 4;
						red += data[i + 0];
						green += data[i + 1];
						blue += data[i + 2];
						alpha += data[i + 3];
						pixelsInBin += 1;
					}
				}
				red = red / pixelsInBin;
				green = green / pixelsInBin;
				blue = blue / pixelsInBin;
				alpha = alpha / pixelsInBin;
				for (x = xBinStart; x < xBinEnd; x += 1) {
					if (x >= width) {
						continue;
					}
					for (y = yBinStart; y < yBinEnd; y += 1) {
						if (y >= height) {
							continue;
						}
						i = (width * y + x) * 4;
						data[i + 0] = red;
						data[i + 1] = green;
						data[i + 2] = blue;
						data[i + 3] = alpha;
					}
				}
			}
		}
		return {
			width: res.width,
			height: res.height,
			data: data
		};
	}).then(res => {
		return this.putImageData(x, y, w, h, res);
	}).catch(e => console.error(e))

}

/**
 * 褐色风格处理
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
CRender.prototype.Sepia = function(x, y, w, h) {
	let t = this;
	return this.getImageData(x, y, w, h).then((res) => {

		var d = res.data;

		for (var i = 0; i < d.length; i += 4) {
			var red = d[i];
			var green = d[i + 1];
			var blue = d[i + 2];
			var alpha = d[i + 3];

			var outRed = (red * .393) + (green * .769) + (blue *
			.189); // calculate value for red channel in pixel
			var outGreen = (red * .349) + (green * .686) + (blue * .168);
			var outBlue = (red * .272) + (green * .534) + (blue * .131);

			d[i] = outRed < 255 ? outRed :
			255; // check if the value is less than 255, if more set it to 255
			d[i + 1] = outGreen < 255 ? outGreen : 255;
			d[i + 2] = outBlue < 255 ? outBlue : 255
			d[i + 3] = alpha;
		}


		return {
			width: res.width,
			height: res.height,
			data: d
		};
	}).then(res => {
		return this.putImageData(x, y, w, h, res);
	}).catch(e => console.error(e))

}


/**
 * 水平翻转图像
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
CRender.prototype.HorizontalFlip = function(x, y, w, h) {
	let t = this;
	let dpr = 1;
	// #ifndef H5
	dpr = t.ctx.dpr;
	// #endif
	return this.getImageData(x, y, w, h).then(async (res) => {
		// 1.获取通信信息
		let imgdata = res;
		let middleAxle /*中轴*/ = (w * dpr * 4) / 2;
		// 2.遍历行
		for (let curRow = 0; curRow < h * dpr; curRow++) {
			let aisleStart /*每行开始的通道位置*/ = curRow * w * dpr * 4,
				aisleEnd /*每行结束的通道位置*/ = (curRow + 1) * w * dpr * 4 - 4,
				curMiddleAxle /*每一行中轴所在的位置*/ = aisleEnd - middleAxle;

			// 3.遍历当前行的列作为内循环,把列的左边像素按照轴对称和右边的像素互换
			for (; aisleStart <= curMiddleAxle; aisleStart += 4, aisleEnd -= 4) {
				// 临时存放
				let tr = imgdata.data[aisleStart],
					tg = imgdata.data[aisleStart + 1],
					tb = imgdata.data[aisleStart + 2],
					ta = imgdata.data[aisleStart + 3];

				imgdata.data[aisleStart] = imgdata.data[aisleEnd];
				imgdata.data[aisleStart + 1] = imgdata.data[aisleEnd + 1];
				imgdata.data[aisleStart + 2] = imgdata.data[aisleEnd + 2];
				imgdata.data[aisleStart + 3] = imgdata.data[aisleEnd + 3];

				imgdata.data[aisleEnd] = tr;
				imgdata.data[aisleEnd + 1] = tg;
				imgdata.data[aisleEnd + 2] = tb;
				imgdata.data[aisleEnd + 3] = ta;
			}
		}
		return {
			width: res.width,
			height: res.height,
			data: imgdata.data
		};
	}).then(res => {
		return this.putImageData(x, y, w, h, res);
	}).catch(e => console.error(e))


}


/**
 * 垂直翻转图像
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
CRender.prototype.VerticallyFlip = function(x, y, w, h) {
	let t = this;
	let dpr = 1;
	// #ifndef H5
	dpr = t.ctx.dpr;
	// #endif
	return this.getImageData(x, y, w, h).then(async (res) => {
		// 1.获取图像信息
		let imgdata = res;
		let middleAxle /*中轴*/ = Math.floor(h / 2),
			rowAisles = w * 4;

		// 2.遍历总行数一半的每一行作为外循环(向下取整)
		for (var curRow = 0; curRow < middleAxle; curRow++) {
			// 
			let aisleStart /*开始的通道位置*/ = curRow * rowAisles,
				mirrorStart /*中轴对称的开始位置*/ = (h - curRow - 1) * rowAisles;

			// 3.遍历当前行的列作为内循环,把列的每个通道按照水平轴对称和镜像里的通道互换
			for (; aisleStart < rowAisles * (curRow + 1); aisleStart += 4, mirrorStart += 4) {
				var tr = imgdata.data[aisleStart],
					tg = imgdata.data[aisleStart + 1],
					tb = imgdata.data[aisleStart + 2],
					ta = imgdata.data[aisleStart + 3];

				imgdata.data[aisleStart] = imgdata.data[mirrorStart];
				imgdata.data[aisleStart + 1] = imgdata.data[mirrorStart + 1];
				imgdata.data[aisleStart + 2] = imgdata.data[mirrorStart + 2];
				imgdata.data[aisleStart + 3] = imgdata.data[mirrorStart + 3];

				imgdata.data[mirrorStart] = tr;
				imgdata.data[mirrorStart + 1] = tg;
				imgdata.data[mirrorStart + 2] = tb;
				imgdata.data[mirrorStart + 3] = ta;
			}
		}
		return {
			width: res.width,
			height: res.height,
			data: imgdata.data
		};
	}).then(res => {
		return this.putImageData(x, y, w, h, res);
	}).catch(e => console.error(e))


}


/**
 * 水平镜像，左右居中对称图像
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
CRender.prototype.HorizontalMirror = function(x, y, w, h) {
	let t = this;
	let dpr = 1;
	// #ifndef H5
	dpr = t.ctx.dpr;
	// #endif
	return this.getImageData(x, y, w, h).then(async (res) => {
		 var output =res;
		  var w = res.width;
		  var h = res.height;
		  var dst = output.data;
		  var d = res.data;
		  for (var y=0; y<h; y++) {
		    for (var x=0; x<w; x++) {
		      var off = (y*w+x)*4;
		      var dstOff = (y*w+(w-x-1))*4;
		      dst[dstOff] = d[off];
		      dst[dstOff+1] = d[off+1];
		      dst[dstOff+2] = d[off+2];
		      dst[dstOff+3] = d[off+3];
		    }
		  }
		return {
			width: res.width,
			height: res.height,
			data: dst
		};
	}).then(res => {
		return this.putImageData(x, y, w, h, res);
	}).catch(e => console.error(e))


}
/**
 * 垂直镜像，上下居中对称图像
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
CRender.prototype.VerticallyMirror = function(x, y, w, h) {
	let t = this;
	let dpr = 1;
	// #ifndef H5
	dpr = t.ctx.dpr;
	// #endif
	return this.getImageData(x, y, w, h).then(async (res) => {
		 var output =res;
		 var w = res.width;
		   var h = res.height;
		   var dst = output.data;
		   var d = res.data;
		   for (var y=0; y<h; y++) {
		     for (var x=0; x<w; x++) {
		       var off = (y*w+x)*4;
		       var dstOff = ((h-y-1)*w+x)*4;
		       dst[dstOff] = d[off];
		       dst[dstOff+1] = d[off+1];
		       dst[dstOff+2] = d[off+2];
		       dst[dstOff+3] = d[off+3];
		     }
		   }
		return {
			width: res.width,
			height: res.height,
			data: dst
		};
	}).then(res => {
		return this.putImageData(x, y, w, h, res);
	}).catch(e => console.error(e))


}
