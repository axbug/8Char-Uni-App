import { Post, APP_API } from '@/tool/request';
import {useBookStore} from "@/store/book";

const bookStore = useBookStore();

export const GetDetail = data => Post('/8char/get-detail', data, APP_API);
export const GetBook = data => {
    return new Promise((resolve, reject) => {
        Post('/8char/get-book', data, APP_API).then(res=>{
            bookStore.books = res.books;
            bookStore.chenggu = res.chenggu;
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}
