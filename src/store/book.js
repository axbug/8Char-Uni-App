import { defineStore } from 'pinia';

export const useBookStore = defineStore('book', {
	state: () => {
		return {
			weigh_bone: {
				poetry:null,
				title:null,
				explain:null,
				total:null,
			},
			books: []
		};
	},
	actions: {
		set(data) {
			for (let key in data) {
				this[key] = data[key];
			}
		}
	},
});
