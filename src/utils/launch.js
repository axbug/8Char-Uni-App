import {checkVersion} from "@/utils/version";
import {setTipsToStore} from "@/utils/tips";

export const init = () => {
    checkVersion()
    setTipsToStore()
}
