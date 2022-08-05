export function setDomDarkOrWhite(){
	// #ifdef H5
	let  tmuiNavStyle= localStorage.getItem("tmuiNavStyle")
	try{
		
		if(tmuiNavStyle&&typeof tmuiNavStyle !='undefined'){
			let tmuiNavStyleJson = JSON.parse(tmuiNavStyle);
			if(document.querySelector("#tmuiBodyId")){
				document.body.removeChild(document.querySelector("#tmuiBodyId"))
			}
			let style = document.createElement('style')
			style.type="text/css"
			style.id="tmuiBodyId";
			style.append(document.createTextNode(`.uni-page-head{background-color:${tmuiNavStyleJson?.navbarBackground??'none'} !important} body{background:#000}`))
			document.body.append(style)
		}
	}catch(e){
		//TODO handle the exception
	}
	// #endif
}