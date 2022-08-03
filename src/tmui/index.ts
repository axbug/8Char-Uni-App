import { fetchNet } from './tool/lib/fetch';
import themeTool from './tool/theme/theme';
import preview, * as util from './tool/function/util';
import { language, languageByGlobal } from "./tool/lib/language"
import { share } from "./tool/lib/share"
import { App, nextTick } from "vue"
import PageJsonInit from "../pages.json"

let pages = [];
PageJsonInit.pages.forEach(el => {
	pages.push({
		path: el.path,
		custom: el?.style?.navigationStyle ?? "default"
	})
})
if (Array.isArray(PageJsonInit?.subPackages)) {
	PageJsonInit.subPackages.forEach(el => {
		let rootPath = el.root;
		el.pages.forEach(el2 => {
			pages.push({
				path: rootPath + "/" + el2.path,
				custom: el2?.style?.navigationStyle ?? "default"
			})
		})
	})
}


const $tm = {
	tabBar: PageJsonInit?.tabBar ?? {
		color: "",
		selectedColor: "",
		borderStyle: "",
		backgroundColor: "",
	},
	pages: pages,
	isColor: themeTool.isCssColor,
	u: { ...util, preview },
	language: language,
	fetch: fetchNet
};

uni.$tm = $tm

export default {
	install: (app: App, options: object) => {
		// #ifndef APP-NVUE
		app.use(languageByGlobal())
		// #endif
		let appconfig = {};
		// #ifdef MP
		const { onShareAppMessage, onShareTimeline } = share()
		appconfig = { ...appconfig, onShareAppMessage, onShareTimeline }
		// #endif

		app.mixin({
			...appconfig,
		})
		app.config.globalProperties.tm = $tm;
	}
};
