import {useTipsStore} from "@/store/tips";
import {getLocalStorage, setLocalStorage} from "@/utils/cache";
import {GetTips} from "@/api/default";

export const setTipsToStore = async () => {
    const cacheKey = "tips-data";
    const store = useTipsStore();
    let data = getLocalStorage(cacheKey);
    if(uni.$u.test.isEmpty(data)){
        data = await GetTips();
    }
    store.set(data);
    setLocalStorage(cacheKey,data)
}
