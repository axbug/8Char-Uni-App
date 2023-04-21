import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { resolve } from "path"

// https://vitejs.dev/config/

export default defineConfig({
	base: './',
	plugins: [
		uni(),
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src')
		}
	},
	build:{
		// sourcemap:true
	},
	server: {
		open:true,
		port: 3000,
	}
});
