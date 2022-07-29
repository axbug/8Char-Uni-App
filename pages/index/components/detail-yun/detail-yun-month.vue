<template>
	<view v-if="yun.month_list.length">
		<view class="blockquote"><text class="blockquote-title">流月</text></view>
		<scroll-view class="scroll-view" scroll-x="true">
			<view v-for="(item, index) in yun.month_list" class="scroll-view-item">
				<view
					class="scroll-view-item-default"
					:class="{ 'scroll-view-item-active': yun.month_index == index }"
					@click="LiuMonthClick(index)"
				>
					<view>{{ item.jieqi }}</view>
					<view>{{ item.date }}</view>
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
	methods:{
		LiuMonthClick(index) {
			uni.$store.commit('yun/set', { month_index: index });
			uni.$store.commit('yun/resolveLiuMonth');
		},
	}
};
</script>