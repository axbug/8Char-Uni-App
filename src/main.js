import { createSSRApp } from 'vue';
import { createPinia } from 'pinia'
import uView from 'vk-uview-ui';
import App from './App.vue';

export function createApp() {
	const app = createSSRApp(App);
	const pinia = createPinia()
	app.use(pinia);
	app.use(uView)
	return {
		app,
		pinia
	};
}
