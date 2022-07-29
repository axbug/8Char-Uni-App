<template>
	<view v-if="yun.dayun_list.length">
		<view class="blockquote"><text class="blockquote-title">大运</text></view>
		<scroll-view class="scroll-view" scroll-x="true">
			<view v-for="(item, index) in yun.dayun_list" class="scroll-view-item">
				<view
					class="scroll-view-item-default"
					:class="{ 'scroll-view-item-active': yun.current_index == index }"
					@click="DaYunClick(index)"
				>
					<view>{{ item.start_year }}</view>
					<view>{{ item.ganzhi }}</view>
					<view>{{ item.start_age }}岁</view>
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
		DaYunClick(index) {
			uni.$store.commit('yun/set', { current_index: index });
			uni.$store.commit('yun/resolveDaYun');
		},
	}
};
</script>
