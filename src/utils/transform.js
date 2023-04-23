import {LunarUtil} from "lunar-javascript";
import {useDetailStore} from "@/store/detail";
import {SHI_SHEN_SIMPLIFIE, SHI_SHEN_ZHI} from "@/config/offset";
import {ELEMENT} from "@/config/map";

const store = useDetailStore()

export const getElAttr = (label ,type = "type") =>{
    let el = "水";
    if(LunarUtil.GAN.includes(label)){
        el = LunarUtil.WU_XING_GAN[label]
    }else if(LunarUtil.ZHI.includes(label)){
        el = LunarUtil.WU_XING_ZHI[label]
    }else if(ELEMENT.labels.includes(label)){
        el = label;
    }

    const getElIndex = el => {
        return ELEMENT.labels.indexOf(el)
    }

    const describeForNameMap = {
        label:el => {
            return el
        },
        color:el => {
            const index = getElIndex(el)
            return ELEMENT.colors[index]
        },
        type:el => {
            const index = getElIndex(el)
            return ELEMENT.types[index]
        },
        index:el => {
            return getElIndex(el)
        }
    }

    return describeForNameMap[type] ? describeForNameMap[type](el) : el;
}

export const timeFormat = (time,format = "yyyy-mm-dd hh:MM",compat = false) => {
    const datetime = uni.$u.timeFormat(time, format)
    if(compat) return datetime.replace(/-/g, '/')
    return datetime
}

export const getRelationByPillar = label => {
    let top;
    let bottom;
    if (label === '童限') {
        top = store.top.year;
        bottom = store.top.year;
    } else {
        top = label[0];
        bottom = label[1];
    }

    return SHI_SHEN_SIMPLIFIE[getRelation(top)] + SHI_SHEN_SIMPLIFIE[getRelation(bottom)];
}

export const getRelation = label => {
    const top = store.dayGan;
    if(LunarUtil.GAN.includes(label)){
        return LunarUtil.SHI_SHEN_GAN[top+label];
    }else if(LunarUtil.ZHI.includes(label)){
        return SHI_SHEN_ZHI[top+label]
    }else{
        return "";
    }
}

export const deleteFirstElement = list => {
    const newArr = list.slice();
    newArr.shift();
    return newArr;
}

export function firstStringToUpperCase(str) {
    return str[0].toUpperCase() + str.substr(1);
}
