<script>
export default {
	onLaunch: function() {},
	onPageNotFound: [
		function(res) {
			uni.$u.route({ url: '/pages/common/404', type: 'redirect' });
		}
	]
};
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
page {
	background-color: #0e1526;
}
.yx-theme-color {
	background-image: linear-gradient(90deg, #4b34c3, #3d3ff7);
	// background-image: linear-gradient(45deg, #82848a, #1989cb) !important;
	-webkit-background-clip: text !important;
	-moz-background-clip: text;
	background-clip: text;
	color: transparent !important;
}

.yx-theme-background-color {
	background: linear-gradient(315deg, #131a2c, #161f34);
	box-shadow: -3rpx -3rpx 3rpx #111727, 3rpx 3rpx 3rpx #19233b;
	color: #f8f8f8;
}

.yx-theme-font-weight {
	font-weight: 800;
}

.blockquote {
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	border-left: 8rpx solid #6768ab;
	margin: 19rpx 0;
	border-radius: 2rpx;
	&-title {
		font-weight: 800rpx;
		margin-left: 10rpx;
		font-size: 28rpx;
		font-weight: 800;
		color: #6768ab;
		line-height: 40rpx;
	}
}

.scroll-view {
	white-space: nowrap;
	width: 100%;
	margin-bottom: 20rpx;
	&-item {
		display: inline-block;
		// width: 16%;
		text-align: center;
		padding: 0 10rpx;
		&-default {
			padding: 10rpx;
		}
		&-active {
			background-color: #6768ab;
			border-radius: 12rpx;
		}
	}
}
</style>
