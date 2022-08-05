<template>
	<view>
		<view v-for="(mitem, mindex) in yunMapList" :key="mitem.index">
			<tm-sheet v-if="yunStore[mitem.list].length" :margin="[0, 0]" :padding="[8, 0]">
				<view class="pl-16" :class="{ 'mt-12': mindex == 0 }">
					<view>
						<view class="flex flex-row flex-row-center-start">
							<view><tm-icon :font-size="28" :name="icons[mindex]"></tm-icon></view>
							<view class="ml-16"><tm-text :font-size="28" :label="mitem.title" _class="text-weight-b"></tm-text></view>
						</view>
					</view>
				</view>
				<scroll-view class="scroll-view flex mt-10 mb-16" scroll-x="true">
					<!-- <tm-scrollx class="scroll-view flex mt-16" :width="734" :height="mindex>0?128:136" :show-bar="false"> -->
					<view v-for="(ditem, dindex) in yunStore[mitem.list]" class="scroll-view-item">
						<view
							:class="{
								'scroll-view-item-active': yunStore[mitem.index] === dindex
							}"
							:style="{
								backgroundColor: yunStore[mitem.index] === dindex ? scrollActiveBcolor : ''
							}"
							class="scroll-view-item-default"
							@click="ScrollItemClick(mindex, dindex)"
						>
							<template v-for="(imitem, imindex) in yunItemMapList[mindex].list">
								<view>
									<tm-text
										:font-size="22"
										:label="ditem[imitem] + yunItemMapList[mindex].suffix[imindex]"
										:color="tmStore.tmStore.dark || yunStore[mitem.index] === dindex ? 'white' : 'black'"
										_class="text-weight-b"
									></tm-text>
								</view>
							</template>
						</view>
					</view>
					<!-- </tm-scrollx> -->
				</scroll-view>
			</tm-sheet>
		</view>
		<tm-text v-if="currentSelectDate" :font-size="26" :label="currentSelectDate" class="mt-20 ml-10 text-weight-b"></tm-text>
	</view>
</template>

<script lang="ts" setup>
import {ref, computed} from "vue";
import {useYunStore} from "@/store/yun";
import {Solar} from "lunar-javascript";
import {
  yunMapList,
  yunItemMapList,
  storeIndexList,
  storeMethodsList,
} from "./map";
import {useTmpiniaStore} from "@/tmui/tool/lib/tmpinia";

const icons = ref([
  "tmicon-process",
  "tmicon-ios-grid",
  "tmicon-md-moon",
  "tmicon-ios-sunny",
  "tmicon-ios-ribbon",
]);
const tmStore = useTmpiniaStore();
const yunStore = useYunStore();
const currentSelectDate = ref("");

const scrollActiveBcolor = computed(() => {
  const currentTheme = tmStore.tmStore.color;
  return (
      tmStore.tmStore.colorList.filter((p) => p.name == currentTheme)[0]?.value ?? "#0052d9"
  );
});

yunStore.$subscribe((mutation: any, state: any) => {
  if (state.dayList.length || state.timeList.length) {
    let label = "已选日期：";
    const solar = Solar.fromDate(
        new Date(state.dayList[state.dayIndex].date)
    );
    label = label + `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日 星期${solar.getWeekInChinese()}`;

    if (state.timeList.length) {
      label = label + ` ${state.timeList[state.timeIndex].zhi}时`;
    }
    const lunar = solar.getLunar();
    label =
        label +
        `（阴历：${lunar.getYear()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}）`;
    currentSelectDate.value = label;
  } else {
    currentSelectDate.value = "";
  }
});

const ScrollItemClick = (e: number, index: number) => {
  yunStore[storeIndexList[e]] = index;
  if (e < 4) {
    yunStore[storeIndexList[e + 1]] = 0;
    yunStore[storeMethodsList[e]]();
  }
};
</script>

<style lang="scss" scoped>
.scroll-view {
	width: 100%;
	padding: 0 10rpx;
	/* #ifndef APP-NVUE */
	white-space: nowrap;
	/* #endif */
	&-item {
		/* #ifndef APP-NVUE */
		display: inline-block;
		/* #endif */
		text-align: center;
		padding: 0;

		&-default {
			padding: 10rpx;
		}

		&-active {
			border-radius: 12rpx;
			/* #ifdef H5 */
			:deep(uni-text) {
				color: #f8f8f8 !important;
			}
			/* #endif */
		}
	}
}
</style>
