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
});
