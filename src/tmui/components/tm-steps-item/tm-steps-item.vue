<template>
	<view :class="[
		_isNvue ? 'relative ' : 'absolute',
		'flex flex-row flex-row-start-center overflow',
		_cureent < _countCurrent ? 'flex-1' : ''
	]" :style="[
	!_isNvue ? { width: _cureent < _countCurrent ? _width : 'auto', left: `${offsetLeft}%`, marginLeft: '24rpx' } : ''
]">

		<!-- 内容 区域。 -->
		<view class="flex flex-col" style="justify-content: flex-start;align-items: center;">
			<tm-sheet no-level @click="stepClick" :followTheme="props.followTheme" :followDark="props.followDark"
				:dark="props.dark" :shadow="props.shadow" :outlined="props.outlined" :borderStyle="props.borderStyle"
				:borderDirection="props.borderDirection" 
				:text="_isCheck?false:(!status)" :linearDeep="props.linearDeep"
				:linear="props.linear" :color="_color" :round="24" _class="flex-center" :margin="[0, 0]" :padding="[0, 0]"
				:width="_typeModel != 'dot' ? props.size : 20" :height="_typeModel != 'dot' ? props.size : 20">
				<tm-text v-if="!_icon && !status && _typeModel != 'dot'" @click="stepClick" :userInteractionEnabled="false"
					:font-size="22" :label="_cureent + 1"></tm-text>
				<tm-icon :font-size="22" @click="stepClick" v-if="status && _isActive && _typeModel != 'dot'"
					:name="status.icon"></tm-icon>
				<tm-icon :font-size="22" @click="stepClick" v-if="!status && _icon && _typeModel != 'dot'" :name="_icon">
				</tm-icon>
			</tm-sheet>
			<view @click.stop="stepClick" style="width:120rpx" class="flex flex-col flex-col-center-center  mt-12">
				<slot name="default">
					<tm-text v-if="props.title" @click="stepClick" :userInteractionEnabled="false"
						:color="_isCheck ? _activeColor : ''" _class="text-overflow-2" :font-size="24" :label="props.title">
					</tm-text>
					<tm-text v-if="props.label" @click="stepClick" :userInteractionEnabled="false"
						:color="_isCheck ? _activeColor : ''" _class="text-overflow-2 opacity-5" :font-size="22"
						:label="props.label"></tm-text>
				</slot>
			</view>
		</view>
		<!-- 线 -->
		<view v-if="_cureent < _countCurrent && showLine" class="flex-1 flex-col flex-col-start-start" style="width:0">
			<view :style="[{ marginTop:( _typeModel != 'dot' ? props.size / 2 : 10) + 'rpx' }]">
				<tm-divider :color="_color" :followDark="props.followDark" :dark="props.dark" :margin="[16, 0]">
				</tm-divider>
			</view>
		</view>

	</view>
</template>

<script lang="ts" setup>
/**
 * 步骤条项目组件
 * @description 必须放置在tm-steps中使用，不可单独使用。
 * @slot default 默认插槽是底部标题的插槽。
 */
import tmSheet from '../tm-sheet/tm-sheet.vue';
import tmText from '../tm-text/tm-text.vue';
import tmIcon from '../tm-icon/tm-icon.vue';
import tmDivider from '../tm-divider/tm-divider.vue';
import { computed, getCurrentInstance, inject, ref } from "vue";
import { custom_props } from '../../tool/lib/minxs';
const { proxy } = getCurrentInstance();
const props = defineProps({
	...custom_props,
	transprent: {
		type: Boolean,
		default: false
	},
	color: {
		type: String,
		default: ''
	},
	activeColor: {
		type: String,
		default: ''
	},
	title: {
		type: String,
		default: ""
	},
	label: {
		type: String,
		default: ""
	},
	icon: {
		type: String,
		default: ""
	},
	//圆点的大小。
	size: {
		type: Number,
		default: 32
	},

})
//父级方法。
let parent = proxy.$parent

while (parent) {
	if (parent?.compoenentName == 'tmSteps' || !parent) {
		break;
	} else {
		parent = parent?.$parent ?? undefined
	}
}
const _isNvue = ref(false)
// #ifdef APP-NVUE
_isNvue.value = true;
// #endif
//本节点的位置步骤。
const _cureent = ref(parent?.pushKey() ?? 0)

//总步骤数量
const _countCurrent = inject("tmStepsCountCureent", computed(() => 0))
// 当前被激活的步骤
const _tmStepsCureent = inject("tmStepsCureent", computed(() => -1))
const tmStepsCountActiveColor = inject("tmStepsCountActiveColor", computed(() => 'primary'))
const tmStepsCountColor = inject("tmStepsCountColor", computed(() => 'grey-3'))

const _activeColor = computed(() => {
	if (props.activeColor) return props.activeColor;
	return tmStepsCountActiveColor.value;
})

const _typeModel = computed(() => parent.$props.type)

const status_obj = {
	wait: {
		color: _activeColor.value,
		icon: "tmicon-clock-fill"
	},
	process: {
		color: 'grey-2',
		icon: "tmicon-loading"
	},
	finish: {
		color: 'green',
		icon: "tmicon-check"
	},
	error: {
		color: 'red',
		icon: "tmicon-times"
	},
}
const status = computed(() => {
	if (!_isActive.value) return null;
	if (!status_obj.hasOwnProperty(parent.$props.status)) return null;
	return status_obj[String(parent.$props.status)]
})
const _isActive = computed(() => _cureent.value === _tmStepsCureent.value)
const _isCheck = computed(() => _cureent.value < _tmStepsCureent.value)
const _color = computed(() => {
	if (status.value && _isActive.value) {
		return status.value.color;
	}
	if (_isCheck.value) return _activeColor.value
	if (props.color) return props.color;
	return tmStepsCountColor.value;
})

const _icon = computed(() => {
	return props.icon;
})

const showLine = computed(() => parent.$props.showLine)


const _width = computed(() => 100 / (_countCurrent.value + 1) + '%')
const offsetLeft = computed(() => {
	let nowstep = _cureent.value + 1
	return (nowstep - 1) * (100 / (_countCurrent.value + 1))
})

async function stepClick() {
	if (!parent.$props.changeable) return;
	if (typeof parent.$props.beforeStepChange === 'function') {
		uni.showLoading({ title: "...", mask: true })
		let p = await parent.$props.beforeStepChange();
		if (typeof p === 'function') {
			p = await p();
		}
		uni.hideLoading();
		if (!p) return;
	}
	parent?.steplick(_cureent.value)
}
</script>

<style>
</style>
