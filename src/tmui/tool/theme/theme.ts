
/**
 * 主题工具
 * @author tmzdy tmVuetify
 * @description 主题样式生成工具
 * @copyright tmzdy|tmui|https://tmui.design
 */
import { colortool } from './colortool';
import { cssStyleConfig, cssstyle, colorThemeType, cssDirection , linearDirection,linearDeep,linearDirectionType } from '../lib/interface';
//导入用户自定义的主题色值。
import { theme } from '../../../theme/index';
var colors: Array<colorThemeType> = [];
var colorObj: any = {
	red: '#ff2414',
	pink: '#ea2a6a',
	purple: '#9C27B0',
	'deep-purple': '#673AB7',
	indigo: '#3F51B5',
	blue: '#2196F3',
	'light-blue': '#03A9F4',
	cyan: '#00BCD4',
	teal: '#009688',
	green: '#4ec752',
	'light-green': '#8BC34A',
	lime: '#CDDC39',
	yellow: '#ffe814',
	amber: '#FFC107',
	orange: '#ffa114',
	'deep-orange': '#FF5722',
	brown: '#795548',
	'blue-grey': '#607D8B',
	grey: '#9E9E9E',
	black: '#000000',
	white: '#FFFFFF',
	primary: '#3B5CF0',
	'grey-5': '#fafafa',
	'grey-4': '#f5f5f5',
	'grey-3': '#eeeeee',
	'grey-2': '#e0e0e0',
	'grey-1': '#bdbdbd',
	'grey-darken-1': '#757575',
	'grey-darken-2': '#616161',
	'grey-darken-3': '#424242',
	'grey-darken-4': '#212121',
	'grey-darken-5': '#131313',
	'grey-darken-6': '#0a0a0a',
	...theme
};
for (const key in colorObj) {
	if (Object.prototype.hasOwnProperty.call(colorObj, key)) {
		const element: string = String(colorObj[key]);
		if (isCssColor(element)) {
			let rgba = colortool.cssToRgba(element);
			colors.push({
				name: key,
				value: element,
				hsva: colortool.rgbaToHsva(colortool.cssToRgba(element)),
				rgba: colortool.cssToRgba(element),
				hsla: colortool.rgbaToHsla(rgba),
				csscolor: `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`
			});
		}
	}
}

function isCssColor(color:string) {
	const reg1 = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	const reg2 = /^(rgb|RGB|rgba|RGBA)/;
	return reg1.test(color) || reg2.test(color);
}
function getColor(colorName:string){
		let isHand: number = colors.findIndex(function(el, index) {
			return el.name == colorName;
		});
		if (isHand == -1) {
			colorName = "primary";
			isHand = colors.findIndex(function(el, index) {
				return el.name == colorName;
			});
			console.error('主题中不存在相关名称的主题。');
		}
		
		
		return colors[isHand];
	}
class themeColors {
	colors: Array<colorThemeType> = [];
	constructor(c: Array<colorThemeType> = colors) {
		this.colors = c;
	}
	public add(colorName:string="",value:string="" ) {
		let isHand: Array<colorThemeType> = this.colors.filter(function(el, index) {
			return el.name == colorName;
		});
		if (isHand.length > 0) {
			console.error('已存在相关颜色名称!!!');
			return this.colors;
		}
		if(!value){
			console.error('颜色值必填!!!');
			return this.colors;
		}
		let rgba = colortool.cssToRgba(value);
		let color:colorThemeType ={
			csscolor:"",
			hsva: { h: 0, s: 0, v: 0, a: 0 },
			hsla: { h: 0, s: 0, l: 0, a: 0 },
			rgba: { r: 0, g: 0, b: 0, a: 0 },
			name:colorName,value:value
		};
		color.csscolor = colortool.rgbaToCss(rgba);
		color.hsva = colortool.rgbaToHsva(rgba);
		color.rgba = rgba;
		color.hsla = colortool.rgbaToHsla(rgba);
		this.colors.push(color);
		return this.colors;
	}
	public del(colorName: string) {
		let isHand: number = this.colors.findIndex(function(el, index) {
			return el.name == colorName;
		});
		if (isHand == -1) {
			console.error('删除失败，主题中不存在相关名称的主题。');
			return;
		}
		this.colors.splice(isHand, 1);
	}
	public getColor(colorName:string):colorThemeType{
		let isHand: number = this.colors.findIndex(function(el, index) {
			return el.name == colorName;
		});
		if (isHand == -1) {
			colorName = "primary";
			isHand = this.colors.findIndex(function(el, index) {
				return el.name == colorName;
			});
			console.error('主题中不存在相关名称的主题。');
		}
		
		
		return this.colors[isHand];
	}
	public getTheme(config: cssStyleConfig = { colorname: 'primary',dark:false }): cssstyle {
		if (!config['colorname']) {
			console.error('颜色名称必填');
			config.colorname = 'primary';
		}
		let index = this.colors.findIndex(el => el.name == config.colorname);
		if(index==-1){
			console.error('主题不存在，默认为primary');
			config.colorname = 'primary';
		}
		let isBlack = false;
		let isWhite = false;
		let isBlackAndWhite = false;//是否是黑白色系之间。
		let isGrey = false
		//当前颜色对象。
		let nowColor = { ...this.colors[index] };
		
		config.borderWidth = isNaN(parseInt(String(config['borderWidth']))) ? 0 : config['borderWidth'];
		config.borderStyle = config['borderStyle'] ? config['borderStyle'] : 'solid';
		config.borderDirection = config['borderDirection'] || cssDirection.all;
		config.linearDirection = config['linearDirection'] || linearDirection.none;
		config.linearDeep = config['linearDeep'] || linearDeep.light;
		config.shadow = isNaN(parseInt(String(config['shadow']))) ? 6 : config['shadow'];
		config.round = isNaN(parseInt(String(config['round']))) ? 4 : config['round'];
		config.opaticy = isNaN(parseInt(String(config['opaticy']))) ? 1 : config['opaticy'];
		config.outlined = typeof config['outlined'] == 'boolean' ? config['outlined'] : false;
		config.text = typeof config['text'] == 'boolean' ? config['text'] : false;
		config.blur = typeof config['blur'] == 'boolean' ? config['blur'] : false;

		//黑
		if (nowColor.hsla.h == 0 && nowColor.hsla.s == 0 && nowColor.hsla.l == 0) {
			isBlack = true;
			
		}
		//白
		if (nowColor.hsla.h == 0 && nowColor.hsla.s == 0 && nowColor.hsla.l == 100) {
			isWhite = true;
		}
		//白
		if (nowColor.hsla.h == 0 && nowColor.hsla.s == 0 && nowColor.hsla.l < 100) {
			isGrey = true;
		}
		if (nowColor.hsla.h == 0 && nowColor.hsla.s == 0) {
			isBlackAndWhite=true;
		}
		
		let css:cssstyle = {};
		css.color = nowColor.value;
		css.config = { ...config };
		css.isBlackAndWhite = isBlackAndWhite;
		css.gradientColor = []
		css.colorname = config.colorname;
		let borderhsl = { ...nowColor.hsla };
		
		let borderDir = "all";
		css.borderCss = {};

		//背景颜色。
		let bghsl = { ...nowColor.hsla };
		if(config.dark){
			if(nowColor.hsla.h != 0 && nowColor.hsla.s != 0){
				bghsl.l=40
			}
		}
		if(config.blur){
			bghsl.a = 0.85
		}
		css.backgroundColor = colortool.rgbaToCss(colortool.hslaToRgba({ ...bghsl }));
		
		if (nowColor.hsla.h == 0 && nowColor.hsla.s == 0 && config.dark) {
			css.backgroundColor = colortool.rgbaToCss(colortool.hslaToRgba({ ...bghsl, l: 8 }));
			css.border = colortool.rgbaToCss(colortool.hslaToRgba({ ...borderhsl, l: 12 }));
		}
		if (nowColor.hsla.h == 0 && nowColor.hsla.s == 0 && !config.dark && nowColor.hsla.l==100) {
			css.border = colortool.rgbaToCss(colortool.hslaToRgba({ ...borderhsl, l: 90 }));
		}
		if (nowColor.hsla.h == 0 && nowColor.hsla.s == 0 && !config.dark && nowColor.hsla.l==0) {
			css.border = colortool.rgbaToCss(colortool.hslaToRgba({ ...borderhsl, l: 12 }));
		}
		
		css.backgroundColorCss = { 'background-color': css.backgroundColor }

		//文字颜色。
		let txcolor = { ...nowColor.hsla };
		//当亮度小于（含）50需要降低文本颜色的亮度，即加深。，否则加亮，即变浅色。
		if(config.dark){
			txcolor.l = 95;
		}else{
			if (nowColor.hsla?.l <= 65) {
				txcolor.l = 95;
			} else {
				if(isGrey){
					txcolor.l = 10;
				}else{
					txcolor.l = 20;
				}
			}
		}
		if (nowColor.hsla.h > 45 && nowColor.hsla.h < 90 && nowColor.hsla.h!=0&&nowColor.hsla.s!=0) {
			txcolor.l = 20;
		}
		
		
		

		//外边框轮廓时
		//outlined
		if (config.outlined) {
			txcolor.l = 50;
			if (config.dark) {
				txcolor.l = 55;
			}else{
				if (nowColor.hsla.h > 45 && nowColor.hsla.h < 90 && nowColor.hsla.h!=0&&nowColor.hsla.s!=0) {
					txcolor.l = 20;
				}
			}
			if ((isBlack || isWhite) && config.dark) {
				txcolor.l = 100
			}
			config.borderWidth = config['borderWidth'] || 2;
			let n_hsl = { h: nowColor.hsla.h, s: nowColor.hsla.s, l: 0, a: 0 };
			let o_bgcss = colortool.rgbaToCss(colortool.hslaToRgba(n_hsl));
			css.backgroundColor = o_bgcss;
			css.backgroundColorCss = { 'background-color': o_bgcss }

			css.textColor = colortool.rgbaToCss(colortool.hslaToRgba(txcolor));
			css.border = css.textColor;
		}

		//text
		if (config.text) {
			txcolor.l = 90;
			if(isGrey){
				txcolor.l = 15;
			}else{
				txcolor.l = 55;
				if (nowColor.hsla.h > 45 && nowColor.hsla.h < 90 && nowColor.hsla.h!=0&&nowColor.hsla.s!=0) {
					txcolor.l = 20;
				}
				
			}
			if (config.dark) {
				txcolor.l = 55;
			}
			if (isBlack) {
				txcolor.l = 90
			}
			if (isWhite) {
				txcolor.l = 15
			}
			if (nowColor.hsla.h == 0 && nowColor.hsla.s == 0 && config.dark) {
				txcolor.l = 90;
			}
			
			
			css.textColor = colortool.rgbaToCss(colortool.hslaToRgba(txcolor));
			css.border = css.textColor;
			let o_now_bgColor = nowColor.csscolor;
			let n_hsl = { h: nowColor.hsla.h, s: nowColor.hsla.s, l: 96, a: nowColor.hsla.a };
			if (config.dark) {
				if(nowColor.hsla.h != 0 && nowColor.hsla.s != 0){
					n_hsl.l = 12;
					n_hsl.s = 35;
				}else{
					n_hsl.l = 12;
					n_hsl.s = 0;
				}
				
			}
			if(config.blur){
				n_hsl.a = 0.85
			}
			o_now_bgColor = colortool.rgbaToCss(colortool.hslaToRgba(n_hsl));
			
			css.backgroundColor = o_now_bgColor;
			css.backgroundColorCss = { 'background-color': o_now_bgColor }
		}
		
		//shadow
		if (config.shadow) {
			let n_hsl = { h: nowColor.hsla.h, s: 100, l: 50, a: 0.2 };
			if (nowColor.hsla.h == 0 && nowColor.hsla.s == 0) {
				//黑白要反转。
				n_hsl = { h: 0, s: 0, l: 20, a: 0.07 };
			}
			let o_bgcss = colortool.rgbaToCss(colortool.hslaToRgba(n_hsl));
			css.shadowColor = {
				boxShadow: `0rpx ${config.shadow * 2.5}rpx ${config.shadow * 6}rpx ${o_bgcss}`
			}
		}



		//处理渐变色
		if (config.linearDirection) {
			
			let liner_color_1 = { h: 0, s: 0, l: 0, a: nowColor.hsla.a };
			let liner_color_2 = { h: 0, s: 0, l: 0, a: nowColor.hsla.a };
			let dir_str =   linearDirection[config.linearDirection];
			
			//先计算渐变的亮色系。
			// 先算白或者黑
			// 如果是白
			if (nowColor.hsla.h == 0 && nowColor.hsla.s == 0 && nowColor.hsla.l == 100) {
				//白。
				if (config.linearDeep == 'light') {
					liner_color_1.l = 80;
					liner_color_2.l = 20;
				} else {
					liner_color_1.l = 50;
					liner_color_2.l = 40;
				}
			} else if (nowColor.hsla.h == 0 && nowColor.hsla.s == 0 && nowColor.hsla.l == 0) {
				//黑。
				if (config.linearDeep == 'light') {
					liner_color_1.l = 40;
					liner_color_2.l = 10;
				} else {
					liner_color_1.l = 30;
					liner_color_2.l = 0;
				}

			} else {
				liner_color_2.h = nowColor.hsla.h;
				liner_color_2.s = nowColor.hsla.s;

				liner_color_1.h = nowColor.hsla.h;
				liner_color_1.s = nowColor.hsla.s;
				if (config.linearDeep == 'light') {
					liner_color_1.l = 70;
					liner_color_1.s = 95;
					liner_color_1.h -= 5;
					liner_color_2.l = 45;
					liner_color_2.s = 95;
					liner_color_2.h += 5;

				} else if (config.linearDeep == 'dark') {
					liner_color_1.l = 70;
					liner_color_1.s = 50;
					liner_color_2.l = 45;
					liner_color_2.s = 100;
				} else if (config.linearDeep == 'accent') {
					liner_color_1.h -=0;//色相需要往前偏移加强色系
					liner_color_1.s = 80;//饱和度需要加强
					liner_color_1.l = 55;
					liner_color_2.l = 65;
					liner_color_2.h -=35;//偏移30度的色相搭配色进行渐变
					liner_color_2.s = 80;//饱和度需要加强
				}

			}
			if (config.dark) {
				liner_color_1.l = 40
				liner_color_2.l = 40
				txcolor.l = 90;
			}
			// 背景颜色取中间。
			let color_t_1 = colortool.rgbaToCss(colortool.hslaToRgba(liner_color_1));
			let color_t_2 = colortool.rgbaToCss(colortool.hslaToRgba(liner_color_2));
			if (!config.text && !config.outlined) {
				css.backgroundColorCss = { 'background-image': `linear-gradient(${dir_str},${color_t_1},${color_t_2})` }
				let newBgcolor = {
					h:(liner_color_1.h+liner_color_2.h)/2,
					s:(liner_color_1.s+liner_color_2.s)/2,
					l:(liner_color_1.l+liner_color_2.l)/2,
					a:(liner_color_1.a+liner_color_2.a)/2
				}
				if (!config.dark) {
					if (nowColor.hsla.h > 45 && nowColor.hsla.h < 90 && nowColor.hsla.h!=0&&nowColor.hsla.s!=0) {
						txcolor.l = 20;
					}
				}
				css.backgroundColor = colortool.rgbaToCss(colortool.hslaToRgba(newBgcolor));
				css.gradientColor = [color_t_1, color_t_2]
			}

		}

		if (config.dark == true) {
			css.cardcolor = 'rgba(26, 26,26, 1.0)'; //项目
			css.inputcolor = 'rgba(31, 31,31, 1.0)';//输入框，表单等
			css.bodycolor = 'rgba(5,5,5, 1.0)';//背景
			css.disablecolor = 'rgba(30, 30, 30, 1.0)';//禁用的项目或者表单
			css.textDisableColor = 'rgba(100, 100, 100, 1.0)';//文本禁用色.
		}
		
		css.textColor = colortool.rgbaToCss(colortool.hslaToRgba(txcolor));
		if(config.dark){
			if(nowColor.hsla.h != 0 && nowColor.hsla.s != 0){
				css.border = colortool.rgbaToCss(colortool.hslaToRgba({ ...nowColor.hsla, l: bghsl.l+10 }));
			}
			if(nowColor.hsla.h == 0 && nowColor.hsla.s == 0){
				css.border = colortool.rgbaToCss(colortool.hslaToRgba({ ...nowColor.hsla, l: 12 }));
			}
		}else{
			if(nowColor.hsla.h != 0 && nowColor.hsla.s != 0){
				css.border = colortool.rgbaToCss(colortool.hslaToRgba({ ...nowColor.hsla, l: bghsl.l-10 }));
			}
			if(nowColor.hsla.h == 0 && nowColor.hsla.s == 0){
				css.border = colortool.rgbaToCss(colortool.hslaToRgba({ ...nowColor.hsla, l: 90 }));
			}
		}
		
		//设置边线样式。
		if (config.borderDirection == 'all') {
			css.borderCss[`border`] = `${config.borderWidth}rpx ${config.borderStyle} ${css.border}`;
		} else if (config.borderDirection == 'x' ||config.borderDirection ==  "leftright") {
			css.borderCss[`border-left`] = `${config.borderWidth}rpx ${config.borderStyle} ${css.border}`;
			css.borderCss[`border-right`] = `${config.borderWidth}rpx ${config.borderStyle} ${css.border}`;
		} else if (config.borderDirection == 'y' ||config.borderDirection ==  "topbottom") {
			css.borderCss[`border-top`] = `${config.borderWidth}rpx ${config.borderStyle} ${css.border}`;
			css.borderCss[`border-bottom`] = `${config.borderWidth}rpx ${config.borderStyle} ${css.border}`;
		} else if (config.borderDirection == 'bottomleft') {
			css.borderCss[`border-left`] = `${config.borderWidth}rpx ${config.borderStyle} ${css.border}`;
			css.borderCss[`border-bottom`] = `${config.borderWidth}rpx ${config.borderStyle} ${css.border}`;
		} else if (config.borderDirection == 'bottomright') {
			css.borderCss[`border-right`] = `${config.borderWidth}rpx ${config.borderStyle} ${css.border}`;
			css.borderCss[`border-bottom`] = `${config.borderWidth}rpx ${config.borderStyle} ${css.border}`;
		} else if (config.borderDirection == 'topleft') {
			css.borderCss[`border-left`] = `${config.borderWidth}rpx ${config.borderStyle} ${css.border}`;
			css.borderCss[`border-top`] = `${config.borderWidth}rpx ${config.borderStyle} ${css.border}`;
		} else if (config.borderDirection == 'topright') {
			css.borderCss[`border-right`] = `${config.borderWidth}rpx ${config.borderStyle} ${css.border}`;
			css.borderCss[`border-top`] = `${config.borderWidth}rpx ${config.borderStyle} ${css.border}`;
		} else {
			let str = '-' + config.borderDirection;
			css.borderCss[`border${str}`] = `${config.borderWidth}rpx ${config.borderStyle} ${css.border}`;
			
		}
		return css;
	}
}

export default {
	isCssColor,
	themeColors,
	getColor
};
