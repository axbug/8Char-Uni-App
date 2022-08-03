<template>
    <view class="fixed zIndex-12 flex" :style="[
        BtnPos == 'tl' ? { transform: `translateX(${_offset[0]}rpx) translateY(${_offset[1]}rpx)` } : '',
        BtnPos == 'tr' ? { transform: `translateX(-${_offset[0]}rpx) translateY(${_offset[1]}rpx)`, right: '0px' } : '',
        BtnPos == 'tc' ? { transform: `translateX(${centerPosLeft}px) translateY(${_offset[1]}rpx)` } : '',
        BtnPos == 'bl' ? { transform: `translateX(${_offset[0]}rpx) translateY(-${_offset[1]}rpx)`, bottom: '0px' } : '',
        BtnPos == 'br' ? { transform: `translateX(-${_offset[0]}rpx) translateY(-${_offset[1]}rpx)`, right: '0px', bottom: '0px' } : '',
        BtnPos == 'bc' ? { transform: `translateX(${centerPosLeft}px) translateY(-${_offset[1]}rpx)`, bottom: '0px' } : '',
        !isH5&&(BtnPos == 'tl'||BtnPos == 'tc'||BtnPos == 'tr')?{top:'0px'}:'',
        parent_style
    ]">
        <!-- 主按钮 -->
        <view :style="[{width:(props.width)+'rpx',height:(props.height)+'rpx'}]" class="flex-center">
            <tm-sheet :transprent="true" :padding="[0,0]" :margin="[0,0]" :color="_btn.color">
                <slot>
					<tm-button :followTheme="props.followTheme" @click="onclick" _class="flex flex-col flex-col-center-center" :shadow="3"
					:linear="_btn.linear" :linear-deep="_btn.linearDeep" :color="_btn.color" :margin="[0, 0]" 
					:round="16" :padding="[0, 0]" :width="props.width-12" :height="props.height-12">
					        <tm-icon :userInteractionEnabled="false" :follow-dark="false" :color="_btn.fontColor" :name="_btn.icon" :font-size="_btn.iconSize"></tm-icon>
					        <tm-text :userInteractionEnabled="false" :follow-dark="false" :color="_btn.fontColor" v-if="_btn.label" :label="_btn.label" :font-size="_btn.fontSize"></tm-text>
						</tm-button>
				</slot>
            </tm-sheet>
        </view>
        <!-- 子菜单 -->
        <view :userInteractionEnabled="showActions" v-if="_actionsItem.length>0&&showActions" class="absolute flex " :style="[AcionPos_xy]">
            <view :style="[{width:(props.width)+'rpx',height:(props.height)+'rpx'}]" class="flex-center">
                <tm-sheet
				:followTheme="props.followTheme"
                 @click="change(index,item)" v-for="(item,index) in _actionsItem" 
                 :key="index" 
                _class="flex flex-col flex-col-center-center" :round="16" 
                :shadow="2" 
                :linear="item.linear" 
                :linear-deep="item.linearDeep" 
                :color="item.color" :margin="[0, 0]" :padding="[0, 0]" :width="props.width-12" :height="props.height-12">
                    <tm-icon :userInteractionEnabled="false" :color="item.fontColor" :name="item.icon" :font-size="item.iconSize"></tm-icon>
                    <tm-text :userInteractionEnabled="false" :color="item.fontColor" v-if="item.label" :label="item.label" :font-size="item.fontSize"></tm-text>
                </tm-sheet>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
/**
 * 悬浮按钮
 * @description 总共6个位置，每个位置有四方向的子按钮展开位置，一共24个位置可控制。具体看文档。
 * @example <tm-floatButton :btn="{icon:'tmicon-plus',linear:'top'}"></tm-floatButton>
 * @method click 主按钮被点击，(e:Event)
 * @method change  子按钮被点击， (index:number,item:actionsItem)
 */
import { computed, PropType , ref } from "vue";
import { positionType, popDir ,actionsItem } from "./interface";
import tmSheet from "../tm-sheet/tm-sheet.vue";
import tmIcon from "../tm-icon/tm-icon.vue";
import tmText from "../tm-text/tm-text.vue";
import tmButton from "../tm-button/tm-button.vue";
/**
 * 事件说明
 * click：主按钮被点击，
 * change :子按钮被点击，
 */
const emits = defineEmits(["click","change"])
const props = defineProps({
	followTheme:{
		type:[Boolean,String],
		default:true
	},
    //主按钮的位置
    position: {
        type: String as PropType<positionType>,
        default: 'br',
        validator: (val: string) => {
            let isv = ['bc', 'bl', 'br', 'tc', 'tl', 'tr'].includes(val);
            if (!isv) {
                console.error("位置参数为:'bc','bl','br','tc','tl','tr'其中的一项")
            }
            return isv;
        }
    },
    //子菜单弹出的位置
    actionsPos: {
        type: String as PropType<popDir>,
        default: 'top',
        validator: (val: string) => {
            let isv = ['left', 'right', 'top', 'bottom'].includes(val);
            if (!isv) {
                console.error("位置参数为:'left','right','top','bottom'其中的一项")
            }
            return isv;
        }
    },
    width: {
        type: Number,
        default: 112
    },
    height: {
        type: Number,
        default: 112
    },
    offset: {
        type: Array as PropType<Array<number>>,
        default: () => [32, 32]
    },
    //子按钮组数据
    actions: {
        type: Array as PropType<Array<actionsItem>>,
        default: () => []
    },
    // 主按钮对象数据
    btn: {
        type: Object as PropType<actionsItem>,
        default: () => {},
        required:true
    },
    //是否默认显示子菜单
    showActions:{
        type:Boolean,
        default:false
    },
    //点击子菜单后，是否需要隐藏，如果为false,点击子按钮后不会隐藏按钮。始终保持展开子按钮。
    clickHidnActions:{
        type:Boolean,
        default:true
    }
})

let { windowTop, windowWidth } = uni.getSystemInfoSync()
windowTop = windowTop || 0;
const isH5 = ref(false)
// #ifdef H5
isH5.value=true;
// #endif
const showActions = ref(props.showActions??false)
const BtnPos = computed(() => props.position)
const AcionPos = computed(() => props.actionsPos)
const _offset = computed(() => {
    let ost = props.offset ?? [0, 0];
    // #ifdef APP-NVUE
    ost = [uni.upx2px(props.offset[0]),uni.upx2px(props.offset[1])]
    // #endif
    return ost;
})
const centerPosLeft = computed(() => {
    let ps = (windowWidth - uni.upx2px(props.width*1.5)) / 2 + uni.upx2px(_offset.value[0])
    // #ifndef APP-NVUE
    ps = (windowWidth - uni.upx2px(props.width*2)) / 2 + uni.upx2px(_offset.value[0])
    // #endif
    return ps
})
const _btn = computed(()=>{
    return {icon:'tmicon-plus',fontSize:20,color:'primary',linear:'',linearDeep:'accent',label:'',iconSize:42,fontColor:'',...props.btn??{}}
})
const _actionsItem = computed(()=>{
    let asbtn = props.actions.map(el=>{
        let default_btn:actionsItem = {icon:'tmicon-plus',fontSize:20,color:'primary',linear:'',linearDeep:'accent',label:'',fontColor:'',iconSize:36};
        return {...default_btn,...el}
    })
    return asbtn;
})
const AcionPos_xy = computed(() => {
    if ((BtnPos.value == 'tl'||BtnPos.value == 'tr'||BtnPos.value == 'tc'||BtnPos.value == 'bc') && AcionPos.value == "bottom") {
        return { top: `${props.height}rpx`, height: (props.actions.length) * props.height + 'rpx', dispaly: 'flex', 'flex-direction': 'column' }
    }
    if ((BtnPos.value == 'bl'||BtnPos.value == 'br') && AcionPos.value == "bottom") {
        return { top: `${props.height}rpx`,height: (props.actions.length) * props.height + 'rpx', dispaly: 'flex', 'flex-direction': 'column' }
    }
    if ((BtnPos.value == 'bl'||BtnPos.value == 'br') && AcionPos.value == "top") {
        return {top: `0px`, dispaly: 'flex', 'flex-direction': 'column-reverse' }
    }
    if ((BtnPos.value == 'tl'||BtnPos.value == 'tr'||BtnPos.value == 'tc'||BtnPos.value == 'bc') && AcionPos.value == "top") {
        return { top: `-0rpx`, height: (props.actions.length) * props.height + 'rpx', dispaly: 'flex', 'flex-direction': 'column' }
    }
    if ((BtnPos.value == 'tl'||BtnPos.value == 'tc'||BtnPos.value == 'bl'||BtnPos.value == 'br'||BtnPos.value == 'bc') && AcionPos.value == "right") {
        return { left: `${props.height}rpx`, width: (props.actions.length) * props.height + 'rpx', dispaly: 'flex', 'flex-direction': 'row' }
    }
    if ((BtnPos.value == 'tl'||BtnPos.value == 'tr'||BtnPos.value == 'tc'||BtnPos.value == 'bl'||BtnPos.value == 'br'||BtnPos.value == 'bc') && AcionPos.value == "left") {
        return { right: `${props.height}rpx`, width: (props.actions.length) * props.height + 'rpx', dispaly: 'flex', 'flex-direction': 'row-reverse' }
    }
    if ((BtnPos.value == 'tr') && AcionPos.value == "right") {
        return { right: `${0}rpx`, width: (props.actions.length) * props.height + 'rpx', dispaly: 'flex', 'flex-direction': 'row' }
    }
    
})
const parent_style = computed(() => {
    let height_width = showActions.value?(props.actions.length + 1) * props.height : props.height;
    //原生应用，如果控制高度再显示子按钮， 会有闪烁。因此不需要控制。
    // #ifdef APP-PLUS-NVUE
    height_width = (props.actions.length + 1) * props.height;
    // #endif

    if ((BtnPos.value == 'tl'||BtnPos.value == 'tr'||BtnPos.value == 'tc') && AcionPos.value == "bottom") {
        
        return { height: height_width + 'rpx' }
    }
    if ((BtnPos.value == 'tl')  && AcionPos.value == "top") {
        let top = -((props.actions.length) * props.height - _offset.value[1])
        // #ifdef APP-NVUE
        top = -props.height +  _offset.value[1]
        // #endif
        return {
            height: height_width + 'rpx',
            transform: `translateX(${_offset.value[0]}rpx) translateY(${top}rpx)`,
            'flex-direction': 'column-reverse'
        }
    }
    
    if ((BtnPos.value == 'tl'||BtnPos.value == 'tc') && AcionPos.value == "right") {
        return { width: height_width + 'rpx' }
    }
    if ((BtnPos.value == 'tl') && AcionPos.value == "left") {
       let left = -((props.actions.length) * props.height - _offset.value[0])
        // #ifdef APP-NVUE
        left = -props.height +  _offset.value[0]
        // #endif
        return {
            width: height_width + 'rpx',
            transform: `translateX(${left}rpx) translateY(${_offset.value[1]}rpx)`,
            'flex-direction': 'row-reverse'
        }
    }
    if (BtnPos.value == 'tr' && AcionPos.value == "left") {
       let left = -((props.actions.length) * props.height - _offset.value[0])
        // #ifdef APP-NVUE
        left = -props.height +  _offset.value[0]
        // #endif
        return {
            width: height_width + 'rpx','flex-direction': 'row-reverse'
        }
    }
    if ((BtnPos.value == 'tr')  && AcionPos.value == "top") {
        let top = -((props.actions.length) * props.height - _offset.value[1])
        // #ifdef APP-NVUE
        // top = -props.height +  _offset.value[1]
        // #endif
        return {
            height: height_width + 'rpx',
            transform: `translateX(-${_offset.value[0]}rpx) translateY(${top}rpx)`,
            'flex-direction': 'column-reverse'
        }
    }
    if ((BtnPos.value == 'tr' ) && AcionPos.value == "right") {
        let right = ((props.actions.length) * props.height - _offset.value[0])
        // #ifdef APP-NVUE
        // right = props.height -  _offset.value[0]
        // #endif
      return {
            width: height_width + 'rpx',
            transform: `translateX(${right}rpx) translateY(${_offset.value[1]}rpx)`
        }
    }
    if ((BtnPos.value == 'tc') && AcionPos.value == "left") {
       let left = centerPosLeft.value - uni.upx2px((props.actions.length) * props.height ) - uni.upx2px(_offset.value[0])
        return {
            width: height_width + 'rpx',
            transform: `translateX(${left}px) translateY(${_offset.value[1]}rpx)`,
            'flex-direction': 'row-reverse'
        }
    }
    if ((BtnPos.value == 'tc')  && AcionPos.value == "top") {
        let left = centerPosLeft.value + uni.upx2px(_offset.value[0])
         let top = -((props.actions.length) * props.height - _offset.value[1])
        // #ifdef APP-NVUE
        // top = -props.height +  _offset.value[1]
        // #endif
        return {
            height: height_width + 'rpx',
            transform: `translateX(${left}px) translateY(${top}rpx)`,
            'flex-direction': 'column-reverse'
        }
    }
    if ((BtnPos.value == 'bl')  && AcionPos.value == "bottom") {
        let top = ((props.actions.length) * props.height - _offset.value[1])
        // #ifdef APP-NVUE
        top = props.height -  _offset.value[1]
        // #endif
        return {
            height: height_width + 'rpx',
            transform: `translateX(${_offset.value[0]}rpx) translateY(${top}rpx)`,
        }
    }
    if ((BtnPos.value == 'bl')  && AcionPos.value == "top") {
        let top = - _offset.value[1]
        return {
            height: height_width + 'rpx',
            transform: `translateX(${_offset.value[0]}rpx) translateY(${top}rpx)`,
            'flex-direction': 'column-reverse'
        }
    }
    if (BtnPos.value == 'bl' && AcionPos.value == "right") {
        return {
            width: height_width + 'rpx'
        }
    }
    if ((BtnPos.value == 'bl') && AcionPos.value == "left") {
       let left = -((props.actions.length) * props.height - _offset.value[0])
        // #ifdef APP-NVUE
        left = -props.height +  _offset.value[0]
        // #endif
        return {
            width: height_width + 'rpx',
            transform: `translateX(${left}rpx) translateY(${-_offset.value[1]}rpx)`,
            'flex-direction': 'row-reverse'
        }
    }
    if ((BtnPos.value == 'br')  && AcionPos.value == "bottom") {
        let top = ((props.actions.length) * props.height - _offset.value[1])
        // #ifdef APP-NVUE
        top = props.height -  _offset.value[1]
        // #endif
        return {
            height: height_width + 'rpx',
            transform: `translateX(${-_offset.value[0]}rpx) translateY(${top}rpx)`,
        }
    }
    if ((BtnPos.value == 'br')  && AcionPos.value == "top") {
        let top =  -_offset.value[1]
        return {
            height: height_width + 'rpx',
            transform: `translateX(${-_offset.value[0]}rpx) translateY(${top}rpx)`,
            'flex-direction': 'column-reverse'
        }
    }
    if (BtnPos.value == 'br' && AcionPos.value == "right") {
        let right = ((props.actions.length) * props.height - _offset.value[0])
        // #ifdef APP-NVUE
        right = props.height -  _offset.value[0]
        // #endif
      return {
            width: height_width + 'rpx',
            transform: `translateX(${right}rpx) translateY(${-_offset.value[1]}rpx)`
        }
    }
    if ((BtnPos.value == 'br') && AcionPos.value == "left") {
        let left = -_offset.value[0]
        return {
            width: height_width + 'rpx',
            transform: `translateX(${left}rpx) translateY(${-_offset.value[1]}rpx)`,
            'flex-direction': 'row-reverse'
        }
    }
    if ((BtnPos.value == 'bc') && AcionPos.value == "left") {
       let left = centerPosLeft.value - uni.upx2px((props.actions.length) * props.height ) - uni.upx2px(_offset.value[0])
        return {
            width: height_width + 'rpx',
            transform: `translateX(${left}px) translateY(${-_offset.value[1]}rpx)`,
            'flex-direction': 'row-reverse'
        }
    }
    if ((BtnPos.value == 'bc') && AcionPos.value == "right") {
       let left = centerPosLeft.value  + uni.upx2px(_offset.value[0])
        return {
            width: height_width + 'rpx',
            transform: `translateX(${left}px) translateY(${-_offset.value[1]}rpx)`,
            'flex-direction': 'row'
        }
    }
    if ((BtnPos.value == 'bc')  && AcionPos.value == "top") {
        let left = centerPosLeft.value  + uni.upx2px(_offset.value[0])
        let top =  -_offset.value[1]
        return {
            height: height_width + 'rpx',
            transform: `translateX(${left}px) translateY(${top}rpx)`,
            'flex-direction': 'column-reverse'
        }
    }
    if ((BtnPos.value == 'bc')  && AcionPos.value == "bottom") {
        let left = centerPosLeft.value  + uni.upx2px(_offset.value[0])
        let top =  (props.actions.length) * props.height + _offset.value[1]
        // #ifdef APP-NVUE
        top =   props.height-_offset.value[1]
        // #endif
        return {
            height: height_width + 'rpx',
            transform: `translateX(${left}px) translateY(${top}rpx)`,
            'flex-direction': 'column'
        }
    }
})

function onclick(e){
    if(props.clickHidnActions){
        showActions.value = !showActions.value
    }else{
        showActions.value = true;
    }
    emits("click",e)
}
function change(index:number,item:actionsItem){
    if(props.clickHidnActions){
        showActions.value = false
    }
    emits('change',index,item)
}
</script>
