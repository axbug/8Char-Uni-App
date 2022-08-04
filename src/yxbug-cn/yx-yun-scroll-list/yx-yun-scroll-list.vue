<template>
	<view>
		<view v-for="(mitem, mindex) in yun_map_list" :key="mitem.index">
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
							<template v-for="(imitem, imindex) in yun_item_map_list[mindex].list">
								<view><tm-text :label="ditem[imitem] + yun_item_map_list[mindex].suffix[imindex]"></tm-text></view>
							</template>
						</view>
					</view>
				</scroll-view>
			</tm-sheet>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref,computed } from 'vue';
import { useYunStore } from '@/store/yun.ts';
import {yun_map_list,yun_item_map_list,store_index_list,store_methods_list} from './map.ts'
import { useTmpiniaStore } from '@/tmui/tool/lib/tmpinia';

const tm_store = useTmpiniaStore();
const yun_store = useYunStore();

const scroll_active_bcolor = computed(()=>{
	const current_theme = tm_store.tmStore.color
	return tm_store.tmStore.colorList.filter(p => p.name == current_theme)[0]?.value??"#0052d9"
});


const ScrollItemClick = (e: number, index: number)=> {
	if (e > 3) return;
	yun_store[store_index_list[e]] = index;
	yun_store[store_index_list[e + 1]] = 0;
	yun_store[store_methods_list[e]]();
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
			background-color: v-bind(scroll_active_bcolor);
			border-radius: 12rpx;
			:deep(uni-text) {
				color: #f8f8f8 !important;
			}
		}
	}
}
</style>
