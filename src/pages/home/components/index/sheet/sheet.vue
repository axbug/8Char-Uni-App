<template>
  <view>
    <yx-sheet :margin="[32, 30]" :round="3">
      <u-form :model="form">
        <u-form-item :border-bottom="false">
          <yx-input v-model="form.realname" border placeholder="请输入姓名（可空）">
            <template #icon>
              <u-icon name="account-fill"></u-icon>
            </template>
          </yx-input>
        </u-form-item>
        <u-form-item :border-bottom="false">
          <u-row style="width: 100%;">
            <u-col :span="6">
              <u-radio-group v-model="form.gender">
                <u-radio
                    v-for="item in options.gender"
                    :name="item.value"
                >{{ item.label }}
                </u-radio>
              </u-radio-group>
            </u-col>
            <u-col :span="6">
              <u-subsection
                  v-model="form.model"
                  :list="options.model"
                  @change="handleSubSectionChange"
              ></u-subsection>
            </u-col>
          </u-row>
        </u-form-item>
        <u-form-item :border-bottom="false">
          <yx-input
              v-model="form.datetimeLabel"
              margin="12"
              disabled
              placeholder="请选择时间"
              @click="SelectTime"
          >
            <template #icon>
              <u-icon name="calendar-fill"></u-icon>
            </template>
          </yx-input>
        </u-form-item>
        <u-form-item v-if="form.lunarLabel" :border-bottom="false">
          <yx-input
              v-model="form.lunarLabel"
              margin="12"
              disabled
          >
            <template #icon>
              <u-icon name="tags-fill"></u-icon>
            </template>
          </yx-input>
        </u-form-item>
        <u-form-item :border-bottom="false">
          <u-radio-group v-model="form.sect">
            <u-radio
                v-for="item in [{value:1,label:'晚子时日柱算明天'},{value:2,label:'晚子时日柱算当天'},]"
                :name="item.value"
            >{{ item.label }}
            </u-radio>
          </u-radio-group>
        </u-form-item>
        <u-button class="u-m-t-10 u-m-b-10" type="primary" @click="Sumbit">开始排盘</u-button>
      </u-form>
    </yx-sheet>

    <pillar-picker v-model:show="pillarSelectShow" :default-value="pillarDefaultValue"
                   @Confirm="PillarConfirm"></pillar-picker>
    <u-picker
        v-model="solarSelectShow"
        :params="{
                year: true,
                month: true,
                day: true,
                hour: true,
                minute: true,
                second: false
              }"
        end-year="2100"
        mode="time"
        start-year="1900"
        @confirm="SolarConfirm"
    ></u-picker>
  </view>
</template>

<script setup>
import {reactive, ref, watch} from "vue";
import PillarPicker from "../pillar-picker/pillar-picker.vue";
import {onLoad} from "@dcloudio/uni-app";
import {Solar} from "lunar-javascript";
import {deleteLocalStorage, getLocalStorage, setLocalStorage} from "@/utils/cache";
import {GetBook, GetInfo} from "@/api/default";
import {useDetailStore} from "@/store/detail";
import {timeFormat} from "@/utils/transform";
import {toDetail} from "@/utils/router";
import {useTendStore} from "@/store/tend";

const options = ref({
  gender:[{value:1,label:'男'},{value:2,label:'女'},],
  model:[{ name: '阴历' }, { name: '四柱' }]
})

const form = reactive({
  realname: "",
  gender: 1,
  model: 0,
  sect: 1,
  timestamp: null,
  datetimeLabel: null,
  lunarLabel: null,
})

const detailStore = useDetailStore();
const tendStore = useTendStore();

const solarSelectShow = ref(false);
const pillarSelectShow = ref(false);

const solarDefaultValue = ref("");
const pillarDefaultValue = ref("");

const handleSubSectionChange = index=>{
  form.model = index
}

watch(() => [form.model, form.timestamp], () => {
  PullDatatimeLabel()
});

onLoad((e) => {
  if (e.time) {
    form.timestamp = parseInt(e.time);
    form.gender = e.gender === 1 ? 1 : 2;
  } else {
    const cache = getLocalStorage("info");
    if (cache) {
      let data = null;
      try {
        data = JSON.parse(cache);
        form.realname = data.realname;
        form.gender = data.gender === 1 ? 1 : 2;
        form.timestamp = data.timestamp;
        form.sect = data.sect ?? 1;
      } catch (e) {
        deleteLocalStorage("info");
      }
    }
  }
});

function SelectTime() {
  const type = form.model;
  if (type === 0) {
    solarSelectShow.value = true;
  } else if (type === 1) {
    pillarSelectShow.value = true;
  }
}

const SolarConfirm = (params) => {
  const {year, month, day, hour, minute} = params
  const time = `${year}/${month}/${day} ${hour}:${minute}`;
  form.timestamp = new Date(time).getTime();
}
const PillarConfirm = (e) => {
  form.timestamp = e.value;
  pillarSelectShow.value = false;
};

function PullDatatimeLabel() {
  const time = form.timestamp;
  if (time === null) return;
  const index = form.model;
  const solar = Solar.fromDate(new Date(time));
  const lunar = solar.getLunar();
  form.lunarLabel = `${lunar.toString()} ${lunar.getTimeZhi()}时`;
  if (index === 0) {
    const date = timeFormat(time);
    form.datetimeLabel = date;
    solarDefaultValue.value = date;
  } else {
    const bazi = lunar.getEightChar();
    const list = [
      bazi.getYear(),
      bazi.getMonth(),
      bazi.getDay(),
      bazi.getTime(),
    ];
    form.datetimeLabel = list.join(" ");
    pillarDefaultValue.value = [
      bazi.getYear()[0],
      bazi.getMonth()[0],
      bazi.getDay()[0],
      bazi.getTime()[0],
      bazi.getYear()[1],
      bazi.getMonth()[1],
      bazi.getDay()[1],
      bazi.getTime()[1],
    ].join("");
  }
}


async function Sumbit() {
  const datetime = form.timestamp;
  if (datetime === null) {
    SelectTime();
    return;
  }
  const name = uni.$u.test.isEmpty(form.realname) ? "不知名网友" : form.realname;

  const payload = {
    realname: name,
    timestamp: datetime,
    gender: form.gender,
    sect: form.sect,
  }

  detailStore.set(payload)

  setLocalStorage("info", JSON.stringify(payload));

  await GetInfo(detailStore.defaultPayload).then(res=>{
    detailStore.set(res)
    tendStore.pull(payload);
  })
  GetBook(detailStore.defaultPayload).then(() => {
    toDetail()
  }).catch(() => {
    uni.$u.toast("获取命盘古籍失败！")
  })
}
</script>

<style scoped>
.u-form-item {
  padding: 0.375rem 0;
}
</style>
