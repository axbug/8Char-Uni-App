export interface showDetail {
    year:boolean,
    month:boolean,
    day:boolean,
    hour:boolean,
    minute:boolean,
    second:boolean,
}
export enum timeDetailType {
    year="year",
    month="month",
    day="date",
    hour="hour",
    minute="minute",
    second="second",
}
export interface coltimeData {
    type:timeDetailType,//数据格式类型，如上 timeDetailType
    data:Array<number>
}