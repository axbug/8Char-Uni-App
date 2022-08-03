<template>
	<view class="content">
		<view class="img-box"><image src="@/static/logo.svg" class="img" /></view>

		<view class="box yx-theme-background-color">
			<view class="realname">
				<u-input v-model="$store.state.userinfo.realname" type="text" :border="false" placeholder="请输入姓名" />
			</view>

			<view class="tabs">
				<view class="gender">
					<u-subsection
						:list="gender_select.list"
						:current="gender_select.current"
						bg-color="#0e1526"
						inactive-color="#f8f8f8"
						active-color="#0e1526"
						@change="GenderSelectChange"
					/>
				</view>
				<view class="time">
					<u-subsection
						:list="time_select.list"
						:current="time_select.current"
						bg-color="#0e1526"
						inactive-color="#f8f8f8"
						active-color="#0e1526"
						@change="TimeSelectChange"
					/>
				</view>
			</view>

			<view class="datetime">
				<u-input
					v-if="time_select.current == 0"
					v-model="datetime.yang"
					type="text"
					:border="false"
					placeholder="请选择公历时间"
					:disabled="true"
					@click="ShowTimeSelect()"
				/>
				<u-input
					v-else-if="time_select.current == 1"
					v-model="datetime.yang"
					type="text"
					:border="false"
					placeholder="请根据四柱筛选时间"
					:disabled="true"
					@click="ShowTimeSelect()"
				/>
			</view>
		</view>

		<button class="btn" @click="Sumbit()">开始排盘</button>
		<yx-footer />
		<u-picker
			mode="time"
			v-model="time_picker.show"
			title="请选择时间"
			:params="time_picker.params"
			cancel-color="#f8f8f8"
			confirm-color="#f8f8f8"
			@confirm="PickerCallBack"
		/>

		<si-zhu-picker v-model="sizhu_picker.show" @Confirm="SiZhuConfirm" />
	</view>
</template>

<script>
import { Lunar, Solar } from 'lunar-javascript';
import { mapState } from 'vuex';
import SiZhuPicker from './components/index-sizhu-picker/index-sizhu-picker.vue';
export default {
	data() {
		return {
			timestamp: null,
			datetime: {
				yin: null,
				yang: null
			},
			gender_select: {
				list: [
					{
						name: '男'
					},
					{
						name: '女'
					}
				],
				current: 0
			},
			time_select: {
				list: [
					{
						name: '公历'
					},
					{
						name: '四柱'
					}
				],
				current: 0
			},
			time_picker: {
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false
				},
				show: false
			},
			sizhu_picker: {
				show: false
			}
		};
	},
	components: {
		SiZhuPicker
	},
	methods: {
		ShowTimeSelect(e) {
			if (this.time_select.current == 0) {
				this.time_picker.show = true;
			} else {
				this.sizhu_picker.show = true;
			}
		},
		PickerCallBack(e) {
			const datetime = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute;
			e.time = e.hour + ':' + e.minute + ':00';
			this.datetime.yang = datetime;
			this.$store.commit('bazi/set', { timestamp: new Date(datetime.replace(/-/g,'/').replace(/T/g, ' ')).getTime() });
		},
		SiZhuConfirm(e) {
			this.datetime.yang = e.label;
			this.$store.commit('bazi/set', { timestamp: e.value });
		},
		TimeSelectChange(e) {
			this.time_select.current = e;
		},
		GenderSelectChange(e) {
			this.gender_select.current = e;
		},
		Sumbit() {
			const params = {
				realname: this.$store.state.userinfo.realname??"不知名网友",
				timestamp: this.$store.state.bazi.timestamp,
				gender: this.gender_select.current == 0 ? 1 : 0
			};

			if (this.datetime) {
				this.$store.commit('bazi/pull', params);
				this.$store.commit('userinfo/set', params);
				uni.setStorageSync('info', JSON.stringify(params));
				uni.$u.route('/pages/index/detail');
			} else {
				this.time_picker.show = true;
			}
		}
	}
};
</script>

<style lang="scss">
.content {
	padding: 0 20rpx;
	.box {
		max-width: 750px;
		margin: auto;
		padding: 20rpx;
		border-radius: 12rpx;
		color: #ffffff;
		padding: 30rpx;
		font-weight: 800;
		line-height: 40rpx;
		border-radius: 12rpx;
		background: linear-gradient(315deg, #131a2c, #161f34);
		box-shadow: -3rpx -3rpx 3rpx #111727, 3rpx 3rpx 3rpx #19233b;
		.realname {
		}
		.tabs {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			margin-top: 20rpx;
			.gender {
				width: 35%;
			}
			.time {
				width: 55%;
			}
		}
		.datetime {
			margin-top: 20rpx;
		}
	}
	.btn {
		margin: 60rpx auto;
		max-width: 750px;
		color: #ffffff;
		padding: 30rpx;
		font-size: 32rpx;
		font-weight: 800;
		text-align: center;
		line-height: 40rpx;
		border-radius: 12rpx;
		background: linear-gradient(315deg, #131a2c, #161f34);
		box-shadow: -3rpx -3rpx 3rpx #111727, 3rpx 3rpx 3rpx #19233b;
	}
}

.img-box {
	text-align: center;
	margin: auto;
	.img {
		width: 500rpx;
		height: 500rpx;
	}
}
</style>
