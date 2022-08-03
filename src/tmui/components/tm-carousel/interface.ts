export interface listItem {
	url?:string,
	type?:listItemType,
	img?:string //视频封面图片。
}
export type listItemTypeStr = "url"|"type"|"img"
export enum listItemType {
	img="img",
	video="video"
}