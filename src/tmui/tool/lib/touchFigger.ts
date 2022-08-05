
/**
 * 整理：tmzdy https:tmui.design
 * http://www.alloyteam.com/2016/05/super-small-web-gesture-library-alloyfinger-released/
 * http://www.alloyteam.com/
 * 使用方法：
		<view @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd"  @touchcancel="touchCancel" style="width:750rpx;height:500rpx;background:grey"></view>
		import {TouchFigger} from "../../tmui/tool/lib/touchFigger"
		var tfg = new TouchFigger()
		tfg.bind({
			pointStart: function () {
				//手指触摸屏幕触发
			},
			multipointStart: function () {
				//一个手指以上触摸屏幕触发
			},
			rotate: function (evt) {
				//evt.angle代表两个手指旋转的角度
				console.log(evt.angle);
			},
			pinch: function (evt) {
				//evt.scale代表两个手指缩放的比例
				console.log(evt.scale);
			},
			multipointEnd: function () {
				//当手指离开，屏幕只剩一个手指或零个手指触发
			},
			pressMove: function (evt) {
				//evt.deltaX和evt.deltaY代表在屏幕上移动的距离
				console.log(evt.deltaX);
				console.log(evt.deltaY);
			},
			tap: function (evt) {
				//点按触发
			},
			doubleTap: function (evt) {
				//双击屏幕触发
			},
			longTap: function (evt) {
				//长按屏幕750ms触发
			},
			swipe: function (evt) {
				//evt.direction代表滑动的方向
				console.log("swipe" + evt.direction);
			},
			singleTap: function (evt) {
				//单击
			}
		})
		const touchStart = tfg.start.bind(tfg)
		const touchMove = tfg.move.bind(tfg)
		const touchEnd = tfg.end.bind(tfg)
		const touchCancel = tfg.cancel.bind(tfg)
 */


class TouchFigger {
    constructor() {
        this.preV = {x: null, y: null};
        this.pinchStartLen = null;
        this.scale = 1;
        this.isDoubleTap = false;
    }

    bind(option) {
        this.element = null;

        this.rotate = wrapFunc(this.element, option.rotate || noop);
        this.touchStart = wrapFunc(this.element, option.touchStart || noop);
        this.multipointStart = wrapFunc(this.element, option.multipointStart || noop);
        this.multipointEnd = wrapFunc(this.element, option.multipointEnd || noop);
        this.pinch = wrapFunc(this.element, option.pinch || noop);
        this.swipe = wrapFunc(this.element, option.swipe || noop);
        this.tap = wrapFunc(this.element, option.tap || noop);
        this.doubleTap = wrapFunc(this.element, option.doubleTap || noop);
        this.longTap = wrapFunc(this.element, option.longTap || noop);
        this.singleTap = wrapFunc(this.element, option.singleTap || noop);
        this.pressMove = wrapFunc(this.element, option.pressMove || noop);
        this.touchMove = wrapFunc(this.element, option.touchMove || noop);
        this.touchEnd = wrapFunc(this.element, option.touchEnd || noop);
        this.touchCancel = wrapFunc(this.element, option.touchCancel || noop);

        this.delta = null;
        this.last = null;
        this.now = null;
        this.tapTimeout = null;
        this.singleTapTimeout = null;
        this.longTapTimeout = null;
        this.swipeTimeout = null;
        this.x1 = this.x2 = this.y1 = this.y2 = null;
        this.preTapPosition = {x: null, y: null};
    }

    start(evt) {
        if (!evt.touches) return;
        this.now = Date.now();
        this.x1 = evt.touches[0].pageX == null ? evt.touches[0].x : evt.touches[0].pageX;
        this.y1 = evt.touches[0].pageY == null ? evt.touches[0].y : evt.touches[0].pageY;
        this.delta = this.now - (this.last || this.now);
        this.touchStart.dispatch(evt);
        if (this.preTapPosition.x !== null) {
            this.isDoubleTap = (this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30);
        }
        this.preTapPosition.x = this.x1;
        this.preTapPosition.y = this.y1;
        this.last = this.now;
        let preV = this.preV,
            len = evt.touches.length;
        if (len > 1) {
            this._cancelLongTap();
            this._cancelSingleTap();
            let otx = evt.touches[1].pageX == null ? evt.touches[1].x : evt.touches[1].pageX;
            let oty = evt.touches[1].pageY == null ? evt.touches[1].y : evt.touches[1].pageY;
            let v = { x: otx - this.x1, y: oty - this.y1};
            preV.x = v.x;
            preV.y = v.y;
            this.pinchStartLen = getLen(preV);
            this.multipointStart.dispatch(evt);
        }
        this.longTapTimeout = setTimeout(function () {
            evt.type = "longTap";
            this.longTap.dispatch(evt);
        }.bind(this), 750);
    }

    move(evt) {
        if (!evt.touches) return;
        let preV = this.preV,
            len = evt.touches.length,
            currentX = evt.touches[0].pageX == null ? evt.touches[0].x : evt.touches[0].pageX,
            currentY = evt.touches[0].pageY == null ? evt.touches[0].y : evt.touches[0].pageY;
        this.isDoubleTap = false;
        if (len > 1) {
            let otx = evt.touches[1].pageX == null ? evt.touches[1].x : evt.touches[1].pageX;
            let oty = evt.touches[1].pageY == null ? evt.touches[1].y : evt.touches[1].pageY;
            let v = { x: otx - currentX, y: oty - currentY};

            if (preV.x !== null) {
                if (this.pinchStartLen > 0) {
                    evt.scale = getLen(v) / this.pinchStartLen;
                    evt.type = "pinch";
                    this.pinch.dispatch(evt);
                }

                evt.angle = getRotateAngle(v, preV);
                evt.type = "rotate";
                this.rotate.dispatch(evt);
            }
            preV.x = v.x;
            preV.y = v.y;
        } else {
            if (this.x2 !== null) {
                evt.deltaX = currentX - this.x2;
                evt.deltaY = currentY - this.y2;

            } else {
                evt.deltaX = 0;
                evt.deltaY = 0;
            }
            this.pressMove.dispatch(evt);
        }

        this.touchMove.dispatch(evt);

        this._cancelLongTap();
        this.x2 = currentX;
        this.y2 = currentY;
        if (len > 1) {
            // evt.preventDefault();
        }
    }

    end(evt) {
        if (!evt.changedTouches) return;
        this._cancelLongTap();
        let self = this;
        if (evt.touches.length < 2) {
            this.multipointEnd.dispatch(evt);
        }
        this.touchEnd.dispatch(evt);
        //swipe
        if ((this.x2 && Math.abs(this.x1 - this.x2) > 30) ||
            (this.y2 && Math.abs(this.y1 - this.y2) > 30)) {
            evt.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);
            this.swipeTimeout = setTimeout(function () {
                evt.type = "swipe";
                self.swipe.dispatch(evt);

            }, 0)
        } else {
            this.tapTimeout = setTimeout(function () {
                console.info("tap");
                evt.type = "tap";
                self.tap.dispatch(evt);
                // trigger double tap immediately
                if (self.isDoubleTap) {
                    evt.type = "doubleTap";
                    self.doubleTap.dispatch(evt);
                    clearTimeout(self.singleTapTimeout);
                    self.isDoubleTap = false;
                }
            }, 0)

            if (!self.isDoubleTap) {
                self.singleTapTimeout = setTimeout(function () {
                    self.singleTap.dispatch(evt);
                }, 250);
            }
        }

        this.preV.x = 0;
        this.preV.y = 0;
        this.scale = 1;
        this.pinchStartLen = null;
        this.x1 = this.x2 = this.y1 = this.y2 = null;
    }

    cancel(evt) {
        clearTimeout(this.singleTapTimeout);
        clearTimeout(this.tapTimeout);
        clearTimeout(this.longTapTimeout);
        clearTimeout(this.swipeTimeout);
        this.touchCancel.dispatch(evt);
    }


    _cancelLongTap() {
        clearTimeout(this.longTapTimeout);
    }

    _cancelSingleTap() {
        clearTimeout(this.singleTapTimeout);
    }

    _swipeDirection(x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
    }

    on(evt, handler) {
        if (this[evt]) {
            this[evt].add(handler);
        }
    }

    off(evt, handler) {
        if (this[evt]) {
            this[evt].del(handler);
        }
    }

    destroy() {
        if (this.singleTapTimeout) clearTimeout(this.singleTapTimeout);
        if (this.tapTimeout) clearTimeout(this.tapTimeout);
        if (this.longTapTimeout) clearTimeout(this.longTapTimeout);
        if (this.swipeTimeout) clearTimeout(this.swipeTimeout);

        this.element.removeEventListener("touchstart", this.start);
        this.element.removeEventListener("touchmove", this.move);
        this.element.removeEventListener("touchend", this.end);
        this.element.removeEventListener("touchcancel", this.cancel);

        this.rotate.del();
        this.touchStart.del();
        this.multipointStart.del();
        this.multipointEnd.del();
        this.pinch.del();
        this.swipe.del();
        this.tap.del();
        this.doubleTap.del();
        this.longTap.del();
        this.singleTap.del();
        this.pressMove.del();
        this.touchMove.del();
        this.touchEnd.del();
        this.touchCancel.del();

        this.preV = this.pinchStartLen = this.scale = this.isDoubleTap = this.delta = this.last = this.now = this.tapTimeout = this.singleTapTimeout = this.longTapTimeout = this.swipeTimeout = this.x1 = this.x2 = this.y1 = this.y2 = this.preTapPosition = this.rotate = this.touchStart = this.multipointStart = this.multipointEnd = this.pinch = this.swipe = this.tap = this.doubleTap = this.longTap = this.singleTap = this.pressMove = this.touchMove = this.touchEnd = this.touchCancel = null;

        return null;
    }

}

let noop = function () {
};

function getLen(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}

function getAngle(v1, v2) {
    let mr = getLen(v1) * getLen(v2);
    if (mr === 0) return 0;
    let r = dot(v1, v2) / mr;
    if (r > 1) r = 1;
    return Math.acos(r);
}

function cross(v1, v2) {
    return v1.x * v2.y - v2.x * v1.y;
}

function getRotateAngle(v1, v2) {
    let angle = getAngle(v1, v2);
    if (cross(v1, v2) > 0) {
        angle *= -1;
    }

    return angle * 180 / Math.PI;
}

let HandlerAdmin = function (el) {
    this.handlers = [];
    this.el = el;
};

HandlerAdmin.prototype.add = function (handler) {
    this.handlers.push(handler);
}

HandlerAdmin.prototype.del = function (handler) {
    if (!handler) this.handlers = [];

    for (let i = this.handlers.length; i >= 0; i--) {
        if (this.handlers[i] === handler) {
            this.handlers.splice(i, 1);
        }
    }
}

HandlerAdmin.prototype.dispatch = function () {
    for (let i = 0, len = this.handlers.length; i < len; i++) {
        let handler = this.handlers[i];
        if (typeof handler === 'function') handler.apply(this.el, arguments);
    }
}

function wrapFunc(el, handler) {
    let handlerAdmin = new HandlerAdmin(el);
    handlerAdmin.add(handler);

    return handlerAdmin;
}


export {TouchFigger} ;

