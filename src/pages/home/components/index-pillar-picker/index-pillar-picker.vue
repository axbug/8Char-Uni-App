<template>
	<tm-drawer
		ref="drawer"
		v-model:show="_show"
		:height="558"
		:round="6"
		hideHeader
		ok-text="选择"
		placement="bottom"
		@close="DrawerClose"
		@update:show="_show = $event"
	>
		<view class="flex flex-row-center-center">
			<tm-text :label="isPillar ? '请选择四柱进行检索' : '选择时间进行排盘'" align="center" class="pt-30 pb-20 text-weight-b"></tm-text>
		</view>

		<view v-if="isPillar" id="pillar-view">
			<tm-tabs
				v-model:active-name="tabCurrent"
				:align="tabsList.length > 10 ? 'left' : 'around'"
				:item-font-size="25"
				:list="tabsList"
				:width="710"
				class="mb-20 mx-20"
				swiper
				@change="TabsChange"
			></tm-tabs>

			<view class="flex flex-row flex-row-top-center px-30" style="flex-flow: row wrap;">
				<view
					v-for="(item, index) in list"
					:key="item + index"
					class="mb-20 flex flex-row-center-center"
					@click="PickerClick(index)"
					style="width:25%;"
				>
					<tm-avatar :label="item" :round="12" text></tm-avatar>
				</view>
			</view>

			<view class="px-30"><tm-button block label="检索四柱" @click="GetSiZhu"></tm-button></view>
		</view>

		<view v-else>
			<tm-picker-view v-model="selectIndex" :columns="selectList" :height="328"></tm-picker-view>
			<view class="px-30 mt-20"><tm-button block label="确认选择" @click="Confirm"></tm-button></view>
		</view>
	</tm-drawer>
</template>

<script lang="ts" setup>
import {getCurrentInstance, nextTick, onMounted, ref, watch, watchEffect } from "vue";
import {Solar} from "lunar-javascript";
import {dizhiList, tianganList} from "@/config/common.ts";

const {proxy} = getCurrentInstance();

const emits = defineEmits(["update:show", "Confirm"]);
const props = defineProps({
  show: {
    type: Boolean,
    default: () => {
      return false;
    },
  },
  defaultValue: {
    type: String,
    default: "",
  },
});

const _show = ref(props.show);

const tabCurrent = ref(0);
const pickerCurrent = ref(0);

const isPillar = ref(true);

const list = ref(["甲", "甲", "甲", "甲", "子", "子", "子", "子"]);
const tabsList = ref([]);
const selectList = ref([]);
const selectIndex = ref(0);

watchEffect(() => {
  _show.value = props.show;
	nextTick()
});

watch(
    () => props.defaultValue,
    (val) => {
      if (val != "" && val.length == 8) {
        list.value = val.split("");
      }
    }
);

onMounted(() => {
  const model = tabCurrent.value > 3 ? dizhiList : tianganList;
  const _list = [];
  for (let i = 0; i < model.length; i++) {
    const key = model[i];
    _list.push({key: key + i, title: key});
  }
  tabsList.value = _list;
  PullTabs(0);
});

function PickerClick(i: number) {
  pickerCurrent.value = i;
  PullTabs(i);
}

function TabsChange(e: number) {
  tabCurrent.value = e;
  const picker = pickerCurrent.value;
  if (tabsList.value[e]?.title) {
    list.value[picker] = tabsList.value[e].title;
  }
}

function PullTabs(e: number) {
  const tian = tianganList;
  const di = dizhiList;
  const _list = [];
  const model = e > 3 ? di : tian;
  for (let i = 0; i < model.length; i++) {
    const key = model[i];
    _list.push({key: i, title: key});
  }
  tabsList.value = _list;
  nextTick();
  TabsChange(model.indexOf(list.value[e]));
}

function Confirm() {
  const index = selectIndex.value;
  isPillar.value = true;
  emits("Confirm", selectList.value[index]);
  proxy.$refs.drawer.close();
}

function DrawerClose() {
  isPillar.value = true;
  selectList.value = [];
  emits("update:show", false);
}

function GetSiZhu() {
  const _list_ = list.value;
  const year = _list_[0] + _list_[4];
  const month = _list_[1] + _list_[5];
  const day = _list_[2] + _list_[6];
  const time = _list_[3] + _list_[7];
  const result = Solar.fromBaZi(year, month, day, time, 2, 0);
  if (result.length) {
    const _list = [];
    for (let i = 0; i < result.length; i++) {
      const item = result[i];
      const datetime = item.toYmdHms();
      const timestamp = new Date(
          datetime.replace(/-/g, "/").replace(/T/g, " ")
      ).getTime();
      _list.push({text: datetime, value: timestamp});
    }
    selectList.value = _list;
    isPillar.value = false;
  } else {
    uni.showToast({
      title: "四柱检索异常，请检查！",
      icon: "none",
    });
  }
}
</script>
