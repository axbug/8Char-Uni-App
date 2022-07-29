const state = {
	realname: null,
	gender: 0,
	// 阳历
	date: {
		year: null,
		month: null,
		day: null,
		hour: null,
		minute: null,
		time: null,
	},
}

const getters = {}

const mutations = {
	set(state, data) {
		for (let key in data) {
			state[key] = data[key];
		}
	},
	pull(state, data) {
		this.commit('userinfo/set', data);
		this.commit('bazi/pull', data);
	}
}

const actions = {}

export default {
	namespaced: true,
	state: state,
	getters: getters,
	mutations: mutations,
	actions: actions
}
