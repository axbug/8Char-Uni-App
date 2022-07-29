<template>
	<view class="content">
		<header-view />

		<table-view />

		<yun-view />
		
		<yx-footer />
	</view>
</template>

<script>
import YunView from './components/detail-yun/detail-yun.vue';
import TableView from './components/detail-table/detail-table.vue';
import HeaderView from './components/detail-header/detail-header.vue';
export default {
	components: {
		YunView,
		HeaderView,
		TableView
	},
	onLoad() {
		const cache = uni.getStorageSync('info');
		if (cache) {
			let data = null
			try {
				data = JSON.parse(cache);
				this.$store.commit('userinfo/pull', data);
			} catch (e) {
				uni.removeStorageSync('info');
				uni.$u.route({ url: '/pages/index/index', type: 'redirect' });
			}
			
		} else {
			uni.$u.route({ url: '/pages/index/index', type: 'redirect' });
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	margin: 20rpx auto;
	padding: 30rpx;
	max-width: 750px;
}
</style>
