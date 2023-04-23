import {defineStore} from 'pinia';
import {Lunar, LunarUtil, Solar} from 'lunar-javascript';
import {deleteFirstElement, getRelationByPillar, timeFormat} from "@/utils/transform";
import {TEND_STORE_FIELD} from "@/config/map";

export const useTendStore = defineStore('tend', {
    state: () => {
        return {
            service:{
                lunar:null,
                solar:null,
                bazi:null,
            },
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
    getters:{
        rowNum(state){
            const liuKeyList = TEND_STORE_FIELD.map(item => item.list)
            let num = 4;
            for (let key of liuKeyList) {
                if (state[key].length) {
                    num++;
                }else{
                    break;
                }
            }
            return num;
        },
        currentLunar(state){
            let time;
            let accurate;
            if (state.timeList.length) {
                time = state.dayList[state.dayIndex].date;
                time = time + " " + state.timeList[state.timeIndex].time;
                accurate = "time";
            } else if (state.dayList.length) {
                time = state.dayList[state.dayIndex].date + " 23:30";
                accurate = "day";
            } else if (state.monthList.length) {
                const _detail = state.monthList[state.monthIndex];
                time = `${_detail.year}/${_detail.date} 23:30`;
                accurate = "month";
            } else {
                const _detail = state.dayunList[state.currentIndex];
                time = `${_detail.startYear}/01/01 23:30`;
                accurate = "year";
            }
            return {
                accurate:accurate,
                lunar:Solar.fromDate(new Date(time)).getLunar(),
            }
        },
        currentDate(state){
            const {accurate,lunar} = state.currentLunar
            if(["day","time"].includes(accurate)){
                const solar = lunar.getSolar();
                const date = timeFormat(solar.toYmdHms(),"yyyy年mm月dd日")
                let label = `已选日期：${date} 星期${solar.getWeekInChinese()}`
                if(accurate === "time") label += ` ${lunar.getTimeZhi()}时 `;
                label += `（阴历${lunar.getYear()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}日）`
                return label;
            }

            return null;
        }
    },
    actions: {
        pull({ timestamp, gender, sect }) {
            const solar = Solar.fromDate(new Date(timestamp));
            const lunar = solar.getLunar();
            const bazi = lunar.getEightChar();
            const yun = bazi.getYun(gender, sect);
            this.service = {
                lunar:lunar,
                solar:solar,
                bazi:bazi,
            }
            this.resolveYun(yun.getDaYun())
        },
        resolveYun(original){
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

            for (let item of original) {
                const pillar = item.getGanZhi() || '童限';
                dayunList.push({
                    startYear: item.getStartYear(),
                    startAge: item.getStartAge(),
                    pillar: pillar,
                    shishen: pillar === '童限' ? '童限' : getRelationByPillar(pillar)
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

            for (let item of year) {
                const pillar = item.getGanZhi();
                yearList.push({
                    year: item.getYear(),
                    pillar: pillar,
                    age: item.getAge(),
                    shishen: getRelationByPillar(pillar)
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

            if (year.length === 0) return;

            const month = year[yearIndex].getLiuYue();

            const monthList = [];
            const jieqi = year[yearIndex].getLunar().getJieQiTable();
            const map = ['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', 'XIAO_HAN'];

            for (let i = 0; i < month.length; i++) {
                const item = month[i];
                const _jieqi = jieqi[map[i]];
                const pillar = item.getGanZhi();
                const _nextJieqi = i === 11 ? jieqi[map[0]] : jieqi[map[i + 1]];
                monthList.push({
                    original: _jieqi,
                    year: year[yearIndex].getYear(),
                    jieqi: i === 11 ? '小寒' : map[i],
                    nextJieqiDate: Math.abs(_nextJieqi.getMonth()) + '/' + _nextJieqi.getDay(),
                    date: Math.abs(_jieqi.getMonth()) + '/' + _jieqi.getDay(),
                    pillar: pillar,
                    shishen: getRelationByPillar(pillar)
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
                const pillar = lunar.getDayInGanZhi();
                const params = {
                    date: solar.toYmd().replace(/-/g, '/'),
                    nongli: lunar.getDayInChinese(),
                    top: lunar.getDayGan(),
                    bottom: lunar.getDayZhi(),
                    pillar: pillar,
                    shishen: getRelationByPillar(pillar)
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

            if (dayList.length === 0) return;
            const { date: _date } = dayList[dayIndex];

            const date = _date + ' 00:00:00';
            const startTime = new Date(date).getTime() - 60 * 60 * 1000;

            const timeList = [];
            for (let i = 0; i < 12; i++) {
                const _date = new Date(startTime + i * 2 * 60 * 60 * 1000);
                const lunar = Lunar.fromDate(new Date(_date));
                const pillar = lunar.getTimeInGanZhi();
                const params = {
                    top: lunar.getTimeGan(),
                    bottom: lunar.getTimeZhi(),
                    pillar: pillar,
                    time: lunar.getHour() + ':00',
                    shishen: getRelationByPillar(pillar)
                };
                timeList.push(params);
            }

            this.timeList = timeList;
        },
        SkipCurrentTime(){
            const { original } = this;
            const currenYear = new Date().getFullYear()
            const currenTimestmap = new Date().getTime()
            for (let i = 0; i < this.original.length; i++) {
                const minYear = original[i].getStartYear()
                const maxYear = original[i].getEndYear()
                if (currenYear >= minYear && currenYear <= maxYear) {
                    const yearList = original[i].getLiuNian()
                    this.currentIndex = i
                    this.resolveDaYun()
                    for (let j = 0; j < yearList.length; j++) {
                        if (yearList[j].getYear() === currenYear) {
                            this.yearIndex = j
                            this.resolveLiuYear()
                            const monthList = this.monthList
                            for (let k = 0; k < monthList.length; k++) {
                                const year = monthList[k].year
                                const _year = k < 10 ? year : year + 1;
                                const _date = (k < 11 ? year : year + 1) + '/' + monthList[i].date;
                                const nextDate = _year + '/' + monthList[i].nextJieqiDate;
                                const _timestmap = new Date(_date).getTime()
                                const nextTimestmap = new Date(nextDate).getTime()
                                if (_timestmap <= currenTimestmap && nextTimestmap > currenTimestmap) {
                                    this.monthIndex = k
                                    this.resolveLiuDay()
                                    const dayList = this.dayList
                                    const currenDate = Solar.fromDate(new Date()).toYmd().replace(/-/g, '/')
                                    for (let l = 0; l < dayList.length; l++) {
                                        if (currenDate === dayList[i].date) {
                                            this.dayIndex = l
                                            this.resolveLiuTime()
                                            const solar = Solar.fromDate(new Date())
                                            const timeBottom = solar.getLunar().getTimeZhi()
                                            this.timeIndex = deleteFirstElement(LunarUtil.ZHI).indexOf(timeBottom)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});
