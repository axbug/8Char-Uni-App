<template>
	<view>
		<u-popup :maskCloseAble="true" mode="bottom" :popup="false" v-model="value" length="auto" :safeAreaInsetBottom="false" @close="Close">
			<view class="header">
				<view class="left" @click="Close()">取消</view>
				<view class="content">请选择四柱</view>
				<view class="right" @click="GetSiZhu()">确定</view>
			</view>

			<u-tabs
				:list="tabs.list"
				:is-scroll="true"
				:current="tabs.current"
				:active-item-style="tabs.select"
				class="u-m-t-20"
				inactive-color="#FFFFFF"
				active-color="#6768ab"
				bg-color="transparent"
				@change="TabsChange"
			/>

			<view class="sizhu-picker">
				<view class="sizhu-picker-box" v-for="(item, index) in list">
					<view class="sizhu-picker-box-item" :class="{ 'sizhu-picker-box-item-active': current == index }" @click="PickerClick(index)">
						<view class="sizhu-picker-box-item-title">{{ item }}</view>
					</view>
				</view>
			</view>
		</u-popup>

		<u-select v-model="select.show" :list="select.list" @confirm="Confirm"></u-select>
	</view>
</template>

<script>
import { Solar } from 'lunar-javascript';
export default {
	props: {
		value: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		value: {
			immediate: true,
			handler(val) {}
		}
	},
	data() {
		return {
			tabs: {
				list: [],
				current: 0,
				default: {
					color: '#FFFFFF'
				},
				select: {
					color: '#6768ab'
				}
			},
			list: ['甲', '甲', '甲', '甲', '子', '子', '子', '子'],
			current: 0,
			select: {
				list: [],
				show: false
			}
		};
	},
	mounted() {
		this.PullTabs(0);
	},
	methods: {
		PickerClick(i) {
			this.current = i;
			this.PullTabs(i);
		},
		TabsChange(e) {
			this.tabs.current = e;
			const key = this.tabs.list[e];
			this.list[this.current] = key.name;
		},
		PullTabs(i) {
			const tian = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
			const di = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
			const list = [];
			const model = this.current > 3 ? di : tian;
			const zhi = this.list[i];
			let index = 0;
			for (let i = 0; i < model.length; i++) {
				const key = model[i];
				if (key == zhi) index = i;
				list.push({ name: key });
			}
			this.tabs.list = list;
			this.tabs.current = index;
		},
		GetSiZhu() {
			const list = this.list;
			const year = list[0] + list[4];
			const month = list[1] + list[5];
			const day = list[2] + list[6];
			const time = list[3] + list[7];
			const result = Solar.fromBaZi(year, month, day, time, 2, 0);
			if (result.length) {
				const list = [];
				for (let i = 0; i < result.length; i++) {
					const item = result[i];
					const datetime = item.toYmdHms();
					const timestamp = new Date(datetime.replace(/-/g,'/').replace(/T/g, ' ')).getTime();
					list.push({ label: datetime, value: timestamp });
				}
				this.select.list = list;
				this.Close()
				this.select.show = true;
			} else {
				uni.$u.toast('四柱检索异常，请检查！');
			}
		},
		Close() {
			this.$emit('input', false);
		},
		Confirm(e){
			this.$emit("Confirm",e[0])
		}
	}
};
</script>

<style lang="scss">
.header {
	display: flex;
	align-items: center;
	.left {
		width: 20%;
		padding: 4%;
		text-align: left;
	}
	.content {
		width: 60%;
		text-align: center;
		font-weight: 800;
	}
	.right {
		width: 20%;
		padding: 4%;
		text-align: right;
	}
}

.sizhu-picker {
	margin-top: 30rpx;
	display: flex;
	flex-wrap: wrap;
	&-box {
		width: 25%;
		text-align: center;
		&-item {
			width: 100rpx;
			height: 100rpx;
			margin: auto;
			margin-bottom: 30rpx;
			border-radius: 100%;
			background: linear-gradient(315deg, #131a2c, #161f34);
			display: flex;
			justify-content: center;
			align-items: center;
		}
		&-item-active {
			background: #6768ab;
		}
	}
}
</style>
