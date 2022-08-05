import { defineStore } from 'pinia';
import { Solar, Lunar } from 'lunar-javascript';
import { GetShiShen } from '@/tool/utils';

export const useYunStore = defineStore('yun', {
	state: () => {
		return {
			// 列表
			original: [],
			dayunList: [],
			yearList: [],
			monthList: [],
			dayList: [],
			timeList: [],
			// 索引
			currentIndex: 0,
			yearIndex: 0,
			monthIndex: 0,
			dayIndex: 0,
			timeIndex: 0
		};
	},
	actions: {
		pull(original: any) {
			this.original = original;
			this.currentIndex = 0;
			this.yearIndex = 0;
			this.monthIndex = 0;
			this.dayIndex = 0;
			this.timeIndex = 0;
			this.dayunList = [];
			this.yearList = [];
			this.monthList = [];
			this.dayList = [];
			this.timeList = [];
			this.resolveDaYun();
		},
		// 大运
		resolveDaYun() {
			const original = this.original;
			const dayunList = [];

			for (let i = 0; i < original.length; i++) {
				const item = original[i];
				const ganzhi = item.getGanZhi() || '童限';
				dayunList.push({
					startYear: item.getStartYear(),
					startAge: item.getStartAge(),
					ganzhi: ganzhi,
					shishen: ganzhi == '童限' ? '童限' : GetShiShen(ganzhi)
				});
			}

			this.dayunList = dayunList;
			this.yearIndex = 0;
			this.monthIndex = 0;
			this.dayIndex = 0;
			this.timeIndex = 0;
			this.yearList = [];
			this.monthList = [];
			this.dayList = [];
			this.timeList = [];
			this.resolveLiuYear();
		},
		// 小运（流年）
		resolveLiuYear() {
			const original = this.original;
			const currentIndex = this.currentIndex;

			const dayun = original[currentIndex];
			const year = dayun.getLiuNian();
			const yearList = [];

			for (let i = 0; i < year.length; i++) {
				const item = year[i];
				const ganzhi = item.getGanZhi();
				yearList.push({
					year: item.getYear(),
					ganzhi: ganzhi,
					age: item.getAge(),
					shishen: GetShiShen(ganzhi)
				});
			}

			this.yearList = yearList;
			this.monthIndex = 0;
			this.dayIndex = 0;
			this.timeIndex = 0;
			this.monthList = [];
			this.dayList = [];
			this.timeList = [];

			this.resolveLiuMonth();
		},
		resolveLiuMonth() {
			const original = this.original;
			const currentIndex = this.currentIndex;
			const yearIndex = this.yearIndex;

			const dayun = original[currentIndex];
			const year = dayun.getLiuNian();

			if (year.length == 0) return;

			const month = year[yearIndex].getLiuYue();

			const monthList = [];
			const jieqi = year[yearIndex].getLunar().getJieQiTable();
			const map = ['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', 'XIAO_HAN'];

			for (let i = 0; i < month.length; i++) {
				const item = month[i];
				const _jieqi = jieqi[map[i]];
				const ganzhi = item.getGanZhi();
				const _nextJieqi = i == 11 ? jieqi[map[0]] : jieqi[map[i + 1]];
				monthList.push({
					original: _jieqi,
					year: year[yearIndex].getYear(),
					jieqi: i == 11 ? '小寒' : map[i],
					nextJieqiDate: Math.abs(_nextJieqi.getMonth()) + '/' + _nextJieqi.getDay(),
					date: Math.abs(_jieqi.getMonth()) + '/' + _jieqi.getDay(),
					ganzhi: ganzhi,
					shishen: GetShiShen(ganzhi)
					// month: item.getMonthInChinese()
				});
			}

			this.monthList = monthList;
			this.dayIndex = 0;
			this.timeIndex = 0;
			this.dayList = [];
			this.timeList = [];

			// this.resolveLiuDay()
		},
		resolveLiuDay() {
			const yearList = this.yearList;
			const yearIndex = this.yearIndex;
			const monthList = this.monthList;
			const monthIndex = this.monthIndex;

			const year = yearList[yearIndex].year;
			const date = monthList[monthIndex].date;

			const _year = monthIndex < 10 ? year : year + 1;
			const currentDate = (monthIndex < 11 ? year : year + 1) + '/' + date;
			const nextDate = _year + '/' + monthList[monthIndex].nextJieqiDate;
			const dayList = [];

			let _date_ = new Date(currentDate);
			let _nextDate = new Date(nextDate);

			while (_date_ < _nextDate) {
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
					shishen: GetShiShen(ganzhi)
				};
				dayList.push(params);
			}

			this.dayList = dayList;
			this.timeIndex = 0;
			this.timeList = [];

			// this.resolveLiuTime()
		},
		resolveLiuTime() {
			const dayList = this.dayList;
			const dayIndex = this.dayIndex;

			if (dayList.length == 0) return;
			const { date: _date } = dayList[dayIndex];

			const date = _date + ' 00:00:00';
			const startTime = new Date(date.replace(/-/g, '/').replace(/T/g, ' ')).getTime() - 60 * 60 * 1000;

			const timeList = [];
			for (let i = 0; i < 12; i++) {
				const _date = new Date(startTime + i * 2 * 60 * 60 * 1000);
				const lunar = Lunar.fromDate(new Date(_date));
				const ganzhi = lunar.getTimeInGanZhi();
				const params = {
					gan: lunar.getTimeGan(),
					zhi: lunar.getTimeZhi(),
					ganzhi: ganzhi,
					time: lunar.getHour() + ':00',
					shishen: GetShiShen(ganzhi)
				};
				timeList.push(params);
			}

			this.timeList = timeList;
		}
	}
});
