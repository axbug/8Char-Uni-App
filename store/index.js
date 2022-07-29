import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const modulesList = {};

function importAll(file) {
	file.keys().forEach(item => {
		const reg = /\.\/(.*)\.js/;
		const result = reg.exec(item);
		if (result[1]) {
			const name = result[1]
			const modules = file(item)
			if (modules && modules.default) {
				modulesList[name] = modules.default;
			}
		}

	})
}

importAll(require.context("./modules", true, /\.js$/))

export default new Vuex.Store({
	modules: modulesList
})
