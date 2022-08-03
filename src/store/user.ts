import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
	state: () => {
		return {
			realname: null,
			gender: 0,
			timestamp: null,
		};
	},
	actions: {
		set(data) {
			for (let key in data) {
				this[key] = data[key];
			}
		}
	}
});
