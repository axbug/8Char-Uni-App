import {CACHE_PREFIX} from "@/config";

export const getPrefixKey = key =>{
    return `${CACHE_PREFIX}-${key}`
}

export const getLocalStorage = key => {
    return uni.getStorageSync(getPrefixKey(key))
}

export const setLocalStorage = (key,value)=>{
    uni.setStorageSync(getPrefixKey(key), value)
}

export const deleteLocalStorage = key => {
    uni.removeStorageSync(getPrefixKey(key))
}

export const clearLocalStorage = () => {
    const { keys } = uni.getStorageInfoSync();
    for(let key of keys){
        if(key.indexOf(CACHE_PREFIX) === 0){
            uni.removeStorageSync(key)
        }
    }
}
