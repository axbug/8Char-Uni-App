<template>
	<view v-if="yun.year_list.length">
		<view class="blockquote"><text class="blockquote-title">小运（流年）</text></view>
		<scroll-view class="scroll-view" scroll-x="true">
			<view v-for="(item, index) in yun.year_list" class="scroll-view-item">
				<view class="scroll-view-item-default" :class="{ 'scroll-view-item-active': yun.year_index == index }" @click="LiuYearClick(index)">
					<view>{{ item.year }}</view>
					<view>{{ item.ganzhi }}</view>
					<view>{{ item.age }}岁</view>
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
		...mapState(['yun'])
	},
	methods: {
		LiuYearClick(index) {
			uni.$store.commit('yun/set', { year_index: index, month_index: 0 });
			uni.$store.commit('yun/resolveLiuMonth');
		}
	}
};
</script>
