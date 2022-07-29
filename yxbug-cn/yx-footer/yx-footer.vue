<template>
	<view class="wrap" @click="Copyright()">
		<u-divider color="#f8f8f8" bg-color="transparent">{{ title }}</u-divider>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: null
		};
	},
	mounted() {
		const tip = '都能逆向我的JS代码，何必来改我版权，道德呢？';
		this.title = '© 2022 阿轩的Bug';
	},
	methods:{
		Copyright(){
			// #ifdef H5
				window.open("https://blog.yxbug.cn")
			// #endif
		}
	}
};
</script>

<style lang="scss" scoped>
	.wrap{
		margin-top: 88rpx;
	}
</style>
