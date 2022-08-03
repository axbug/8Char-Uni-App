<template>
	<view class="flex flex-col flex-wrap overflow" :class="[_disabled?'opacity-5':'']" style="flex-wrap:wrap;">
		<view @click="hanlerClick" class="flex flex-row flex-row-center-start flex-1">

			<tm-sheet :linear="props.linear" :linearDeep="props.linearDeep" :followTheme="props.followTheme"
				:followDark="props.followDark" :dark="props.dark" :shadow="props.shadow" :userInteractionEnabled="false"
				:width="_is_radio?props.size:0" :height="_is_radio?props.size:0" :text="(!_checked)"
				:border="props.border" :border-style="props.borderStyle" :transprent="props.transprent"
				:padding="_is_radio?[0,0]:[16,10]" :margin="_is_radio?[16,8]:[8,8]"
				:color="_disabled?'grey-2':props.color" :round="props.round" _class="flex-row flex-row-center-center">
				<tm-translate :duration="100" v-if="_checked&&_is_radio" name="zoom" style="line-height: 1;">
					<tm-icon :font-size="props.size*0.54" :name="props.icon"></tm-icon>
				</tm-translate>
				<tm-text v-if="!_is_radio" :font-size="props.fontSize" :label="props.label"></tm-text>
			</tm-sheet>
			<view :userInteractionEnabled="false">
				<slot>
					<view class="flex-1 flex-row flex-row-cneter-cneter" style="flex-wrap:wrap;">
						<tm-text class="flex-1 flex-wrap"  v-if="_is_radio"
							:font-size="props.fontSize" :label="props.label"></tm-text>
					</view>
				</slot>
			</view>
			
		</view>
	</view>
</template>
<script lang="ts" setup>
	/**
	 * 单选框
	 * @description 单选框不可单独使用，必须配合tm-radio-group，放置在tm-radio-group中使用。
	 */
	import tmSheet from '../tm-sheet/tm-sheet.vue';
	import tmIcon from '../tm-icon/tm-icon.vue';
	import tmText from '../tm-text/tm-text.vue';
	import tmTranslate from '../tm-translate/tm-translate.vue';
	import {
		custom_props
	} from '../../tool/lib/minxs';
	import {
		ref,
		computed,
		watch,
		inject,
		getCurrentInstance,
		nextTick
	} from 'vue';
	const {
		proxy
	} = getCurrentInstance();
	const emits = defineEmits(['update:modelValue', 'change', 'click'])
	const props = defineProps({
		...custom_props,
		followTheme: {
			type: [Boolean, String],
			default: true
		},
		size: {
			type: Number,
			default: 42
		},
		transprent: {
			type: Boolean,
			default: false
		},
		color: {
			type: String,
			default: 'primary'
		},
		round: {
			type: Number,
			default: 24
		},
		border: {
			type: Number,
			default: 2
		},
		//选项值，选中后返回的值。
		value: {
			type: [String, Number, Boolean],
			default: '',
		},
		/**
		 * v-model双向绑定，如果选中后以数组形式给出value值。
		 */
		modelValue: {
			type: [String, Number, Boolean],
			default: ''
		},
		label: {
			type: [String, Number],
			default: ''
		},
		//默认是否选中状态。不受上方的modelValue控制，直接选中。
		defaultChecked: {
			type: [Boolean],
			default: false
		},
		//选中前的勾子。返回false将阻止选中。也可以返回 Promise异步
		beforChecked: {
			type: [Function, String, Boolean],
			default: () => {
				return false;
			}
		},
		disabled: {
			type: Boolean,
			default: false
		},
		fontSize: {
			type: Number,
			default: 26
		},
		/**
		 * 自定义选中的图标名称
		 */
		icon: {
			type: String,
			default: "tmicon-check"
		},

	})

	const _checked = ref(props.defaultChecked ?? false)
	const _groupCheckedVal = inject('tmRadioBoxVal', computed(() => ''));
	const tmCheckedBoxDisabled = inject('tmRadioBoxDisabled', computed(() => false));
	const _is_radio = inject('tmRadioBoxModel', computed(() => false));
	const _disabled = computed(() => props.disabled || tmCheckedBoxDisabled.value)
	//父级方法。
	let parent = proxy.$parent

	while (parent) {
		if (parent?.checkBoxkeyId == 'tmRadioBoxGroup' || !parent) {
			break;
		} else {
			parent = parent?.$parent ?? undefined
		}
	}
	if (parent) {
		parent.pushKey(props.value)
	}

	/** -----------form专有------------ */
	//父级方法。
	const tmFormFun = inject("tmFormFun", computed(() => ""))
	watch(tmFormFun, () => {
		if (tmFormFun.value == 'reset') {
			emits('update:modelValue', "")
			if (parent) {
				parent?.addKey("")
			}
			_checked.value = false
		}
	})

	/** -----------end------------ */

	function callBack(e) {
		console.log(e)
	}

	function vailChecked() {
		let checked_val = false;
		if (props.modelValue === props.value && typeof props.value !== 'undefined' && props.value !== '' && props
			.modelValue !== '') {
			checked_val = true;
		}
		if (props.value === _groupCheckedVal.value && _groupCheckedVal.value !== '' && props.value !== '') {
			checked_val = true;
		}
		return checked_val;
	}
	if (vailChecked()) {
		_checked.value = true;
		emits('update:modelValue', props.value)
	}
	async function hanlerClick() {
		if (_disabled.value || _checked.value) {
			return;
		}

		if (typeof props.beforChecked === 'function') {
			uni.showLoading({
				title: "...",
				mask: true
			})
			let p = await props.beforChecked();
			if (typeof p === 'function') {
				p = await p();
			}
			uni.hideLoading();
			if (!p) return;
		}
		_checked.value = true;
		if (parent) {
			parent.addKey(props.value)
		}
		emits('update:modelValue', props.value)
		emits('change', _checked.value)
	}
	watch([() => props.modelValue, _groupCheckedVal], () => {
		_checked.value = vailChecked()
		
	})
</script>
