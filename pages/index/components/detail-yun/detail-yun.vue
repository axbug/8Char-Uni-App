<template>
	<view>
		<view class="yun">
			<view>起运：{{ $store.getters["bazi/GetStartYunLabel"] }}</view>
			<view>起运公历：{{ $store.state.bazi.start_yun.solar }}</view>
		</view>
		
		<DetailYunDaYun />
		<DetailYunYear />
		<DetailYunMonth />
		<DetailYunDay />
		<DetailYunTime />
	</view>
</template>

<script>
	import DetailYunDaYun from './detail-yun-dayun.vue';
	import DetailYunYear from './detail-yun-year.vue';
	import DetailYunMonth from './detail-yun-month.vue';
	import DetailYunDay from './detail-yun-day.vue';
	import DetailYunTime from './detail-yun-time.vue';
	export default {
		components: {
			DetailYunDaYun,
			DetailYunYear,
			DetailYunMonth,
			DetailYunDay,
			DetailYunTime
		},
	}
</script>

<style lang="scss">
	.yun {
		padding: 0 10rpx;
		margin: 20rpx 0;
	}
</style>