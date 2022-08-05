import { EChartsCoreOption, EChartsOption } from "echarts";

class mytmcharts {
    web = null;
	width=0;
	height=0;
	optionNow:EChartsOption|null = null;
    constructor(c:any,w=0,h=0){
        this.web = c;
		this.width = w;
		this.height = h;
    }
    setOption(option:EChartsOption,opts:any={}){
        if(!this.web) return;
		this.optionNow = option;
        this.web.evalJs(`mychart.setOption(${JSON.stringify(option)},${JSON.stringify(opts)})`)
    }
	getWidth(){
		return this.width;
	}
	getHeight(){
		return this.height;
	}
	getDom(){
		return this.web;
	}
	getOption(){
		return this.optionNow;
	}
	resize(){
		if(!this.web) return;
		this.web.evalJs(`mychart.resize()`)
	}
	showLoading(opts:any){
		if(!this.web) return;
		this.web.evalJs(`mychart.showLoading(${JSON.stringify(opts)})`)
	}
	hideLoading(){
		if(!this.web) return;
		this.web.evalJs(`mychart.hideLoading()`)
	}
	getDataURL(){
		//暂不实现。
	}
}



export default mytmcharts