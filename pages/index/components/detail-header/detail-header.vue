<template>
	<view class="header">
		<view class="left">
			<view class="date u-line-1">姓名：{{ $store.state.userinfo.realname }}</view>
			<view class="date">生肖：{{ GetChineseZodiac($store.state.bazi.solar.year) }}</view>
			<view class="date">
				性别：{{$store.state.userinfo.gender?"男":"女"}}
			</view>
		</view>
		<view class="right">
			<view class="date">阴历：{{  $store.state.bazi.yinli }}</view>
			<view class="date">阳历：{{ $store.state.bazi.yangli }}</view>
			<view class="date">
				星座：{{$store.state.bazi.xinzuo}}座
			</view>
		</view>
	</view>
</template>

<script>
	import utils from '@/utils/init.js'
	export default {
		data() {
			return {};
		},
		methods:{
			GetChineseZodiac(year){
				return utils.GetChineseZodiac(year);
			}
		}
	}
</script>

<style lang="scss">
.header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		padding: 0 10rpx;
		margin-bottom: 20rpx;
		.left {
			width: 40%;
			.date {
				font-size: 26rpx;
				line-height: 50rpx;
			}
		}
		.right {
			width: 60%;
			.date {
				font-size: 26rpx;
				line-height: 50rpx;
			}
		}
	}
</style>
