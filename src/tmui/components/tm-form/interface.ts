export interface formItem {
    label:string,//标签名称。
    field:string,//字段名称key.
    value:any,
    isRequiredError:boolean,//true,错误，false正常 检验状态
    message:string,//检验信息提示语。
    id:number,//表单唯一标识id
    componentsName:string,//表单组件类型。
}