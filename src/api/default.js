import { Post,Get, APP_API } from '@/utils/request';
import {useBookStore} from "@/store/book";

export const GetTips = () => Get('/8char/get-tips',{},APP_API)
export const GetVersion = () => Get('/8char/get-version',{},APP_API)
export const GetInfo = data => Post('/8char/get-info', data, APP_API);
export const GetBook = data => {
    return new Promise((resolve, reject) => {
        Post('/8char/get-book', data, APP_API).then(res=>{
            const bookStore = useBookStore();
            bookStore.books = res.books;
            bookStore.weigh_bone = res.weigh_bone;
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}
export const GetPrediction = data => Post('/8char/get-prediction', data, APP_API);
