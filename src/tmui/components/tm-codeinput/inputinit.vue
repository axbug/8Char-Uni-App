<template>
    <view ref="dombg">
        <tm-sheet :followTheme="props.followTheme" :text="false" :userInteractionEnabled="false" :width="6" :color="props.color" :height="_size / 2"
        :margin="[0, 0]" :padding="[0, 0]">
        </tm-sheet>
    </view>
</template>
<script lang="ts" setup>
import { computed,onMounted,onUnmounted,getCurrentInstance,nextTick, } from 'vue';
import tmSheet from "../tm-sheet/tm-sheet.vue"
// #ifdef APP-PLUS-NVUE
const animation = uni.requireNativePlugin('animation')
// #endif
const {proxy} = getCurrentInstance();
const props = defineProps({
	followTheme:{
		type:[Boolean,String],
		default:true
	},
    color: {
        type: String,
        default: "primary"
    },
    size: {
        type: Number,
        default: 50
    },
})
const _size = computed(() => props.size)
let bindxToken = null;
let  timid = 636666
onMounted(() => {
    
	// #ifdef APP-PLUS-NVUE
	// nextTick(()=>spinNvueAni())
	// #endif
})


function spinNvueAni(ot=0) {
	if (!proxy?.$refs['dombg']) return;
    let el = proxy.$refs['dombg'];
	  animation.transition(el, {
		  styles: {
			  opacity: ot,
		  },
		  duration: 800, //ms
		  timingFunction: 'ease',
		  delay: 0 //ms
	  },()=>{
		  if(ot===0){
			  ot = 1
		  }else{
			  ot=0
		  }
		  nextTick(()=>spinNvueAni(ot))
	  })
    
}
</script>
