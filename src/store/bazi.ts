import { defineStore } from 'pinia';
import { useYunStore } from './yun';
import { Solar, LunarUtil } from 'lunar-javascript';
import { ComputedWuXing, DeArray, TianGanToShiShen } from '@/tool/utils';
import { wuxingLabelList } from '@/config/data/wuxing.ts';
import { wangshuai as wuxingWangshuai, colorList as wuxingColorList } from '@/config/data/wuxing';

function ComputedCangganColor(list: string[]): string[] {
	const colors: string[] = [];
	for (let item of list) {
		const index = wuxingLabelList.indexOf(DeArray(item, 'canggan').substr(1, 1));
		colors.push(wuxingColorList[index]);
	}
	return colors;
}

export const useBaziStore = defineStore('bazi', {
	state: () => {
		return {
			yun: null,
			yinli: null,
			yangli: null,
			xinzuo: null,
			chineseZodiac: null,
			sect: 1,
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
			// 纳音
			nayin: {
				year: null,
				month: null,
				day: null,
				time: null
			},
			// 胎
			tai: [],
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
			// 空亡
			kongwang: {
				year: null,
				month: null,
				day: null,
				time: null
			},
			// 藏干颜色
			cangganColor: {
				year: [],
				month: [],
				day: [],
				time: []
			},
			// 起运
			startYun: {
				year: null,
				month: null,
				day: null,
				hour: null,
				solar: null
			},
			// 五行能量
			wuxingNum: {
				include: {
					list: [],
					total: 0
				},
				ninclude: {
					list: [],
					total: 0
				},
				title: [],
				wangshuai: []
			},
			// 节气
			jieqi: {}
		};
	},
	actions: {
		pull(data) {
			const { timestamp, gender } = data;

			const solar = Solar.fromDate(new Date(timestamp));
			const lunar = solar.getLunar();

			var bazi = lunar.getEightChar();
			bazi.setSect(data.sect);

			const yun = bazi.getYun(gender, data.sect);
			this.sect = data.sect;
			this.yun = yun;
			this.chineseZodiac = lunar.getYearShengXiao();

			this.yinli = lunar.getYear() + '年' + lunar.getMonthInChinese() + '月' + lunar.getDayInChinese() + '  ' + bazi.getTimeZhi() + '时';
			this.yangli = solar.toYmdHms().replace(/-/g, '/');

			this.xinzuo = solar.getXingzuo();

			this.lunar = {
				year: lunar.getYear(),
				month: Math.abs(lunar.getMonth()),
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

			this.nayin = {
				year: bazi.getYearNaYin(),
				month: bazi.getMonthNaYin(),
				day: bazi.getDayNaYin(),
				time: bazi.getTimeNaYin()
			};

			const taixi = (() => {
				var ganIndex = 2 == data.sect ? lunar.getDayGanIndexExact2() : lunar.getDayGanIndexExact();
				var zhiIndex = 2 == data.sect ? lunar.getDayZhiIndexExact2() : lunar.getDayZhiIndexExact();
				return LunarUtil.HE_GAN_5[ganIndex] + LunarUtil.HE_ZHI_6[zhiIndex];
			})();
			this.tai = [
				[bazi.getTaiYuan(), bazi.getTaiYuanNaYin()],
				[taixi, LunarUtil.NAYIN[taixi]],
				[bazi.getMingGong(), bazi.getMingGongNaYin()],
				[bazi.getShenGong(), bazi.getShenGongNaYin()]
			];

			this.dishi = {
				year: bazi.getYearDiShi(),
				month: bazi.getMonthDiShi(),
				day: bazi.getDayDiShi(),
				time: bazi.getTimeDiShi()
			};

			this.canggan = {
				year: DeArray(bazi.getYearHideGan(), 'canggan', true),
				month: DeArray(bazi.getMonthHideGan(), 'canggan', true),
				day: DeArray(bazi.getDayHideGan(), 'canggan', true),
				time: DeArray(bazi.getTimeHideGan(), 'canggan', true)
			};

			this.cangganColor = {
				year: ComputedCangganColor(bazi.getYearHideGan()),
				month: ComputedCangganColor(bazi.getMonthHideGan()),
				day: ComputedCangganColor(bazi.getDayHideGan()),
				time: ComputedCangganColor(bazi.getTimeHideGan())
			};

			this.zhuxing = {
				year: bazi.getYearShiShenGan(),
				month: bazi.getMonthShiShenGan(),
				// day: bazi.getDayShiShenGan(),
				day: gender == 1 ? '元男' : '元女',
				time: bazi.getTimeShiShenGan()
			};

			this.fuxing = {
				year: bazi.getYearShiShenZhi(),
				month: bazi.getMonthShiShenZhi(),
				day: bazi.getDayShiShenZhi(),
				time: bazi.getTimeShiShenZhi()
			};

			this.kongwang = {
				year: bazi.getYearXunKong(),
				month: bazi.getMonthXunKong(),
				day: bazi.getDayXunKong(),
				time: bazi.getTimeXunKong()
			};

			this.startYun = {
				year: yun.getStartYear(),
				month: yun.getStartMonth(),
				day: yun.getStartDay(),
				hour: yun.getStartHour(),
				solar: yun.getStartSolar().toYmd()
			};

			let wangshuai = [];
			for (let zhis in wuxingWangshuai) {
				let ws = wuxingWangshuai[zhis];
				if (zhis.indexOf(bazi.getMonthZhi()) != -1) {
					wangshuai = ws;
					break;
				}
			}

			this.wuxingNum = {
				include: ComputedWuXing(bazi, 'all'),
				ninclude: ComputedWuXing(bazi),
				title: TianGanToShiShen(bazi.getDayWuXing().substr(0, 1)),
				wangshuai: wangshuai
			};

			const prevJieQi = lunar.getPrevJie();
			const preJieQiSolar = prevJieQi.getSolar();
			const nextJieQi = lunar.getNextJie();
			const nextJieQiSolar = nextJieQi.getSolar();
			this.jieqi = {
				preName: prevJieQi.getName(),
				preTime: preJieQiSolar.toYmdHms().replace(/-/g, '/'),
				nextName: nextJieQi.getName(),
				nextTime: nextJieQiSolar.toYmdHms().replace(/-/g, '/'),
			};

			useYunStore().pull(yun.getDaYun());
		}
	}
});
