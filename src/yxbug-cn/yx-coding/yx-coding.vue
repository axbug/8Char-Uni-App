<template>
	<view class="u-m-b-40">
		<yx-sheet :margin="[20, 0]" :round="3" :shadow="2">
			<view class="u-flex u-row-center u-col-center">
				<u-image :height="400" :src="getUrl(`static/icon/other/coding.svg`)" :width="400" class="u-m-t-40"></u-image>
			</view>
			<view class="yx-text-weight-b u-font-42 u-m-t-40 u-text-center">{{props.title}}</view>
			<view class="yx-text-weight-b u-font-32 u-m-t-30 u-text-center">功能调试中,敬请期待!</view>
			<yx-copyright></yx-copyright>
		</yx-sheet>
	</view>
</template>

<script setup>
import {getUrl} from "@/utils/file";

const props = defineProps({
	title: {
		type: String,
		default: ''
	}
});
</script>
