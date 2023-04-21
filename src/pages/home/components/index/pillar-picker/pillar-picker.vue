<template>
  <u-popup
      ref="drawer"
      v-model="_show"
      mode="bottom"
      placement="bottom"
      @close="DrawerClose"
      @update:show="_show = $event"
  >
    <view class="u-text-center u-m-y-30">
      <text class="yx-text-weight-b">{{ isPillar ? '请选择四柱进行检索' : '选择时间进行排盘' }}</text>
    </view>

    <view v-if="isPillar">
      <u-tabs
          v-model="tabCurrent"
          :list="tabsList"
          :show-bar="false"
          class="u-m-b-20"
          swiper
          @change="TabsChange"
      ></u-tabs>

      <view class="u-flex u-row-top-center u-p-x-30" style="flex-flow: row wrap;">
        <view
            v-for="(item, index) in list"
            :key="item + index"
            class="u-m-b-20 u-flex u-row-center u-col-center"
            style="width:25%;"
            @click="PickerClick(index)"
        >
          <u-avatar :text="item" bg-color="#2979ff" style="color: #F8F8F8;"></u-avatar>
        </view>
      </view>

      <view class="u-p-30">
        <u-button type="primary" @click="GetSiZhu">检索四柱</u-button>
      </view>
    </view>

    <view v-else>
      <view class="u-picker-body">
        <picker-view
            :value="selectIndex"
            class="u-picker-view"
            indicator-style="height:100rpx;"
            @change="timeChange"
        >
          <picker-view-column>
            <view v-for="(item, index) in selectList" :key="index" class="u-column-item">
              <view class="u-line-1">{{ item.text }}</view>
            </view>
          </picker-view-column>
        </picker-view>
      </view>

      <view class="u-p-30">
        <u-button type="primary" @click="Confirm">确认选择</u-button>
      </view>
    </view>
  </u-popup>
</template>

<script setup>
import {getCurrentInstance, nextTick, onMounted, ref, watch, watchEffect} from "vue";
import {LunarUtil, Solar} from "lunar-javascript";
import {deleteFirstElement} from "@/utils/transform";

const TOPS = deleteFirstElement(LunarUtil.GAN);
const BOTTOMS = deleteFirstElement(LunarUtil.ZHI);

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
const selectIndex = ref([0]);

watchEffect(() => {
  _show.value = props.show;
  nextTick()
});

watch(
    () => props.defaultValue,
    (val) => {
      if (val !== "" && val.length === 8) {
        list.value = val.split("");
      }
    }
);

onMounted(() => {
  const model = tabCurrent.value > 3 ? TOPS : BOTTOMS;
  const _list = [];
  for (let i = 0; i < model.length; i++) {
    const key = model[i];
    _list.push({key: key + i, name: key});
  }
  tabsList.value = _list;
  PullTabs(0);
});

function PickerClick(i) {
  pickerCurrent.value = i;
  PullTabs(i);
}

function TabsChange(e) {
  tabCurrent.value = e;
  const picker = pickerCurrent.value;
  if (tabsList.value[e]?.name) {
    list.value[picker] = tabsList.value[e].name;
  }
}

function PullTabs(e) {
  const top = TOPS;
  const bottom = BOTTOMS;
  const _list = [];
  const model = e > 3 ? bottom : top;
  for (let i = 0; i < model.length; i++) {
    const key = model[i];
    _list.push({key: i, name: key});
  }
  tabsList.value = _list;
  nextTick();
  TabsChange(model.indexOf(list.value[e]));
}

function Confirm() {
  const index = selectIndex.value[0];
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

function timeChange() {
  // console.log(arguments)
}
</script>

<style lang="scss" scoped>
.u-picker-body {
  width: 100%;
  height: 500rpx;
  overflow: hidden;
  background-color: #fff;
}

.u-picker-view {
  height: 100%;
  box-sizing: border-box;
}

.u-column-item {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: $u-main-color;
  padding: 0 8rpx;
}

:deep(.u-avatar){
  color:#F8F8F8 !important;
}
</style>
