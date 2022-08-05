import { YunMapType, YunItemMapType } from './interface';

export const yunMapList: YunMapType[] = [
	{
		title: '大运',
		list: 'dayunList',
		index: 'currentIndex'
	},
	{
		title: '小运',
		list: 'yearList',
		index: 'yearIndex'
	},
	{
		title: '流月',
		list: 'monthList',
		index: 'monthIndex'
	},
	{
		title: '流日',
		list: 'dayList',
		index: 'dayIndex'
	},
	{
		title: '流时',
		list: 'timeList',
		index: 'timeIndex'
	}
];

export const yunItemMapList: YunItemMapType[] = [
	{
		list: ['startYear', 'ganzhi', 'startAge', 'shishen'],
		suffix: ['', '', '岁', '']
	},
	{
		list: ['year', 'ganzhi', 'age', 'shishen'],
		suffix: ['', '', '岁', '']
	},
	{
		list: ['jieqi', 'date', 'ganzhi', 'shishen'],
		suffix: ['', '', '', '']
	},
	{
		list: ['nongli', 'ganzhi', 'shishen'],
		suffix: ['', '', '']
	},
	{
		list: ['time', 'ganzhi', 'shishen'],
		suffix: ['', '', '']
	}
];

export const storeIndexList: string[] = ['currentIndex', 'yearIndex', 'monthIndex', 'dayIndex', 'timeIndex'];
export const storeMethodsList: string[] = ['resolveLiuYear', 'resolveLiuMonth', 'resolveLiuDay', 'resolveLiuTime'];
