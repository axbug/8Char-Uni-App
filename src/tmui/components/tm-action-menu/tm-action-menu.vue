<template>
	<view @click="show = !show">
		<!-- #ifdef APP-NVUE -->
		<view :eventPenetrationEnabled="true">
			<slot></slot>
		</view>
		<!-- #endif -->
		<!-- #ifndef APP-NVUE -->
		<slot></slot>
		<!-- #endif -->
		<tm-drawer ref="drawer" :disabble-scroll="true" @close="drawerClose" @open="drawerOpen" :duration="props.duration"
			:height="cHeight" @update:show="show = $event" :show="show" :transprent="true" :hide-header="true">
			<view @click.stop="" class=" flex flex-col">
				<view style="height: 24rpx;"></view>
				<tm-sheet :round="5" :margin="[32, 0, 32, 16]">
					<view class=" flex flex-col flex-col-center-center round-2 overflow mx-32">
						<tm-text _class="opacity-5 text-align-center" :font-size="24" label="请选择"></tm-text>
						<tm-button :open-type="item?.openType??''" :transprent="true" :fontColor="_active == index ? _activeFontColor : ''"
							:followTheme="false" :disabled="item.disabled" @click="change(item, index)"
							v-for="(item, index) in _list" :key="index" :label="item.text" :font-size="28" :margin="[0, 0]"
							color="white" block :shadow="0" :round="-1"></tm-button>
					</view>
				</tm-sheet>
				<tm-button :round="5" :fontColor="_activeFontColor" :followTheme="false" @click="cancel" label="取消"
					:font-size="28" :margin="[32, 0]" :color="_color" block :shadow="0"></tm-button>
				<view :style="{ height: sysinfo.bottom + 'px' }"></view>
			</view>
		</tm-drawer>
	</view>
</template>
<script lang="ts" setup>
/**
 * 快速操作栏
 * @description 从底部弹出的快速操作菜单栏，对于单项可选项目操作，非常有用，且便利。
 */
import { ref, PropType, computed, watchEffect, watch, inject, onMounted } from "vue"
import tmDrawer from '../tm-drawer/tm-drawer.vue';
import tmButton from "../tm-button/tm-button.vue";
import tmText from "../tm-text/tm-text.vue";
import tmSheet from "../tm-sheet/tm-sheet.vue";
import { custom_props } from "@/tmui/tool/lib/minxs";
import { useTmpiniaStore } from "@/tmui/tool/lib/tmpinia";
const store = useTmpiniaStore()

const drawer = ref<InstanceType<typeof tmDrawer> | null>(null)
const sysinfo = inject("tmuiSysInfo", computed(() => {
	return { bottom: 0, height: 750, width: uni.upx2px(750), top: 0, isCustomHeader: false, sysinfo: null }
}))
const emits = defineEmits<{
	/**v-model隐藏和显示菜单 */
	(event: 'update:modelValue', value: boolean): void,
	/**v-model:active双向绑定当前选中的第几个项目 */
	(event: 'update:active', active: number): void,
	/**
	 * item:当前选中改变的项目
	 * index当前选中的索引
	 */
	(event: 'change', item: Tmui.tmActionMenu, index: number): void,
	/**取消关闭菜单  */
	(event: 'cancel'): void,
}>()


const props = defineProps({
	list: {
		type: Array as PropType<Array<Tmui.tmActionMenu> | Array<string>>,
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
	activeFontColor: {
		type: String,
		default: "primary"
	},
	//当前的活动项。
	active: {
		type: Number,
		default: NaN
	},
	//点按菜单后，是否允许关闭弹层。
	allowClose: {
		type: Boolean,
		default: true
	},
	duration: {
		type: Number,
		default: 250
	},
	followTheme: custom_props.followTheme,
})
const show = ref(props?.modelValue ?? false);
const _active = ref(props.active)
const _list = computed<Array<Tmui.tmActionMenu>>(() => {
	let plist = props?.list ?? [];
	let listdata: Array<Tmui.tmActionMenu> = [];
	listdata = plist.map(el => {
		let d: Tmui.tmActionMenu = {};
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

const cHeight = computed(() => {
	let len = _list.value.length + 1
	return len * 80 + 140 + sysinfo.value.bottom
})

const _color = computed(() => props.color)
const _activeFontColor = computed(() => props.followTheme ? store.tmStore.color : props.activeFontColor)

onMounted(() => {
	watchEffect(() => {
		show.value = props.modelValue;
	})
})
watch(() => props.active, () => {
	_active.value = props.active;
})
function change(item: Tmui.tmActionMenu, index: number) {
	emits("change", item, index)
	_active.value = index;
	emits("update:active", index)
	if (props.allowClose) {
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

<style></style>
