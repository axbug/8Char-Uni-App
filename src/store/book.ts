import { defineStore } from 'pinia';


export const useBookStore = defineStore('book', {
	state: () => {
		return {
			chenggu: {
				poetry:null,
				title:null,
				explain:null,
				total:null,
			},
			books: []
		};
	},
});
