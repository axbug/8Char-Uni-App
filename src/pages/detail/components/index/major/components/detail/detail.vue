<template>
  <view>
    <yx-sheet :margin="[0,0,0,10]" :padding="[20,0]">
      <view v-for="item in topDetail">
        <view class="u-flex" style="width: 100%; align-items: stretch;">
          <template v-for="(ditem, dindex) in item.data">
            <view
                class="u-text-center"
                :class="[
                    dindex === 4?'yx-border-left':'',
                    item.type==='title'?'u-p-y-10':'u-p-y-5',
                ]"
                :style="{ width: cellItemWidth }"
            >
              <view
                  class="u-col-center u-row-center yx-text-weight-b"
                  :class="[
                    item.type==='title'?'u-tips-color':'',
                    item.type==='pillar'?'u-font-40':'',
                    item.type==='pillar'?`u-type-${getElAttr(ditem)}`:'',
                  ]"
                  @click="showTips(item.type,ditem)"
              >{{ ditem }}</view>
            </view>
          </template>
        </view>
      </view>
    </yx-sheet>

    <view class="u-m-y-10 u-m-x-20">
      <view class="u-flex u-flex-1 u-col-top">
        <template v-for="item in hideList">
          <view :style="{ width: cellItemWidth }" class="u-text-center">
            <view
                v-for="zitem in item"
                :class="[
                  'u-m-y-8',
                  `u-font-${cellHideTopWidth}`,
                  `u-type-${zitem.type}`
              ]"
                class="yx-text-weight-b"
                @click="showTips('relation',zitem.label[1])"
            >{{ zitem.label[0] }}
            </view>
          </view>
        </template>
      </view>
    </view>

    <yx-sheet :margin="[0, 0]" :padding="[20, 0]">
      <view v-for="(item,index) in bottomDetail">
        <view class="u-flex" style="align-items: stretch;">
          <template v-for="(ditem, dindex) in item.data">
            <view :class="[
                 index===0?'u-p-t-20':'',
                 index===3?'u-p-b-20':'',
                 dindex === 4 ? 'yx-border-left':'',
            ]" :style="{ width: cellItemWidth }" class="u-text-center u-p-y-8">
              <view class="u-font-20 u-col-center u-row-center yx-text-weight-b" @click="showTips(item.type,ditem)">{{ ditem }}</view>
            </view>
          </template>
        </view>
      </view>

    </yx-sheet>
    <yx-book-tips ref="tips"></yx-book-tips>
  </view>
</template>

<script setup>
import {computed, ref} from "vue";
import {EightChar, LunarUtil} from "lunar-javascript";
import {firstStringToUpperCase, getElAttr, getRelation} from "@/utils/transform";
import {CHANG_SHENG_OFFSET, SHI_SHEN_SIMPLIFIE} from "@/config/offset";
import {useDetailStore} from "@/store/detail";
import {PILLAR_FIELD, TEND_STORE_FIELD} from "@/config/map";
import {useTendStore} from "@/store/tend";

const tips = ref();

const tendStore = useTendStore();
const detailStore = useDetailStore();

const fieldListKey = TEND_STORE_FIELD.map(item => item.list);
const fieldIndexKey =  TEND_STORE_FIELD.map(item => item.index);

const cellItemWidth = computed(() => 100 / tendStore.rowNum + "%");
const cellHideTopWidth = computed(() => {
  const num = tendStore.rowNum;
  const map = {
    7:22,
    8:21,
    9:20
  }
  return map[num]??21
});

const topDetail = computed(()=>{
  const start = [];
  const top = [];
  const bottom = [];
  for (let key of PILLAR_FIELD) {
    start.push(detailStore.start.main[key]);
    top.push(detailStore.top[key])
    bottom.push(detailStore.bottom[key])
  }

  for(let i = 0; i < tendStore.rowNum - 4; i++){
    const diff = new Array(3).fill('')
    const _list = tendStore[fieldListKey[i]]
    const _index = tendStore[fieldIndexKey[i]]
    if(_list[_index]?.pillar !== "童限"){
      diff[0] = getRelation(_list[_index]?.pillar[0]);
      diff[1] = _list[_index]?.pillar[0]
      diff[2] =_list[_index]?.pillar[1]
    }
    start.push(diff[0]);
    top.push(diff[1]);
    bottom.push(diff[2]);
  }

  return [
    {
      type:"title",
      data:['年柱', '月柱', '日柱', '时柱', '大运', '流年', '流月', '流日', '流时'].slice(0,tendStore.rowNum)
    },
    {
      type:"relation",
      data:start,
    },
    {
      type:"pillar",
      data:top,
    },
    {
      type:"pillar",
      data:bottom,
    }
  ];
})

const hideList = computed(()=>{
  const list = [];
  function transform(li){
    const lis = [];
    for(let label of li){
      const relation = getRelation(label)
      lis.push({
        type:getElAttr(label),
        label:[label + SHI_SHEN_SIMPLIFIE[getRelation(label)],relation]
      })
    }
    return lis;
  }

  function getHideTop(label){
    return LunarUtil.ZHI_HIDE_GAN[label]??[]
  }

  for (let key of PILLAR_FIELD) {
    list.push(transform(detailStore.bottom_hide[key]))
  }

  for(let i = 0; i < tendStore.rowNum - 4; i++){
    const _list = tendStore[fieldListKey[i]]
    const _index = tendStore[fieldIndexKey[i]]
    const li = getHideTop(_list[_index]?.pillar[1])
    list.push(transform(li))
  }

  return list;
})

const bottomDetail = computed(()=>{
  const trend = [];
  const selfsit = [];
  const empty = [];
  const nayin = [];

  for (let key of PILLAR_FIELD) {
    trend.push(detailStore.trend[key])
    selfsit.push(detailStore.selfsit[key])
    empty.push(detailStore.empty[key])
    nayin.push(detailStore.nayin[key])
  }

  for(let i = 0; i < tendStore.rowNum - 4; i++){
    const _list = tendStore[fieldListKey[i]]
    const _index = tendStore[fieldIndexKey[i]]

    let pillar = _list[_index]?.pillar
    let diff = new Array(4).fill('');
    if(pillar && pillar !== "童限"){
      let bIndex = 0
      let t;
      let tIndex = 0;
      const { lunar } = tendStore.currentLunar
      if(i === 0){
        bIndex = LunarUtil.ZHI.includes(pillar[1])? LunarUtil.ZHI.indexOf(pillar[1]) - 1 : null

        t = pillar[0]
        tIndex = LunarUtil.GAN.includes(pillar[0]) ? LunarUtil.ZHI.indexOf(pillar[1]) - 1 : null

      }else if(i === 1){
        bIndex = lunar.getYearZhiIndexByLiChun()

        t = lunar.getYearGanByLiChun()
        tIndex = lunar.getYearGanIndexByLiChun()

      }else{
        const _type = PILLAR_FIELD[i-1]
        let func = `get${firstStringToUpperCase(_type)}ZhiIndex`
        bIndex = lunar[func]()

        func = `get${firstStringToUpperCase(_type)}Gan`
        t = lunar[func]()
        func = `get${firstStringToUpperCase(_type)}GanIndex`
        tIndex = lunar[func]()
      }
      const { bazi } = tendStore.service

      diff[0] = bIndex!==null?getChangSheng(bazi.getDayGan(),bazi.getDayGanIndex(),bIndex):"";
      diff[1] = bIndex!==null?getChangSheng(t,tIndex,bIndex):"";
      diff[2] = LunarUtil.XUN_KONG[LunarUtil.getXunIndex(pillar)]??''
      diff[3] = LunarUtil.NAYIN[pillar]??''
    }

    trend.push(diff[0])
    selfsit.push(diff[1])
    empty.push(diff[2])
    nayin.push(diff[3])
  }

  return [
    {
      type:"trend",
      data:trend,
    },
    {
      type:"trend",
      data:selfsit,
    },
    {
      type:"default",
      data:empty,
    },
    {
      type:"nayin",
      data:nayin,
    },
  ];
})

function getChangSheng(top,topIndex, bottomIndex) {
  const offset = CHANG_SHENG_OFFSET[top];
  let index = offset + (topIndex % 2 === 0 ? bottomIndex : -bottomIndex);
  if (index >= 12) {
    index -= 12;
  }
  if (index < 0) {
    index += 12;
  }
  return EightChar.CHANG_SHENG[index];
}

function showTips(type,label){
  const white = ["trend","relation","nayin",]
  if(white.includes(type) && !["元男","元女"].includes(label)){
    tips.value.setDetail(type,label)
  }
}
</script>

<style lang="scss" scoped>
.yx-border-left {
  border-left: solid .125rem #f5f5f5;
}
</style>
