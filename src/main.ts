import { createSSRApp } from 'vue';
import { createPinia } from 'pinia'
import tmui from "./tmui"
import App from './App.vue';

export function createApp() {
	const app = createSSRApp(App);
	const pinia = createPinia()
	app.use(pinia);
	app.use(tmui,{} as Tmui.tmuiConfig)
	return {
		app,
		pinia
	};
}
