import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
	state: () => {
		return {
			realname: "",
			gender: 0,
			timestamp: null,
			hideName: false
		};
	},
	actions: {
		set(data: any) {
			for (let key in data) {
				this[key] = data[key];
			}
		}
	}
});
