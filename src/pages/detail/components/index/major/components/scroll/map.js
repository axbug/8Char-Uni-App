import {TEND_STORE_FIELD} from "@/config/map";

export const tendItemMapList = [
    {
        list: ['startYear', 'pillar', 'startAge', 'shishen'],
        suffix: ['', '', '岁', '']
    },
    {
        list: ['year', 'pillar', 'age', 'shishen'],
        suffix: ['', '', '岁', '']
    },
    {
        list: ['jieqi', 'date', 'pillar', 'shishen'],
        suffix: new Array(4).fill('')
    },
    {
        list: ['nongli', 'pillar', 'shishen'],
        suffix: new Array(3).fill('')
    },
    {
        list: ['time', 'pillar', 'shishen'],
        suffix: new Array(3).fill('')
    }
];

export const storeIndexList = TEND_STORE_FIELD.map(item => item.index)
export const storeMethodsList = ['resolveLiuYear', 'resolveLiuMonth', 'resolveLiuDay', 'resolveLiuTime'];
