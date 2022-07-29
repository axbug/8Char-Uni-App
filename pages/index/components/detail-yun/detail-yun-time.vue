<template>
	<view v-if="yun.time_list.length">
		<view class="blockquote"><text class="blockquote-title">流时</text></view>
		<scroll-view class="scroll-view" scroll-x="true">
			<view v-for="(item, index) in yun.time_list" class="scroll-view-item">
				<view
					class="scroll-view-item-default"
				>
					<view>{{ item.time }}</view>
					<view>{{ item.ganzhi }}</view>
					<view>{{ item.shishen }}</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState(["yun"])
	},
};
</script>