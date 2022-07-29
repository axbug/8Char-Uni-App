import {
	Lunar
} from 'lunar-javascript';

import utils from '@/utils/init.js'

const state = {
	// 列表
	original: [],
	dayun_list: [],
	year_list: [],
	month_list: [],
	day_list: [],
	time_list: [],
	// 索引
	current_index: 0,
	year_index: 0,
	month_index: 0,
	day_index: 0,
	time_index: 0,
}

const getters = {}

const mutations = {
	set(state, data) {
		for (let key in data) {
			state[key] = data[key];
		}
	},
	pull(state, data) {
		const {
			original
		} = data
		state.original = original
		state.current_index = 0
		state.year_index = 0
		state.month_index = 0
		state.day_index = 0
		state.time_index = 0
		this.commit("yun/resolveDaYun")
	},
	// 大运
	resolveDaYun(state, data) {
		const {
			original
		} = state;
		const dayun_list = [];

		for (let i = 0; i < original.length; i++) {
			const item = original[i];
			const ganzhi = item.getGanZhi() || '小运'
			dayun_list.push({
				start_year: item.getStartYear(),
				start_age: item.getStartAge(),
				ganzhi: ganzhi,
				shishen: utils.GetShiShen(ganzhi)
			});
		}

		state.dayun_list = dayun_list;
		state.year_list = [];
		state.month_list = [];
		state.day_list = [];
		state.time_list = [];
		state.year_index = 0
		state.month_index = 0
		state.day_index = 0
		state.time_index = 0
		this.commit("yun/resolveLiuYear")
	},
	// 小运（流年）
	resolveLiuYear(state, data) {
		const {
			original,
			current_index
		} = state;

		const dayun = original[current_index];
		const xiaoyun = dayun.getXiaoYun();
		const year = dayun.getLiuNian();
		const year_list = [];

		for (let i = 0; i < year.length; i++) {
			const item = year[i];
			const ganzhi = item.getGanZhi()
			year_list.push({
				year: item.getYear(),
				ganzhi: ganzhi,
				age: item.getAge(),
				shishen: utils.GetShiShen(ganzhi)
			});
		}

		state.year_list = year_list;
		state.month_list = [];
		state.day_list = [];
		state.time_list = [];
		state.month_index = 0
		state.day_index = 0
		state.time_index = 0
		this.commit("yun/resolveLiuMonth")
	},
	resolveLiuMonth(state, data) {
		const {
			original,
			current_index,
			year_index
		} = state;

		const dayun = original[current_index];
		const year = dayun.getLiuNian();
		if(year.length === 0){
			// uni.$u.toast("获取流年数据失败！");
			return;
		}
		const month = year[year_index].getLiuYue();

		const month_list = [];
		const jieqi = year[year_index].getLunar().getJieQiTable();
		const map = ['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', 'DONG_ZHI'];

		for (let i = 0; i < month.length; i++) {
			const item = month[i];
			const _jieqi = jieqi[map[i]];
			const ganzhi = item.getGanZhi()
			month_list.push({
				original: _jieqi,
				year: year[year_index].getYear(),
				jieqi: i == 11 ? '冬至' : map[i],
				date: _jieqi.getMonth() + '/' + _jieqi.getDay(),
				ganzhi: ganzhi,
				shishen: utils.GetShiShen(ganzhi)
				// month: item.getMonthInChinese()
			});
		}

		state.month_list = month_list;
		state.day_list = [];
		state.time_list = [];
		state.day_index = 0
		state.time_index = 0


		this.commit("yun/resolveLiuDay")
	},
	resolveLiuDay(state, data) {
		const {
			year_list,
			year_index,
			month_list,
			month_index,
		} = state;
		const current = year_list[year_index].year + "/" + month_list[month_index].date
		let next = null
		if (month_index == 11) {
			// 跨年
			const _year = parseInt(year_list[year_index].year) + 1
			next = _year + "/" + month_list[0].date
		} else {
			next = year_list[year_index + 1].year + "/" + month_list[month_index].date
		}

		const current_timestamp = new Date(current.replace(/-/g,'/').replace(/T/g, ' ')).getTime()
		const next_timestamp = new Date(next.replace(/-/g,'/').replace(/T/g, ' ')).getTime()

		const day_list = []

		for (let i = current_timestamp; i < next_timestamp; i += 86400000) {
			const date = uni.$u.date(i, "yyyy-mm-dd")
			const diff = date.split("-")
			const lunar = Lunar.fromDate(new Date(date.replace(/-/g,'/').replace(/T/g, ' ')))
			const ganzhi = lunar.getDayInGanZhi()
			const params = {
				year: diff[0],
				month: diff[1],
				day: diff[2],
				nongli: lunar.getDayInChinese(),
				gan: lunar.getDayGan(),
				zhi: lunar.getDayZhi(),
				ganzhi: ganzhi,
				shishen: utils.GetShiShen(ganzhi)
			}
			day_list.push(params)
		}

		state.day_list = day_list;
		state.time_list = [];
		state.time_index = 0


		this.commit("yun/resolveLiuTime")
	},
	resolveLiuTime(state, data) {
		const {
			day_list,
			day_index,
		} = state;

		const {
			year,
			month,
			day
		} = day_list[day_index]

		const date = year + "-" + month + "-" + day + " 00:00:00"
		const start_time = new Date(date.replace(/-/g,'/').replace(/T/g, ' ')).getTime() - 60 * 60 * 1000

		const time_list = []
		for (let i = 0; i < 12; i++) {
			const _date = new Date(start_time + (i * 2 * 60 * 60 * 1000))
			const lunar = Lunar.fromDate(new Date(_date));
			const ganzhi = lunar.getTimeInGanZhi()
			const params = {
				gan: lunar.getTimeGan(),
				zhi: lunar.getTimeZhi(),
				ganzhi: ganzhi,
				time: lunar.getHour() + ":00",
				shishen: utils.GetShiShen(ganzhi)
			}
			time_list.push(params)
		}
		state.time_list = time_list

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
