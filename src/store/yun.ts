import { defineStore } from 'pinia';
import { Solar, Lunar } from 'lunar-javascript';
import utils from '@/tool/utils.ts';

export const useYunStore = defineStore('yun', {
	state: () => {
		return {
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
			time_index: 0
		};
	},
	actions: {
		pull(original) {
			this.original = original;
			this.current_index = 0;
			this.year_index = 0;
			this.month_index = 0;
			this.day_index = 0;
			this.time_index = 0;
			this.dayun_list = [];
			this.year_list = [];
			this.month_list = [];
			this.day_list = [];
			this.time_list = [];
			this.resolveDaYun();
		},
		// 大运
		resolveDaYun() {
			const original = this.original;
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

			this.dayun_list = dayun_list;
			this.year_index = 0;
			this.month_index = 0;
			this.day_index = 0;
			this.time_index = 0;
			this.year_list = [];
			this.month_list = [];
			this.day_list = [];
			this.time_list = [];
			this.resolveLiuYear();
		},
		// 小运（流年）
		resolveLiuYear() {
			const original = this.original;
			const current_index = this.current_index;

			const dayun = original[current_index];
			const xiaoyun = dayun.getXiaoYun();
			const year = dayun.getLiuNian();
			const year_list = [];

			for (let i = 0; i < year.length; i++) {
				const item = year[i];
				const ganzhi = item.getGanZhi();
				year_list.push({
					year: item.getYear(),
					ganzhi: ganzhi,
					age: item.getAge(),
					shishen: utils.GetShiShen(ganzhi)
				});
			}

			this.year_list = year_list;
			this.month_index = 0;
			this.day_index = 0;
			this.time_index = 0;
			this.month_list = [];
			this.day_list = [];
			this.time_list = [];

			this.resolveLiuMonth();
		},
		resolveLiuMonth() {
			const original = this.original;
			const current_index = this.current_index;
			const year_index = this.year_index;

			const dayun = original[current_index];
			const year = dayun.getLiuNian();

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

			this.month_list = month_list;
			this.day_index = 0;
			this.time_index = 0;
			this.day_list = [];
			this.time_list = [];

			// this.resolveLiuDay()
		},
		resolveLiuDay() {
			const year_list = this.year_list;
			const year_index = this.year_index;
			const month_list = this.month_list;
			const month_index = this.month_index;

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

			this.day_list = day_list;
			this.time_index = 0;
			this.time_list = [];

			// this.resolveLiuTime()
		},
		resolveLiuTime() {
			const day_list = this.day_list;
			const day_index = this.day_index;

			if (day_list.length == 0) return;
			const { date: _date } = day_list[day_index];

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

			this.time_list = time_list;
		}
	}
});
