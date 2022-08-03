import {
	Lunar,
	Solar
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

		state.original = original;
		state.current_index = 0;
		state.year_index = 0;
		state.month_index = 0;
		state.day_index = 0;
		state.time_index = 0;
		state.dayun_list = [];
		state.year_list = [];
		state.month_list = [];
		state.day_list = [];
		state.time_list = [];
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
			const ganzhi = item.getGanZhi() || '小运';
			dayun_list.push({
				start_year: item.getStartYear(),
				start_age: item.getStartAge(),
				ganzhi: ganzhi,
				shishen: ganzhi == '小运' ? '小运' : utils.GetShiShen(ganzhi)
			});
		}

		state.dayun_list = dayun_list;
		state.year_index = 0;
		state.month_index = 0;
		state.day_index = 0;
		state.time_index = 0;
		state.year_list = [];
		state.month_list = [];
		state.day_list = [];
		state.time_list = [];

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
		state.month_index = 0;
		state.day_index = 0;
		state.time_index = 0;
		state.month_list = [];
		state.day_list = [];
		state.time_list = [];

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
		if (year.length === 0) {
			// uni.$u.toast("获取流年数据失败！");
			return;
		}
		const month = year[year_index].getLiuYue();

		const month_list = [];
		const jieqi = year[year_index].getLunar().getJieQiTable();
		const map = ['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', 'XIAO_HAN'];

		for (let i = 0; i < month.length; i++) {
			const item = month[i];
			const _jieqi = jieqi[map[i]];
			const ganzhi = item.getGanZhi();
			const _next_jieqi = i == 11 ? jieqi[map[0]] : jieqi[map[i + 1]];
			month_list.push({
				original: _jieqi,
				year: year[year_index].getYear(),
				jieqi: i == 11 ? '小寒' : map[i],
				next_jieqi_date: _next_jieqi.getMonth() + '/' + _next_jieqi.getDay(),
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

		// this.commit("yun/resolveLiuDay")
	},
	resolveLiuDay(state, data) {
		const {
			year_list,
			year_index,
			month_list,
			month_index,
		} = state;

		const year = year_list[year_index].year;
		const date = month_list[month_index].date;

		const _year = month_index < 10 ? year : year + 1;
		const current_date = year + '/' + date;
		const next_date = _year + '/' + month_list[month_index].next_jieqi_date;
		const day_list = [];

		let _date_ = new Date(current_date);
		let _next_date = new Date(next_date);

		while (_date_ <= _next_date) {
			const solar = Solar.fromDate(new Date(_date_));
			_date_ = new Date(
				solar
				.next(1)
				.toYmd()
				.replace(/-/g, '/')
			);
			const lunar = solar.getLunar();
			const ganzhi = lunar.getDayInGanZhi();
			const params = {
				date: solar.toYmd().replace(/-/g, '/'),
				nongli: lunar.getDayInChinese(),
				gan: lunar.getDayGan(),
				zhi: lunar.getDayZhi(),
				ganzhi: ganzhi,
				shishen: utils.GetShiShen(ganzhi)
			};
			day_list.push(params);
		}

		state.day_list = day_list;
		state.time_list = [];
		state.time_index = 0

		// this.commit("yun/resolveLiuTime")
	},
	resolveLiuTime(state, data) {
		const {
			day_list,
			day_index,
		} = state;

		if (day_list.length == 0) return;

		const {
			year,
			month,
			day
		} = day_list[day_index]

		const {
			date: _date
		} = day_list[day_index];

		const date = _date + ' 00:00:00';
		const start_time = new Date(date.replace(/-/g, '/').replace(/T/g, ' ')).getTime() - 60 * 60 * 1000;

		const time_list = [];
		for (let i = 0; i < 12; i++) {
			const _date = new Date(start_time + i * 2 * 60 * 60 * 1000);
			const lunar = Lunar.fromDate(new Date(_date));
			const ganzhi = lunar.getTimeInGanZhi();
			const params = {
				gan: lunar.getTimeGan(),
				zhi: lunar.getTimeZhi(),
				ganzhi: ganzhi,
				time: lunar.getHour() + ':00',
				shishen: utils.GetShiShen(ganzhi)
			};
			time_list.push(params);
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
