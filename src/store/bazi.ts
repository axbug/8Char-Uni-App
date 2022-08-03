import { defineStore } from 'pinia';
import { useYunStore } from './yun.ts';
import { Solar } from 'lunar-javascript';
import utils from '@/tool/utils.ts';

export const useBaziStore = defineStore('bazi', {
	state: () => {
		return {
			yun: null,
			yinli: null,
			yangli: null,
			xinzuo: null,
			// 四柱
			sizhu: {
				year: null,
				month: null,
				day: null,
				time: null
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
				time: null
			},
			// 地支
			dizhi: {
				year: null,
				month: null,
				day: null,
				time: null
			},
			// 五行
			wuxing: {
				year: null,
				month: null,
				day: null,
				time: null
			},
			// 纳音
			nayin: {
				year: null,
				month: null,
				day: null,
				time: null
			},
			// 地势
			dishi: {
				year: null,
				month: null,
				day: null,
				time: null
			},
			// 藏干
			canggan: {
				year: null,
				month: null,
				day: null,
				time: null
			},
			// 主星
			zhuxing: {
				year: null,
				month: null,
				day: null,
				time: null
			},
			// 副星
			fuxing: {
				year: null,
				month: null,
				day: null,
				time: null
			},
			start_yun: {
				year: null,
				month: null,
				day: null,
				hour: null,
				solar: null
			},
			table: []
		};
	},
	actions: {
		pull(data) {
			const { timestamp, gender } = data;

			const solar = Solar.fromDate(new Date(timestamp));
			const lunar = solar.getLunar();
			const bazi = lunar.getEightChar();
			const yun = bazi.getYun(gender);
			this.yun = yun;

			this.yinli = lunar.getYear() + '年' + lunar.getMonthInChinese() + '月' + lunar.getDayInChinese() + '  ' + bazi.getTimeZhi() + '时';
			this.yangli = solar.toYmdHms().replace(/-/g, '/');

			this.xinzuo = solar.getXingzuo();

			this.lunar = {
				year: lunar.getYear(),
				month: lunar.getMonth(),
				day: lunar.getDay(),
				time: lunar.getHour() + ':' + lunar.getMinute(),
				hour: lunar.getHour(),
				minute: lunar.getMinute(),

				_year: lunar.getYearInChinese(),
				_month: lunar.getMonthInChinese(),
				_day: lunar.getDayInChinese(),
				_time: lunar.getTimeGan()
			};

			this.solar = {
				year: solar.getYear(),
				month: solar.getMonth(),
				day: solar.getDay(),
				time: solar.getHour() + ':' + solar.getMinute()
			};

			this.sizhu = {
				year: bazi.getYear(),
				month: bazi.getMonth(),
				day: bazi.getDay(),
				time: bazi.getTime()
			};

			this.tiangan = {
				year: bazi.getYearGan(),
				month: bazi.getMonthGan(),
				day: bazi.getDayGan(),
				time: bazi.getTimeGan()
			};

			this.dizhi = {
				year: bazi.getYearZhi(),
				month: bazi.getMonthZhi(),
				day: bazi.getDayZhi(),
				time: bazi.getTimeZhi()
			};

			this.wuxing = {
				year: bazi.getYearWuXing(),
				month: bazi.getMonthWuXing(),
				day: bazi.getDayWuXing(),
				time: bazi.getTimeWuXing()
			};

			this.nayin = {
				year: bazi.getYearNaYin(),
				month: bazi.getMonthNaYin(),
				day: bazi.getDayNaYin(),
				time: bazi.getTimeNaYin()
			};

			this.dishi = {
				year: bazi.getYearDiShi(),
				month: bazi.getMonthDiShi(),
				day: bazi.getDayDiShi(),
				time: bazi.getTimeDiShi()
			};

			this.canggan = {
				year: bazi.getYearHideGan(),
				month: bazi.getMonthHideGan(),
				day: bazi.getDayHideGan(),
				time: bazi.getTimeHideGan()
			};

			this.zhuxing = {
				year: bazi.getYearShiShenGan(),
				month: bazi.getMonthShiShenGan(),
				day: bazi.getDayShiShenGan(),
				time: bazi.getTimeShiShenGan()
			};

			this.fuxing = {
				year: bazi.getYearShiShenZhi(),
				month: bazi.getMonthShiShenZhi(),
				day: bazi.getDayShiShenZhi(),
				time: bazi.getTimeShiShenZhi()
			};

			this.start_yun = {
				year: yun.getStartYear(),
				month: yun.getStartMonth(),
				day: yun.getStartDay(),
				hour: yun.getStartHour(),
				solar: yun.getStartSolar().toYmd()
			};

			const table = [];

			table.push({
				data: {
					name: '主星',
					year: this.zhuxing.year,
					month: this.zhuxing.month,
					day: gender == 1 ? '元男' : '元女',
					time: this.zhuxing.time
				}
			});

			table.push({
				data: {
					name: '天干',
					year: this.tiangan.year,
					month: this.tiangan.month,
					day: this.tiangan.day,
					time: this.tiangan.time
				}
			});

			table.push({
				data: {
					name: '地支',
					year: this.dizhi.year,
					month: this.dizhi.month,
					day: this.dizhi.day,
					time: this.dizhi.time
				}
			});

			table.push({
				data: {
					name: '五行',
					year: this.wuxing.year,
					month: this.wuxing.month,
					day: this.wuxing.day,
					time: this.wuxing.time
				}
			});

			table.push({
				data: {
					name: '藏干',
					year: utils.DeArray(this.canggan.year, 'canggan'),
					month: utils.DeArray(this.canggan.month, 'canggan'),
					day: utils.DeArray(this.canggan.day, 'canggan'),
					time: utils.DeArray(this.canggan.time, 'canggan')
				}
			});

			table.push({
				data: {
					name: '副星',
					year: utils.DeArray(this.fuxing.year),
					month: utils.DeArray(this.fuxing.month),
					day: utils.DeArray(this.fuxing.day),
					time: utils.DeArray(this.fuxing.time)
				}
			});

			table.push({
				data: {
					name: '星运',
					year: this.dishi.year,
					month: this.dishi.month,
					day: this.dishi.day,
					time: this.dishi.time
				}
			});

			table.push({
				data: {
					name: '纳音',
					year: this.nayin.year,
					month: this.nayin.month,
					day: this.nayin.day,
					time: this.nayin.time
				}
			});

			this.table = table;

			useYunStore().pull(yun.getDaYun());
		}
	}
});
