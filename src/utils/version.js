import {GetVersion} from "@/api/default";
import {API_VERSION, APP_VERSION, CACHE_CLEAR_CYCLE, GIT_URL} from "@/config";
import {clearLocalStorage, getLocalStorage, setLocalStorage} from "@/utils/cache";

function compareVersion(currentVersion, onlineVersion) {
    const current = currentVersion.split('.').map(Number);
    const online = onlineVersion.split('.').map(Number);
    for (let i = 0; i < current.length; i++) {
        if (current[i] < online[i]) {
            return i + 1;
        }
    }
    return 0;
}

export const checkVersion = () => {
    try {
        let cacheKey = "version";
        const current = getLocalStorage(cacheKey);
        if(current){
            // 简单粗暴只为判断当前缓存是否适用于当前版本
            if(current !== APP_VERSION){
                clearLocalStorage()
            }
        }

        cacheKey = "last-time";
        const time = getLocalStorage(cacheKey);
        if(!time || (new Date().getTime() - CACHE_CLEAR_CYCLE) > time){
            clearLocalStorage()
            setLocalStorage(cacheKey,new Date().getTime())
            GetVersion().then(res=>{
                const duration = 5000;
                const versions = [
                    {current:APP_VERSION,online:res.app,title:"APP"},
                    {current:API_VERSION,online:res.api,title:"API"},
                ]
                const methods = [
                    (title,version)=>{
                        console.log(`当前${title}已是最新版，版本号：${version}`);
                    },
                    (title,current,online)=>{
                        // 大幅度更新 存在影响（跳转到Git仓库）
                        methods[2](title,current,online)
                        // #ifdef H5
                        window.open(GIT_URL);
                        // #endif
                    },
                    (title,current,online)=>{
                        // 中幅度更新 可能存在影响（弹出提示）
                        uni.$u.toast(`当前${title}不是最新版，建议到Git仓库进行更新，当前版本号版本号：${current},最新版本号：${online}`,duration);
                    },
                    (title,current,online)=>{
                        // 小幅度更新 影响甚微
                        console.log(`当前${title}不是最新版，建议到Git仓库进行更新，当前版本号版本号：${current},最新版本号：${online}`);
                        console.log("GIT仓库地址：" + GIT_URL);
                    },
                ]
                for(let item of versions){
                    methods[compareVersion(item.current,item.online)](item.title,item.current,item.online)
                }
            })

        }

        setLocalStorage(cacheKey,APP_VERSION)
    } catch (e) {
        // error
    }
}
