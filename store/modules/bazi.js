import {
	Solar
} from 'lunar-javascript';

import utils from '@/utils/init.js'

const state = {
	timestamp: null,
	yun: null,
	// 四柱
	sizhu: {
		year: null,
		month: null,
		day: null,
		time: null,
	},
	// 阳历
	solar: {
		year: null,
		month: null,
		day: null,
		time: null
	},
	// 天干
	tiangan: {
		year: null,
		month: null,
		day: null,
		time: null,
	},
	// 地支
	dizhi: {
		year: null,
		month: null,
		day: null,
		time: null,
	},
	// 五行
	wuxing: {
		year: null,
		month: null,
		day: null,
		time: null,
	},
	// 纳音
	nayin: {
		year: null,
		month: null,
		day: null,
		time: null,
	},
	// 地势
	dishi: {
		year: null,
		month: null,
		day: null,
		time: null,
	},
	// 藏干
	canggan: {
		year: null,
		month: null,
		day: null,
		time: null,
	},
	// 主星
	zhuxing: {
		year: null,
		month: null,
		day: null,
		time: null,
	},
	// 副星
	fuxing: {
		year: null,
		month: null,
		day: null,
		time: null,
	},
	start_yun: {
		year: null,
		month: null,
		day: null,
		hour: null,
		solar: null,
	},
	table: []
}

const getters = {
	GetStartYunLabel(state) {
		let str = '出生后';
		const {
			start_yun
		} = state
		if (start_yun.year) {
			str += start_yun.year + '年';
		}

		if (start_yun.month) {
			str += start_yun.month + '月';
		}

		if (start_yun.day) {
			str += start_yun.day + '日';
		}

		if (start_yun.hour) {
			str += start_yun.hour + '时';
		}

		str += '后起运';
		return str;
	}
}

const mutations = {
	set(state, data) {
		for (let key in data) {
			state[key] = data[key];
		}
	},
	pull(state, data) {
		const {
			timestamp,
			gender
		} = data

		state.timestamp = timestamp

		const solar = Solar.fromDate(new Date(timestamp));
		const lunar = solar.getLunar();
		const bazi = lunar.getEightChar();
		const yun = bazi.getYun(gender);
		state.yun = yun


		state.yinli = lunar.getYear() + '年' + lunar.getMonthInChinese() + '月' + lunar.getDayInChinese() + '  ' +
			bazi.getTimeZhi() + '时'
		state.yangli = uni.$u.timeFormat(timestamp, 'yyyy年mm月dd日 hh:MM:ss')

		state.xinzuo = solar.getXingzuo()

		state.lunar = {
			year: lunar.getYear(),
			month: lunar.getMonth(),
			day: lunar.getDay(),
			time: lunar.getHour() + ":" + lunar.getMinute(),
			hour: lunar.getHour(),
			minute: lunar.getMinute(),

			_year: lunar.getYearInChinese(),
			_month: lunar.getMonthInChinese(),
			_day: lunar.getDayInChinese(),
			_time: lunar.getTimeGan()
		}

		state.solar = {
			year: solar.getYear(),
			month: solar.getMonth(),
			day: solar.getDay(),
			time: solar.getHour() + ":" + solar.getMinute(),
		}

		state.sizhu = {
			year: bazi.getYear(),
			month: bazi.getMonth(),
			day: bazi.getDay(),
			time: bazi.getTime()
		}

		state.tiangan = {
			year: bazi.getYearGan(),
			month: bazi.getMonthGan(),
			day: bazi.getDayGan(),
			time: bazi.getTimeGan()
		}

		state.dizhi = {
			year: bazi.getYearZhi(),
			month: bazi.getMonthZhi(),
			day: bazi.getDayZhi(),
			time: bazi.getTimeZhi()
		}

		state.wuxing = {
			year: bazi.getYearWuXing(),
			month: bazi.getMonthWuXing(),
			day: bazi.getDayWuXing(),
			time: bazi.getTimeWuXing()
		}

		state.nayin = {
			year: bazi.getYearNaYin(),
			month: bazi.getMonthNaYin(),
			day: bazi.getDayNaYin(),
			time: bazi.getTimeNaYin()
		}

		state.dishi = {
			year: bazi.getYearDiShi(),
			month: bazi.getMonthDiShi(),
			day: bazi.getDayDiShi(),
			time: bazi.getTimeDiShi()
		}

		state.canggan = {
			year: bazi.getYearHideGan(),
			month: bazi.getMonthHideGan(),
			day: bazi.getDayHideGan(),
			time: bazi.getTimeHideGan()
		}

		state.zhuxing = {
			year: bazi.getYearShiShenGan(),
			month: bazi.getMonthShiShenGan(),
			day: bazi.getDayShiShenGan(),
			time: bazi.getTimeShiShenGan()
		}

		state.fuxing = {
			year: bazi.getYearShiShenZhi(),
			month: bazi.getMonthShiShenZhi(),
			day: bazi.getDayShiShenZhi(),
			time: bazi.getTimeShiShenZhi()
		}

		state.start_yun = {
			year: yun.getStartYear(),
			month: yun.getStartMonth(),
			day: yun.getStartDay(),
			hour: yun.getStartHour(),
			solar: yun.getStartSolar().toYmd()
		}

		const table = [];


		table.push({
			type: "zhuxing",
			list: ['主星', state.zhuxing.year, state.zhuxing.month, gender == 1 ? '元男' : '元女', state.zhuxing.time
			]
		});

		table.push({
			type: "tiangan",
			list: ['天干', state.tiangan.year, state.tiangan.month, state.tiangan.day, state.tiangan.time]
		});

		table.push({
			type: "dizhi",
			list: ['地支', state.dizhi.year, state.dizhi.month, state.dizhi.day, state.dizhi.time]
		});

		table.push({
			type: "wuxing",
			list: ['五行', state.wuxing.year, state.wuxing.month, state.wuxing.day, state.wuxing.time]
		});

		table.push({
			type: "canggan",
			list: [
				'藏干',
				utils.DeArray(state.canggan.year,"canggan"),
				utils.DeArray(state.canggan.month,"canggan"),
				utils.DeArray(state.canggan.day,"canggan"),
				utils.DeArray(state.canggan.time,"canggan")
			]
		});

		table.push({
			type: "cangxing",
			list: [
				'副星',
				utils.DeArray(state.fuxing.year),
				utils.DeArray(state.fuxing.month),
				utils.DeArray(state.fuxing.day),
				utils.DeArray(state.fuxing.time)
			]
		});

		table.push({
			type: "xingyun",
			list: ['星运', state.dishi.year, state.dishi.month, state.dishi.day, state.dishi.time]
		});

		table.push({
			type: "nayin",
			list: ['纳音', state.nayin.year, state.nayin.month, state.nayin.day, state.nayin.time]
		});

		state.table = table

		this.commit("yun/pull", {
			original: yun.getDaYun()
		})
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
