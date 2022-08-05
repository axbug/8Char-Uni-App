import { showDetail, timeDetailType, timeArrayType } from "./interface"
import * as dayjs from "../../tool/dayjs/esm/index"
import isSameOrBefore from '../../tool/dayjs/esm/plugin/isSameOrBefore/index';
import isSameOrAfter from '../../tool/dayjs/esm/plugin/isSameOrAfter/index';
import isBetween from '../../tool/dayjs/esm/plugin/isBetween/index';
type dateType = 'year' | 'month' | 'date' | 'hour' | 'minute' | 'second'
const DayJs = dayjs.default;
DayJs.extend(isBetween)
DayJs.extend(isSameOrBefore)
DayJs.extend(isSameOrAfter)
function rangeNumber(from = 0, to = 0) {
	let range: Array<number> = []
	from = from >= 0 ? from : 1
	for (let i = from; i <= to; i++) {
		range.push(i)
	}
	return range
}

/** 根据显示的时间字段返回相关的时间列的可选选项. */
export function rangeTimeArray(dateStr: string | number | Date, start: string | number | Date, end: string | number | Date, detail: showDetail) {
	let startDayjs = DayJs(start);
	let endDayjs = DayJs(end);
	let dateDayjs = DayJs(dateStr);
	// 计算每一列表数组开始和结束的数字.
	let dateArray = {
		year: [] as Array<number>,
		month: [] as Array<number>,
		date: [] as Array<number>,
		hour: [] as Array<number>,
		minute: [] as Array<number>,
		second: [] as Array<number>,
	};
	// 计算年
	// dateArray.push()
	// 计算月,这里要判断如果大于开始的时候,月就从开始计算,如果小于结束,就以结束计算,如果是在之间就从0开始.
	//后面的月,天,时,分秒,都是同一道理.

	function getar(timeType: dateType) {

		let temp: Array<number> = []
		if (timeType == 'year') {
			temp = rangeNumber(startDayjs.get("year"), endDayjs.get("year"));
		} else if (timeType == 'month') {
			setd(timeDetailType.month, timeDetailType.year)
		} else if (timeType == 'date') {
			setd(timeDetailType.day, timeDetailType.month)
		} else if (timeType == 'hour') {
			setd(timeDetailType.hour, timeDetailType.day)
		} else if (timeType == 'minute') {
			setd(timeDetailType.minute, timeDetailType.hour)
		} else if (timeType == 'second') {
			setd(timeDetailType.second, timeDetailType.minute)
		}

		function setd(type: timeDetailType, timeType: timeDetailType) {
			let start = 0
			let end = 0
			let nowtm = dateDayjs
			if (dateDayjs.isSameOrBefore(startDayjs, timeType)) {
				nowtm = startDayjs
				start = startDayjs.get(type)
				end = startDayjs.endOf(timeType).get(type)
				if (nowtm.isSame(endDayjs, timeType)) {
					end = endDayjs.get(type)
				}
			} else if (dateDayjs.isSameOrAfter(endDayjs, timeType)) {
				nowtm = endDayjs
				start = endDayjs.startOf(timeType).get(type)
				end = endDayjs.get(type)
				if (nowtm.isSame(startDayjs, timeType)) {
					start = startDayjs.get(type)
				}
			} else {
				start = dateDayjs.startOf(timeType).get(type)
				end = dateDayjs.endOf(timeType).get(type)
			}
			temp = rangeNumber(start, end)

		}
		dateArray[timeType] = temp;

	}
	let key: any = ""
	for (key in detail) {
		if (key == "day") {
			key = "date"
		}
		getar(key)
	}
	return dateArray;
}

/**
 * 根据现有时间取得当前的索引位置顺序
 * @param tmArray
 * @param nowtime
 * @param detail
 */
export function getIndexNowbydate(tmArray: timeArrayType, nowtime: dayjs.Dayjs, detail: showDetail) {
	const d = DayJs(nowtime)
	const intermediate = [
		[timeDetailType.year, detail.year],
		[timeDetailType.month, detail.month],
		[timeDetailType.day, detail.day],
		[timeDetailType.hour, detail.hour],
		[timeDetailType.minute, detail.minute],
		[timeDetailType.second, detail.second]
	];

	const idx = intermediate.filter(m => m[1]).map(m => {
		const type = m[0] as timeDetailType;
		const index = tmArray[type].findIndex(n => n === d.get(type))
		return index === -1 ? 0 : index;
	});

	return [
		...idx,
		...[0, 0, 0, 0, 0, 0]
	].slice(0, 6);
}
/**
 * 根据现有索引值返回当前时间。
 * @param tmArray
 * @param nowtime
 * @param detail
 */
export function getNowbyIndex(tmArray: timeArrayType, nowIndex: Array<number>, detail: showDetail) {
	const intermediate = [
		[timeDetailType.year, detail.year],
		[timeDetailType.month, detail.month],
		[timeDetailType.day, detail.day],
		[timeDetailType.hour, detail.hour],
		[timeDetailType.minute, detail.minute],
		[timeDetailType.second, detail.second]
	];
	function getValue(type: timeDetailType) {
		const index = intermediate.filter(m => m[1]).findIndex(m => m[0] === type);
		if (index !== -1) {
			return tmArray[type][nowIndex[index]];
		}
		return tmArray[type][tmArray[type].length - 1];
	}

	let year = getValue(timeDetailType.year);
	let month = getValue(timeDetailType.month);
	let date = getValue(timeDetailType.day);
	let hour = getValue(timeDetailType.hour);
	let minute = getValue(timeDetailType.minute);
	let second = getValue(timeDetailType.second);

	let str = year
		+ "/" +
		(month + 1)
		+ "/" + date
		+ " " +
		hour
		+ ":" +
		minute
		+ ":" +
		second
	return DayJs(str).format("YYYY/MM/DD HH:mm:ss")
}
/**
 * 检查提供的时候是否是有效的时间段内，并返回正确的可用时间.
 * @param nowdate 
 * @param start 
 * @param end 
 */
export function checkNowDateisBetween(nowdate: string | number | Date | dayjs.Dayjs, start: string | number | Date | dayjs.Dayjs, end: string | number | Date | dayjs.Dayjs) {

	nowdate = DayJs(nowdate).isValid() ? DayJs(nowdate) : DayJs()
	start = DayJs(start)
	end = DayJs(end)
	if (nowdate.isSameOrBefore(start)) {
		return start.format("YYYY/MM/DD HH:mm:ss")
	}
	if (nowdate.isSameOrAfter(end)) {
		return end.format("YYYY/MM/DD HH:mm:ss")
	}
	return nowdate.format("YYYY/MM/DD HH:mm:ss")
}

