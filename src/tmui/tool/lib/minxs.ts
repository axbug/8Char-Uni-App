
import colors from '../theme/theme';
import { cssDirection, linearDirection, linearDeep, borderStyle, cssstyle, tmVuetify, cssDirectionType, linearDirectionType, linearDeepType, borderStyleType } from './interface';
import { computed,PropType,ref } from "vue"
// import { useTmpiniaStore } from './tmpinia';
// const store = useTmpiniaStore();
//自定义props
export const custom_props = {
	//自定义的样式属性
	_style: {
		type: [Array, String, Object],
		default: () => []
	},
	//自定义类名
	_class: {
		type: [Array, String],
		default: ''
	},
	//当前组件的主题。可以是颜色值，也可以是主题名称。
	color: {
		type: String,
		default: 'primary'
	},
	//是否跟随全局主题的变换而变换
	followTheme: {
		type: [Boolean, String],
		default: false
	},
	//暗黑
	dark: {
		type: [Boolean, String],
		default: false
	},
	//是否跟随主题全局切换暗黑模式。
	followDark: {
		type: [Boolean, String],
		default: true
	},
	/**
	 * 圆角
	 */
	round: {
		type: [Number],
		default: 0
	},
	/**
	 * 投影，安卓上只有黑灰投影。
	 */
	shadow: {
		type: [Number],
		default: 0,//4
	},
	/**
	 * 是否镂空背景。
	 */
	outlined: {
		type: [Boolean],
		default: false
	},
	/**
	 * 边线
	 */
	border: {
		type: [Number],
		default: 0
	},
	/**
	 * 边线样式
	 * @field solid|dashed|dotted
	 * @default solid
	 */
	borderStyle: {
		type: [String],
		default: borderStyle.solid,
		validator:(value:borderStyleType)=> {
			let mp:Array<borderStyleType> = ["dashed","dotted","solid"]
			if(!mp.includes(value)){
				console.error('边线类型只能为borderStyle中的一种。')
			}
			return mp.includes(value)
		}
	},
	/**
	 * 边线的方向。
	 */
	borderDirection: {
		type: String,
		default: cssDirection.all,
		validator:(value:cssDirectionType)=> {
			let mp:Array<cssDirectionType> = ["all","bottom","bottomleft","bottomright","left","leftright","right","right","top","topbottom","topleft","topright","x","y"]
			if(!mp.includes(value)){
				console.error('边线方向格式只能为cssDirection中的一种。')
			}
			return mp.includes(value)
		}
	},
	/**
	 * 是否浅色背景
	 */
	text: {
		type: [Boolean, String],
		default: false
	},
	/**
	 * 是否透明背景
	 */
	transprent: {
		type: [Boolean, String],
		default: true
	},
	/**
	 * 渐变背景方向
	 */
	linear: {
		type: [String],
		default: linearDirection.none,//left:右->左，right:左->右。top:下->上，bottom:上->下。
		validator:(value:linearDirectionType)=> {
			let mp = ['left','right','bottom','top','']
			if(!mp.includes(value)){
				console.error('渐变方向只能为,left:右->左，right:左->右。top:下->上，bottom:上->下,中的一种。')
			}
			return mp.includes(value)
		}
	},
	// 渐变的亮浅
	linearDeep: {
		type: [String],
		default: linearDeep.light,//light,dark,accent亮系渐变和深色渐变。
		validator:(value:linearDeepType)=> {
			let mp:Array<linearDeepType> = ["accent","dark","light"]
			if(!mp.includes(value)){
				console.error('渐变方向只能为light,dark,accent中的一种。')
			}
			return mp.includes(value)
		}
	},
	//是否禁用圆角功能 ，针对安卓的特别处理。
	isDisabledRoundAndriod: {
		type: [Boolean, String],
		default: false
	},
	//是否开启磨砂背景。
	blur:{
		type:Boolean,
		default:false
	}
}
//暗黑状态。
export const computedDark = (props: any, tmcfg: tmVuetify): boolean => {
	const followDark = props.followDark;
	const dark = props.dark;
	const glboalDark = tmcfg.dark;
	if (followDark) {
		return glboalDark;
	}
	return dark;
}
//自定义类计算属性。
export const computedClass = (props: any): string => {
	const _class = props._class;
	if (typeof _class == 'string') {
		return _class
	}
	if (Array.isArray(_class)) {
		return _class.join(' ');
	}
	return '';
}
//自定义样式计算属性。
export const computedStyle = (props: any): object => {
	const _style = props._style;
	if (typeof _style == 'string') {
		let p = _style.split(";");
		let k = p.map(el => {
			el = el.replace(";", "");
			let node: any = {};
			let idx = el.split(":");
			node[idx[0]] = idx[1];
			return node;
		})
		let kl = {};
		k.forEach(el => {
			kl = { ...kl, ...el }
		})
		return kl;
	}
	if (typeof _style == 'object' && !Array.isArray(_style)) {
		return _style;
	}
	if (typeof _style == 'object' && Array.isArray(_style)) {
		let kl = {};
		_style.forEach(el => {
			kl = { ...kl, ...el }
		})
		return kl;
	}
	return {};
}
//主题样式表
export const computedTheme = (props: any, dark:boolean,store:any):cssstyle => {
	const color = props.color;
	const border = props.border;
	const shadow = props.shadow;
	const round = props.round;
	const outlined = props.outlined;
	const text = props.text;
	const borderStyle = props.borderStyle;
	const borderDirection = props.borderDirection;
	const linear = props.linear;
	const linearDeep = props.linearDeep;
	const blur = props.blur;
	if (colors.isCssColor(color)) {
		console.error('不支持自定义组件上的颜色值，请在theme/theme.js中添加自定义的颜色值为主题。当前已切换为primary主题。');
	}
	let defaultColorName = color || 'primary';
	
	if(props?.followTheme==true&&store.color){
		defaultColorName = store.color;
	}
	
	var theme = new colors.themeColors(store.colorList);
	let c = theme.getTheme({
		colorname: defaultColorName,
		dark: dark,
		borderWidth: border,
		shadow: parseInt(String(shadow)),
		round: parseInt(String(round)),
		outlined: outlined ? true : false,
		text: text ? true : false,
		borderStyle: borderStyle,
		borderDirection: <cssDirectionType>borderDirection,
		linearDirection: <linearDirectionType>linear,
		linearDeep: <linearDeep>linearDeep,
		blur: blur,
	});
	
	return c;

};
