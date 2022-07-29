<template>
	<view v-if="yun.day_list.length">
		<view class="blockquote"><text class="blockquote-title">流日</text></view>
		<scroll-view class="scroll-view" scroll-x="true">
			<view v-for="(item, index) in yun.day_list" class="scroll-view-item">
				<view
					class="scroll-view-item-default"
					:class="{ 'scroll-view-item-active': yun.day_index == index }"
					@click="LiuDayClick(index)"
				>
					<view>{{ item.nongli }}</view>
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
		LiuDayClick(index) {
			uni.$store.commit('yun/set', { day_index: index });
			uni.$store.commit('yun/resolveLiuDay');
		},
	}
};
</script>