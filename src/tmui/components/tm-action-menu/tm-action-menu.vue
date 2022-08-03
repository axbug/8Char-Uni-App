<!--
 * @Date: 2022-05-07 13:31:20
 * @LastEditors: tmzdy
 * @Author: tmzdy
 * @Description: 文件
-->
<template>
	<tm-drawer ref="drawer" @close="drawerClose" @open="drawerOpen" :height="cHeight" @update:show="show = $event"
		:show="show" :transprent="true" :hide-header="true">
		<view @click.stop="" class=" flex flex-col">
			<view style="height: 24rpx;"></view>
			<tm-sheet :round="2">
				<view class=" flex flex-col round-2 overflow mx-32">
					<tm-text _class="opacity-5 text-align-center" :font-size="24" label="请选择"></tm-text>
					<tm-button :transprent="true" :fontColor="_active==index?props.activeFontColor:''" :followTheme="false" :disabled="item.disabled" @click="change(item,index)"
						v-for="(item, index) in _list" :key="index" :label="item.text" :font-size="28" :margin="[0, 0]"
						color="white" block :shadow="0" :round="-1"></tm-button>
				</view>
			</tm-sheet>
			<tm-button :round="5" :fontColor="props.activeFontColor" :followTheme="false" @click="cancel" label="取消" :font-size="28" :margin="[32, 8]" :color="_color"
				block :shadow="0"></tm-button>
		</view>
	</tm-drawer>
</template>
<script lang="ts" setup>
/**
 * 快速操作栏
 * @description 从底部弹出的快速操作菜单栏，对于单项可选项目操作，非常有用，且便利。
 */
import {
	ref,
	PropType,
	computed,
	watchEffect,watch
} from "vue"
import tmDrawer from '../tm-drawer/tm-drawer.vue';
import tmButton from "../tm-button/tm-button.vue";
import tmText from "../tm-text/tm-text.vue";
import tmSheet from "../tm-sheet/tm-sheet.vue";
const drawer = ref<InstanceType<typeof tmDrawer> | null>(null)

/**
 * 事件说明å
 * v-model:显示和隐藏
 * change:当点击项目时触发，返回listitem数据
 * cancel:点击取消时触发
 */
const emits = defineEmits(["update:modelValue","update:active", "change", "cancel"])
interface listitem {
	text?: string,
	disabled?: boolean,
	[prop: string]: any;
}
const props = defineProps({
	list: {
		type: Array as PropType<Array<listitem> | Array<string>>,
		default: () => [],
		required: true
	},
	//当list为对象数组时，需要提供。
	rangKey: {
		type: String,
		default: 'text'
	},
	modelValue: {
		type: Boolean,
		default: false
	},
	color: {
		type: String,
		default: "white"
	},
	//活动项的文字色，如果不提供使用默认
	activeFontColor:{
		type:String,
		default:"primary"
	},
	//当前的活动项。
	active:{
		type:Number,
		default:NaN
	},
	//点按菜单后，是否允许关闭弹层。
	allowClose:{
		type:Boolean,
		default:true
	}
})
const show = ref(props?.modelValue ?? false);
const _active = ref(props.active)
const _list = computed<Array<listitem>>(() => {
	let plist = props?.list ?? [];
	let listdata: Array<listitem> = [];
	listdata = plist.map(el => {
		let d: listitem = {};
		if (typeof el == 'string' || typeof el == 'number') {
			d.text = el;
			d.disabled = false;
		} else if (typeof el == 'object') {
			d.text = el[props.rangKey];
			d = {
				...d,
				...el
			};
		}
		return d;
	})
	return listdata
})
const win_bottom = uni.getWindowInfo()?.safeAreaInsets?.bottom??0
const cHeight = computed(() => {
	let len = _list.value.length + 1
	return len * 80 + 180 + win_bottom
})

const _color = computed(() => props.color)

watchEffect(() => {
	show.value = props.modelValue;

})
watch(()=>props.active,()=>{
	_active.value = props.active;
})
function change(item: listitem,index:number) {
	emits("change", item,index)
	_active.value = index;
	emits("update:active", index)
	if(props.allowClose){
		drawer.value?.close()
	}
}

function cancel() {
	emits("cancel")
	drawer.value?.close()
}

function drawerClose() {
	emits("update:modelValue", false)
}

function drawerOpen() {
	emits("update:modelValue", true)
}
</script>

<style>
</style>
