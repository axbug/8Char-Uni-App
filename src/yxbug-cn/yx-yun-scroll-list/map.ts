import { YunMapType, YunItemMapType } from './interface.ts';

export const yun_map_list: YunMapType[] = [
	{
		title: '大运',
		list: 'dayun_list',
		index: 'current_index'
	},
	{
		title: '小运',
		list: 'year_list',
		index: 'year_index'
	},
	{
		title: '流月',
		list: 'month_list',
		index: 'month_index'
	},
	{
		title: '流日',
		list: 'day_list',
		index: 'day_index'
	},
	{
		title: '流时',
		list: 'time_list',
		index: 'time_index'
	}
];

export const yun_item_map_list: YunItemMapType[] = [
	{
		list: ['start_year', 'ganzhi', 'start_age', 'shishen'],
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

export const store_index_list: string[] = ['current_index', 'year_index', 'month_index', 'day_index', 'time_index'];
export const store_methods_list: string[] = ['resolveLiuYear', 'resolveLiuMonth', 'resolveLiuDay', 'resolveLiuTime'];
