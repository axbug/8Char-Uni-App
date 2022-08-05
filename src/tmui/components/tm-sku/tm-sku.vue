<template>
    <tm-drawer
        :round="props.round"
        ref="drawer"
        :height="dHeight"
        @update:show="_show = $event"
        :show="_show"
        @close="close"
        :ok-color="props.color"
        @open="open"
        :hide-header="true"
        :closable="true"
        :foot-height="footerBarHeight"
    >
        <template v-slot:default>
            <view class="pa-24">
                <view class="flex flex-row flex-row-center-start">
                    <tm-image :preview="true" v-if="nowItemInfo.img" :width="120" :height="120" :src="nowItemInfo.img"></tm-image>
                    <view class="pl-24">
                        <view class="flex flex-row flex-row-center-start">
                            <tm-text :font-size="24" :color="props.color" label="￥"></tm-text>
                            <tm-text :font-size="42"  _class="text-weight-b" :color="props.color" :label="nowItemInfo.price"></tm-text>
                            <tm-sheet linear="left" linear-deep="accent" :color="props.color" :margin="[24,0]" :padding="[18,4]" :round="24">
                                <view class="flex flex-row flex-row-center-start">
                                    <tm-text :font-size="24" label="优惠价￥"></tm-text>
                                    <tm-text :font-size="42" _class="text-weight-b" :label="nowItemInfo.yuanjia"></tm-text>
                                </view>
                            </tm-sheet>
                        </view>
                        <tm-text color="grey" :font-size="24" :label="!nowIsDisabled?'有货':'无货'"></tm-text>
                        <tm-text color="grey" :font-size="24" :label="props.skuMap.length===nowSelected.length?'已选择':'请选择'"></tm-text>
                    </view>
                </view>
                <tm-divider :margin="[0,24]"></tm-divider>
                <view class="mb-24 " >
                    <view @click="addNumberClick" class="flex flex-row flex-row-center-between mb-24">
                        <tm-text :font-size="32" label="购买数量"></tm-text>
                        <tm-stepper @change="numberChange" :max="nowItemInfo.max" :disabled="props.skuMap.length!==nowSelected.length" 
                        v-model="nowInputNumber"
                        :default-value="nowInputNumber"
                        ></tm-stepper>
                    </view>
					<tm-divider :margin="[0,0]"></tm-divider>
                </view>
                <view class="" v-for="(mapKey,index) in props.skuMap" :key="index">
                    <tm-text _class="mb-24" :font-size="32" :label="mapKey.value"></tm-text>
                    <view class="flex flex-row flex-row-center-start">
                        <tm-badge :count="item.disabled?'缺货':0" v-for="(item,index2) in _list[index]"  :key="index2">
                        <view :class="[item.disabled?'opacity-6':'','']" >
                            <tm-tag :shadow="0"
                            :color="item.checked&&!item.disabled?'primary':'grey'" 
                            @click="selectedItem(item,index)" 
                            :round="24" 
                            :font-size="26" 
                            size="n"
                            outlined
                            text :label="item.name"></tm-tag>
                        </view>
                    </tm-badge>
                    </view>
					<tm-divider :margin="[0,24]"></tm-divider>
                </view>
                
            </view>
            <slot></slot>
        </template>
        <template v-slot:foot>
            <view class="mb-20 px-24">
                <view style="height:40rpx" class="flex flex-row flex-row-center-center">
                    <tm-text v-if="nowItemInfo.tip" :color="props.color" :label="nowItemInfo.tip+'，'"></tm-text>
                    <tm-text v-if="nowItemInfo.max<nowInputNumber" :color="props.color" label="库存不足"></tm-text>
                </view>
                <view class="flex flex-row">
                    <view style="width:363rpx">
                        <tm-button @click="addGou" block  :is-disabled-round-andriod="true" _class="round-l-24 round-r-0"  
                        linear="left" linear-deep="accent" :color="props.color" :font-size="32"  label="加购物车" :height="80" ></tm-button>
                    </view>
                    <view style="width:363rpx">
                        <tm-button  @click="buyGou" block :disabled="nowIsDisabled||nowInputNumber==0||nowItemInfo.max<nowInputNumber" 
                         :is-disabled-round-andriod="true" _class="round-r-24 round-l-0"   
                        linear="left" linear-deep="accent" :color="props.color" :font-size="32"  
                        :label="nowIsDisabled?'缺货，提醒我':'购买'+(nowItemInfo.buyPrice?'￥'+nowItemInfo.buyPrice:'')" 
                        :height="80" ></tm-button>
                    </view>
                </view>
            </view>
            <view :style="{height:sysinfo.bottom+'px'}"></view>
        </template>
    </tm-drawer>
</template>
<script lang="ts" setup>
import {computed,ref,inject, PropType, toRaw,nextTick, watch} from "vue"
import tmDrawer from '../tm-drawer/tm-drawer.vue';
import tmButton from "../tm-button/tm-button.vue";
import tmText from "../tm-text/tm-text.vue";
import tmDivider from "../tm-divider/tm-divider.vue";
import tmTag from "../tm-tag/tm-tag.vue";
import tmSheet from "../tm-sheet/tm-sheet.vue";
import tmImage from "../tm-image/tm-image.vue";
import tmStepper from "../tm-stepper/tm-stepper.vue";
import tmIcon from "../tm-icon/tm-icon.vue";
import tmBadge from "../tm-badge/tm-badge.vue";
const emits  = defineEmits(["open","close","update:show","add","buy"])
const props = defineProps({
    round:{
        type:Number,
        default:6
    },
    show:{
        type:Boolean,
        default:false
    },
    color:{
        type:String,
        default:"red"
    },
    height:{
        type:Number,
        default:650
    },
	//需要显示的sku字段映射
	skuMap:{
		type:Array as PropType<Array<any>>,
		default:()=>{
			return [
				{key:'size',value:'尺码'},
				{key:'color',value:'颜色'},
			]
		}
	},
    //购物车数量
    num:{
        type:Number,
        default:1
    },
    list:{
        type:Array as PropType<Array<{
            /** 数据id，必须唯一 */
            id:string|number,
            /** 价格 */
            price:string|number,
            /** 最终销售价 */
            salePrice:string|number,
            /** 提示语 */
            tip:string,
            /** 商品图片。 */
            img:string,
            /**其它字段在回调中返回。 */
            [key:string]:any
        }>>,
        default:():any=>[]
    }
})
const sysinfo = inject(
  "tmuiSysInfo",
  computed(() => {
    return {
      bottom: 0,
      height: 750,
      width: uni.upx2px(750),
      top: 0,
      isCustomHeader: false,
      sysinfo: null,
    };
  })
);
const _show = ref(props.show)
const footerBarHeight = ref(160)
const dHeight = computed(()=>{
    return props.height+footerBarHeight.value+uni.$tm.u.torpx(sysinfo.value.bottom)
})
const nowSelectedItem:any = ref(null);
const nowSelected:any = ref([]);
const nowIsDisabled = ref(false)
const nowItemInfo = ref({
    price:"??",
    yuanjia:"??",
    tip:"",
    max:9999,
    buyPrice:0,
    img:''
})
const nowInputNumber = ref(props.num)
let textcm = toRaw(props.list)
//对对象字段进行分组。并进行路径合并形成唯一标识。
const _list = ref(mapAr())

function mapAr(){
	let sc = [];
	for(let i=0;i<props.skuMap.length;i++){
		let temp = [];
		let datas = []
		for(let j=0;j<textcm.length;j++){
			let tp = {}
			tp['data'] = [];
			let idsorder = textcm[j]['id']
			tp['name'] = textcm[j][props.skuMap[i].key]
			tp['checked'] = false;
			tp['disabled'] = false;
			tp['key'] = props.skuMap[i].key;
			tp['path'] = tp['name']+'--'+tp['key']+'--'+idsorder;
			for(let key in textcm[j]){
				if(key== props.skuMap[i].key){
					tp['label'] = props.skuMap[i].value ;
					tp['id'] = idsorder;
					let iscl = temp.find(el=>el.name==textcm[j][key])
					if(!iscl){
						datas = textcm.filter(el=>el[props.skuMap[i].key]==textcm[j][key])
						tp['data'] = datas
						temp.push(tp)
					}
				}
			}
		}
		sc.push(temp)
	}
    computedPrice()
	return sc
}
function computedPrice(){
    if(textcm?.length==0) return;
    let price = textcm.map(el=>el.price);
    let salePrice = textcm.map(el=>el.salePrice);
    let minp = Math.min(...price);
    let maxp = Math.max(...price);
    nowItemInfo.value.price = minp==maxp?String(minp):Math.min(...price)+"~"+Math.max(...price)
    nowItemInfo.value.yuanjia = String(Math.min(...salePrice))
    nowItemInfo.value.max =  9999
    nowItemInfo.value.buyPrice =  0
    nowItemInfo.value.img =  textcm[0]?.img??""

}
function selectedItem(item:any,mainIndex:number){
    if(item.disabled) return;
	nowSelectedItem.value = {
		key:item.key,
		label:item.label,
        path:item.path,
        value:item.name
	}
	//表示选择了同类型。
	let isscl = nowSelected.value.findIndex(el=>el.key==item.key)
	//是否唯一
	let isscl2 = nowSelected.value.findIndex(el=>el.path==item.path)
	if(isscl>-1){
		nowSelected.value.splice(isscl,1)
		if(isscl2==-1){
			nowSelected.value.push({...nowSelectedItem.value})
		}else{
            nowSelectedItem.value = nowSelected.value[nowSelected.value.length-1]
        }
	}else{
        nowSelected.value.push({...nowSelectedItem.value})
	}
    
    let nowitem = filterSelectedItem();
    
    nowIsDisabled.value = nowitem?(nowitem.num<=0?true:false):false;
    if(nowitem){
        nowItemInfo.value.price = String(nowitem.price)
        nowItemInfo.value.yuanjia = String(nowitem.salePrice)
        nowItemInfo.value.tip = String(nowitem.tip)
        nowItemInfo.value.max =  Number(nowitem.num)
        nowItemInfo.value.buyPrice =  (nowInputNumber.value * Number(nowitem.salePrice)).toFixed(2)
        nowItemInfo.value.img =  nowitem?.img??""
    }else{
        computedPrice()
    }
    isDisabledTag(mainIndex)
}

function isDisabledTag(mainIndex:number){
    _list.value = _list.value.map(el=>{
        el = el.map(ele=>{
            ele.checked = false;
            ele.disabled = false;
            return ele
        })
        return el;
    })
    if(nowSelected.value.length==0) return;
	_list.value = _list.value.map(el=>{
        el = el.map(ele=>{
            for(let i=0;i<nowSelected.value.length;i++){
                if(ele.path==nowSelected.value[i].path){
                    ele.checked = ele.path==nowSelected.value[i].path
                }
            }
            return ele
        })
        return el;
    })
    
    let d = uni.$tm.u.deepClone(toRaw(_list.value))

    for(let j=0;j<d.length;j++){
        if(j!=mainIndex){
            let items = d[j]
            for(let k=0;k<items.length;k++){
                let datas = items[k].data
                for(let kj=0;kj<datas.length;kj++){
                    let fsl = textcm.filter(el=>{
                        let p = false;
                        for(let ik = 0;ik<nowSelected.value.length;ik++){
                            p = el.num<=0&&el.id == datas[kj].id&&el[nowSelected.value[ik].key]==nowSelected.value[ik].value
                        }
                        return p;
                    })
                    if(fsl.length>0){
                        items[k].disabled = true;
                        
                    }
                }
                
            }
        }
    }
    
    _list.value = [...d]
}
function filterSelectedItem(){
    let nowitem = null;
    if(nowSelected.value.length==props.skuMap.length){
        let tssokrt = []
        //排序，
        for(let i=0;i<props.skuMap.length;i++){
            for(let j=0;j<nowSelected.value.length;j++){
                if(nowSelected.value[j].key==props.skuMap[i].key){
                    tssokrt.push(nowSelected.value[j])
                }
            }
        }
        
        let disd = textcm.filter(el=>{
            let str = ""
            let nowstr = ""
            for(let i=0;i<tssokrt.length;i++){
                str+=el[tssokrt[i].key]
                nowstr+=tssokrt[i].value
            }
            return str == nowstr
        })
        if(disd.length==1){
            nowIsDisabled.value = disd[0].num<=0?true:false;
        }
        nowitem = disd.length==1?disd[0]:null
    }
    return nowitem
}
watch(()=>props.num,()=>{
    nowInputNumber.value = props.num
})
watch(()=>props.list,()=>{
    textcm = uni.$tm.u.deepClone(toRaw(props.list))
    _list.value = mapAr()
},{deep:true})
watch(()=>props.show,()=>{
    _show.value = props.show;
})
//加入购物车触发。
function addGou(){
    if(nowSelected.value.length!==props.skuMap.length){
        uni.showToast({title:'未选择完整',icon:'none'})
        return;
    }
    emits('add',{
        buyNumber:nowInputNumber.value,
        data:filterSelectedItem()
    })
    nextTick(()=>{
        _show.value = false;
    })
}
//购买时触发。
function buyGou(){
    if(nowSelected.value.length!==props.skuMap.length){
        uni.showToast({title:'未选择完整',icon:'none'})
        return;
    }
    emits('buy',{
        buyNumber:nowInputNumber.value,
        data:filterSelectedItem()
    })
    nextTick(()=>{
        _show.value = false;
    })
}
function numberChange(num:number){
    let nowitem = filterSelectedItem();
    if(nowitem){
        nowItemInfo.value.price = String(nowitem.price)
        nowItemInfo.value.yuanjia = String(nowitem.salePrice)
        nowItemInfo.value.tip = String(nowitem.tip)
        nowItemInfo.value.max =  Number(nowitem.num)
        nowItemInfo.value.buyPrice =  (nowInputNumber.value * Number(nowitem.salePrice)).toFixed(2)
    }else{
        computedPrice()
    }
}
function addNumberClick(){
    if(nowSelected.value.length!==props.skuMap.length){
        uni.showToast({title:'未选择完整',icon:'none'})
        return;
    }
}

function close(){
    emits("close")
    emits("update:show",false)
}
function open(){
    emits('open')
    emits('update:show',true)
}


</script>
<style>
</style>