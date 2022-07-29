<template>
	<view class="wrap">
		<view class="img-box"><image src="@/static/404.png" class="img" /></view>
		<view class="content">
			<view class="title">页面迷路了</view>
			<view class="info">1. 请确认访问地址是否有误</view>
			<view class="info">2. 请检查网络环境是否通畅</view>
		</view>
		<button class="yx-theme-background-color btn" @click="Back">返 回 首 页</button>
	</view>
</template>

<script>
export default {
	methods: {
		Back() {
			uni.$u.route({ url: 'pages/index/index', type: 'redirect' });
		}
	}
};
</script>

<style lang="scss" scoped>
.img-box {
	margin: auto;
	text-align: center;
	.img {
		width: 600rpx;
	}
}
.wrap {
	padding: 30rpx;
	margin: auto;
}
.content {
	text-align: center;
	color: #f8f8f8;
	.title {
		font-size: 50rpx;
		line-height: 100rpx;
		font-weight: 800;
	}
	.info {
		font-size: 38rpx;
		line-height: 80rpx;
	}
}

.btn {
	margin-top: 20rpx;
}
</style>
