<template>
	<tm-drawer
		:show="showCustom"
		placement="center"
		hideHeader
		:height="488"
		:width="600"
		@close="DrawerClose"
		@update:show="showCustom = $event"
	>
		<view class="pa-32 flex flex-col">
			<view class="text-align-center py-30"><tm-text _class="text-weight-b" :font-size="32" label="自定义主题"></tm-text></view>
			<tm-input
				class="mt-10 flex"
				prefixLabel="颜色值"
				placeholder="请输入颜色值,比如:#6768ab"
				:border="1"
				showClear
				v-model="showCustomColor"
			></tm-input>

			<view class="mt-30">
				<tm-button @click="ChangeTheme" block label="确认切换"></tm-button>
				<tm-button @click="ResetTheme" block label="重置主题"></tm-button>
			</view>
		</view>
	</tm-drawer>
</template>

<script lang="ts" setup>
import { ref, defineProps, watchEffect } from 'vue';
import { useTmpiniaStore } from '@/tmui/tool/lib/tmpinia';

const emits = defineEmits(['update:show']);
const props = defineProps({
	show: {
		type: Boolean,
		dafault: false
	}
});

const store = useTmpiniaStore();
const showCustomColor = ref('#6768ab');
const showCustom = ref(props.show);

watchEffect(() => {
	showCustom.value = props.show;
});

const ChangeTheme = () => {
	if (!showCustomColor.value) {
		uni.showToast({
			title: '请输入颜色值！'
		});
		return;
	}
	store.setTmVuetifyAddTheme('user_diy' + new Date().getTime(), showCustomColor.value);
	showCustom.value = false;
	emits('update:show', false);
};

const DrawerClose = () => emits('update:show', false);

const ResetTheme = () => {
	store.setTmVuetifyTheme('');
	showCustom.value = false;
	emits('update:show', false);
};
</script>
