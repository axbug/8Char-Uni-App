import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { resolve } from "path"
import dotenv from 'dotenv'

// https://vitejs.dev/config/

dotenv.config({
	path: resolve(__dirname, `.env.${process.env.NODE_ENV}`)
})

export default defineConfig({
	base: process.env.VITE_APP_BASE_URL || './',
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
