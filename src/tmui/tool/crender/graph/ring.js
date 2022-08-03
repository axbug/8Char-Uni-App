
/**
 * 环形图。
 * 作者：tmzdy
 * url:https://jx2d.cn
 */
let ring = function (render, config={}) {

	
	let defauletcfg = {
		tooltip: {
			trigger: 'item'
		},
		color:["#E91E63","#2196F3","#311B92","#FDD835","#BCAAA4"],
		legend: {
			top: '5%',
			left: 'center'
		},
		series: [{
			name: 'Access From',
			type: 'pie',
			radius: ['20%', '35%'],
			
			label: {
				show: false,
				position: 'center'
			},
			emphasis: {
				label: {
					show: true,
					fontSize: '40',
					fontWeight: 'bold'
				}
			},
			labelLine: {
				show: false
			},
			data: [{
					value: 1048,
					name: 'Search Engine'
				},
				{
					value: 735,
					name: 'Direct'
				},
				{
					value: 580,
					name: 'Email'
				},
				{
					value: 484,
					name: 'Union Ads'
				},
				{
					value: 300,
					name: 'Video Ads'
				}
			]
		}]
	}
	defauletcfg = {...defauletcfg,...config}
	const [w, h] = render.area;
	//最大圆环厚度。等于圆。
	let lineMaxHeight = w / 2;
	let lineStoreWidth = (parseFloat(defauletcfg.series[0].radius[1]) - parseFloat(defauletcfg.series[0].radius[0]))/100;
	lineStoreWidth =Math.floor( lineStoreWidth*lineMaxHeight);
	let r = parseFloat(defauletcfg.series[0].radius[1])/100 * lineMaxHeight;
	let data = defauletcfg.series[0].data;
	let maxValue = data.map(el => parseInt(el.value));
	
	//总数量。
	maxValue = maxValue.reduce((p,c)=>p+c);
	//计算各自的比例数量。保留两位小数点。
	let rang = Math.PI *2;
	//每一个元素的圆弧的长度。
	let rangArray = data.map(el=>{
		let num = parseInt(el.value)/maxValue;
		
		return rang*num
	})
	
	let dataBlv = data.map((el,index) => {
		let st  = index;
		let num = parseFloat(el.value)/maxValue;
		let blv = parseFloat(num.toFixed(2));
		let startAngle = 0;
		let endAngle = 0;
		if(st==0){
			startAngle = 0;
			endAngle = rangArray[st]
		}else{
			let s = rangArray.slice(0,st)
			
			startAngle = s.reduce((p,c)=>p+c);
			endAngle = startAngle+rangArray[st]
		}
		
		return {...el,
			blv:blv,
			startAngle:startAngle,
			endAngle:endAngle
		};
	});
	
	let xf = [];
	dataBlv.forEach((el,index)=>{
		
		let cfg = {
			name: 'arc',
			animationCurve: 'liner',
			hover: false,
			drag: false,
			shape: {
				rx: w/2,
				ry: h/2,
				r: r,
				startAngle: el.startAngle,
				endAngle: el.endAngle,
			},
			style: {
				stroke: defauletcfg.color[index],
				lineWidth: lineStoreWidth,
				shadowBlur: 0,
				rotate: 0,
				shadowColor: '#66eece',
				hoverCursor: 'pointer',
			},
		};
		xf.push(cfg)
		
	})
	
	return xf;
}

export default ring;
