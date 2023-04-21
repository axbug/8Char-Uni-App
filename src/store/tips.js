import { defineStore } from 'pinia';

export const useTipsStore = defineStore('tips', {
    state: () => {
        return {
            gods: [],
            nayin: [],
            relation: [],
            trend:[],
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
