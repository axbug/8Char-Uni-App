<template>
	<view>
		<view v-for="(mitem, mindex) in map_list" :key="mitem.index">
			<tm-sheet v-if="yun_store[mitem.list].length" class="my-20" :round="3" :shadow="2" :margin="[20, 0]">
				<tm-text _class="font-weight-b" :label="mitem.title"></tm-text>
				<tm-divider></tm-divider>
				<scroll-view class="scroll-view" scroll-x="true">
					<view class="scroll-view-item" v-for="(ditem, dindex) in yun_store[mitem.list]">
						<view
							class="scroll-view-item-default"
							:class="{ 'scroll-view-item-active': yun_store[mitem.index] == dindex && mindex < 4 }"
							@click="ScrollItemClick(mindex, dindex)"
						>
							<view v-if="mindex == 0">
								<view><tm-text :label="ditem.start_year"></tm-text></view>
								<view><tm-text :label="ditem.ganzhi"></tm-text></view>
								<view><tm-text :label="ditem.start_age + '岁'"></tm-text></view>
								<view><tm-text :label="ditem.shishen"></tm-text></view>
							</view>
							<view v-if="mindex == 1">
								<view><tm-text :label="ditem.year"></tm-text></view>
								<view><tm-text :label="ditem.ganzhi"></tm-text></view>
								<view><tm-text :label="ditem.age + '岁'"></tm-text></view>
								<view><tm-text :label="ditem.shishen"></tm-text></view>
							</view>
							<view v-if="mindex == 2">
								<view><tm-text :label="ditem.jieqi"></tm-text></view>
								<view><tm-text :label="ditem.date"></tm-text></view>
								<view><tm-text :label="ditem.ganzhi"></tm-text></view>
								<view><tm-text :label="ditem.shishen"></tm-text></view>
							</view>
							<view v-if="mindex == 3">
								<view><tm-text :label="ditem.nongli"></tm-text></view>
								<view><tm-text :label="ditem.ganzhi"></tm-text></view>
								<view><tm-text :label="ditem.shishen"></tm-text></view>
							</view>
							<view v-if="mindex == 4">
								<view><tm-text :label="ditem.time"></tm-text></view>
								<view><tm-text :label="ditem.ganzhi"></tm-text></view>
								<view><tm-text :label="ditem.shishen"></tm-text></view>
							</view>
						</view>
					</view>
				</scroll-view>
			</tm-sheet>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { useYunStore } from '@/store/yun.ts';

const yun_store = useYunStore();
const map_list: array = [
	{
		title: '大运',
		list: 'dayun_list',
		index: 'current_index'
	},
	{
		title: '小运',
		list: 'year_list',
		index: 'year_index'
	},
	{
		title: '流月',
		list: 'month_list',
		index: 'month_index'
	},
	{
		title: '流日',
		list: 'day_list',
		index: 'day_index'
	},
	{
		title: '流时',
		list: 'time_list',
		index: 'time_index'
	}
];

function ScrollItemClick(e:number, index:number) {
	if (e > 3) return;
	const key_list = ['current_index', 'year_index', 'month_index', 'day_index', 'time_index'];
	const methods_list = ['resolveLiuYear', 'resolveLiuMonth', 'resolveLiuDay', 'resolveLiuTime'];
	yun_store[key_list[e]] = index;
	yun_store[key_list[e + 1]] = 0;
	yun_store[methods_list[e]]();
}
</script>

<style lang="scss" scoped>
.scroll-view {
	white-space: nowrap;
	width: 100%;
	margin-bottom: 20rpx;
	&-item {
		display: inline-block;
		text-align: center;
		padding: 0 10rpx;
		&-default {
			padding: 10rpx;
		}
		&-active {
			background-color: #6768ab;
			border-radius: 12rpx;
			:deep(uni-text) {
				color: #f8f8f8 !important;
			}
		}
	}
}
</style>
