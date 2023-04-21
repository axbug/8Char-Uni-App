<template>
  <view>
    <template v-for="(ditem, dindex) in detail">
      <view class="u-flex u-col-top u-p-y-16" :class="{'bg-white':dindex%2===0}">
        <view v-for="(kitem, kindex) in ['label', 'year', 'month', 'day', 'time']" :class="{ left: kindex === 0 }" class="item">
          <text class="yx-text-weight-b" v-if="kindex === 0 || ditem.type === 'default'" @click="showTips(ditem.key,ditem.data[kitem])">{{ ditem.data[kitem] }}</text>
          <view
              v-else-if="ditem.type === 'pillar'"
              class="u-flex u-row-center u-col-center"
          >
            <view
                :class="GetPillarColor(ditem.data[kitem], dindex)"
                class="yx-text-weight-b u-font-44"
            >{{ ditem.data[kitem] }}</view>
            <view class="u-m-l-4">
              <u-icon :name="GetIconUrl(ditem.data[kitem])" :size="40"></u-icon>
            </view>
          </view>
          <view
              v-else-if="ditem.type === 'list'"
              v-for="citem in ditem.data[kitem]"
              class="yx-text-weight-b u-m-b-8"
              :class="[
                ditem.key === 'bottom_hide' ? `u-type-${getElAttr(citem)}` : '',
                ditem.key === 'gods' ? `u-type-primary` : ''
              ]"
              @click="showTips(ditem.key,citem)"
          >{{ citem + (ditem.key==='bottom_hide'?getElAttr(citem,'label'):'') }}</view>
        </view>
      </view>
    </template>
    <yx-book-tips ref="tips"></yx-book-tips>
  </view>
</template>

<script setup>
import {computed, ref} from 'vue';
import {useDetailStore} from "@/store/detail";
import {getElAttr} from "@/utils/transform";
import {getUrl} from "@/utils/file";

const detailStore = useDetailStore();
const tips = ref();

const detail = computed(()=>{
  const map = [
    {label:"主星",key:"main"},{label:"天干",key:"top"},{label:"地支",key:"bottom"},
    {label:"藏干",key:"bottom_hide"},{label:"副星",key:"assiste"},{label:"星运",key:"trend"},
    {label:"自坐",key:"selfsit"},{label:"纳音",key:"nayin"},{label:"空亡",key:"empty"},{label:"神煞",key:"gods"}
  ];
  const list = [
    {
      type:"default",
      data:{
        label: '\\',year: '年柱',month: '月柱',day: '日柱',time: '时柱'
      },
    },
  ];

  for(let item of map){
    const data = {
      type:"default",
      data:{
        label:"",year: '',month: '',
        day: '',time: ''
      }
    }
    if(["main","assiste"].includes(item.key)){
      data.data = detailStore.start[item.key];
      data.type = item.key === "main" ? "default" : "list";
    }else if(["top","bottom"].includes(item.key)){
      data.type = "pillar";
      data.data = detailStore[item.key];
    }else if(["bottom_hide","gods"].includes(item.key)){
      data.type = "list"
      data.data = detailStore[item.key];
    }else{
      data.data = detailStore[item.key];
    }
    data.key = item.key
    data.data.label = item.label;
    list.push(data)
  }
  return list
});

function GetPillarColor(str) {
  return [`u-type-${getElAttr(str)}`,];
}

function GetIconUrl(str) {
  return getUrl(`static/icon/element/${getElAttr(str,'index')}.svg`);
}

function showTips(type,label){
  const white = {
    main:"relation",
    trend:"trend",
    selfsit:"trend",
    assiste:"relation",
    nayin:"nayin",
    gods:"gods"
  };
  if(white[type] && !["元男","元女"].includes(label)){
    tips.value.setDetail(white[type],label)
  }
}
</script>

<style lang="scss" scoped>
.item {
  width: 22%;
  text-align: center;
}

.left {
  width: 12%;
  text-align: center;
}

.bg-white{
  //background: #ffffff;
  //border: 0px solid rgb(230, 230, 230);
  //box-shadow: rgba(51, 51, 51, 0.07) 0px 0.15625rem 0.375rem;
}
</style>
