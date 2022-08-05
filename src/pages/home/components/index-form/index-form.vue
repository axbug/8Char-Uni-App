<template>
	<view>
		<tm-sheet :margin="[32, 30]" :round="3" :shadow="2">
			<tm-input v-model="realname" :margin="[0, 24]" placeholder="请输入姓名" prefix="tmicon-md-person"></tm-input>

			<tm-row :gutter="0" :column="12">
				<tm-col :height="100" :col="4">
					<tm-radio-group v-model="gender">
						<tm-radio :value="0" label="男"></tm-radio>
						<tm-radio :value="1" label="女"></tm-radio>
					</tm-radio-group>
				</tm-col>
				<tm-col :height="100" :col="8">
					<tm-segtab
						v-model="model"
						:default-value="0"
						:list="[{ text: '阴历' }, { text: '四柱' }]"
						:margin="[20, 10]"
						:width="360"
					></tm-segtab>
				</tm-col>
			</tm-row>

			<tm-input
				v-model="datetimeLabel"
				:margin="[0, 12]"
				disabled
				placeholder="请选择时间"
				prefix="tmicon-calendar-alt"
				@click="SelectTime"
			></tm-input>

			<tm-input v-if="lunarLabel" v-model="lunarLabel" :margin="[0, 12]" disabled prefix="tmicon-integral"></tm-input>

			<tm-radio-group v-model="sect" class="mt-10">
				<tm-radio :value="1" label="晚子时日柱算明天"></tm-radio>
				<tm-radio :value="2" label="晚子时日柱算当天"></tm-radio>
			</tm-radio-group>

			<tm-button block label="开始排盘" @tap="Sumbit"></tm-button>
		</tm-sheet>

		<pillar-picker v-model:show="pillarSelectShow" :default-value="pillarDefaultValue" @Confirm="PillarConfirm"></pillar-picker>

		<tm-time-picker
			v-model:show="solarSelectShow"
			:default-value="solarDefaultValue"
			:end="timePick.end"
			:format="timePick.format"
			:height="750"
			:round="6"
			:showDetail="timePick.detail"
			:start="timePick.start"
			@confirm="SolarConfirm"
		></tm-time-picker>
	</view>
</template>

<script lang="ts" setup>
import {ref, watch} from "vue";
import PillarPicker from "../index-pillar-picker/index-pillar-picker.vue";
import {onLoad} from "@dcloudio/uni-app";
import {Solar} from "lunar-javascript";
import {useUserStore} from "@/store/user";
import {useBaziStore} from "@/store/bazi";
import {deleteLocalStorage, getLocalStorage, HideTimeSecond, setLocalStorage} from "@/tool/utils";
import {GetBook} from "@/model/computed";

const realname = ref("");
const gender = ref(0);
const sect = ref(1);
const model = ref(0);
const timestamp = ref(null);
const datetimeLabel = ref("");
const lunarLabel = ref(null);
const userStore = useUserStore();
const baziStore = useBaziStore();

const solarSelectShow = ref(false);
const pillarSelectShow = ref(false);

const solarDefaultValue = ref("");
const pillarDefaultValue = ref("");

const timePick = {
  start: "1900/01/01 00:00",
  end: "2099/12/30 00:00",
  format: "YYYY/MM/DD hh:MM",
  detail: {
    year: true,
    month: true,
    day: true,
    hour: true,
    minute: true,
    second: false,
  },
};

watch(model, () => PullDatatimeLabel());
watch(timestamp, () => PullDatatimeLabel());
onLoad((e:any) => {
  if (e.time) {
    timestamp.value = parseInt(e.time);
    gender.value = e.sex == 0 ? 1 : 0;
  } else {
    const cache = getLocalStorage("info");
    if (cache) {
      let data = null;
      try {
        data = JSON.parse(cache);
        realname.value = data.realname;
        gender.value = data.gender == 0 ? 1 : 0;
        timestamp.value = data.timestamp;
        sect.value = data.sect ?? 1;
      } catch (e) {
        deleteLocalStorage("info");
      }
    }
  }
});

function SelectTime() {
  const type = model.value;
  if (type === 0) {
    solarSelectShow.value = true;
  } else if (type === 1) {
    pillarSelectShow.value = true;
  }
}

const SolarConfirm = (time) => (timestamp.value = new Date(time).getTime());
const PillarConfirm = (e) => {
  timestamp.value = e.value;
  pillarSelectShow.value = false;
};

function PullDatatimeLabel() {
  const time = timestamp.value;
  if (time === null) return;
  const index = model.value;
  const solar = Solar.fromDate(new Date(time));
  const lunar = solar.getLunar();
  lunarLabel.value = `${lunar.toString()} ${lunar.getTimeZhi()}时`;
  if (index === 0) {
    let date = HideTimeSecond(time);
    datetimeLabel.value = date;
    solarDefaultValue.value = date;
  } else {
    const bazi = lunar.getEightChar();
    const list = [
      bazi.getYear(),
      bazi.getMonth(),
      bazi.getDay(),
      bazi.getTime(),
    ];
    datetimeLabel.value = list.join(" ");
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


function Sumbit() {
  const datetime = timestamp.value;
  if (datetime === null) {
    SelectTime();
    return;
  }
  const name = uni.$tm.u.isEmpty(realname.value)
      ? "不知名网友"
      : realname.value;
  const params = {
    realname: name.substr(0, 5),
    timestamp: datetime,
    gender: gender.value == 0 ? 1 : 0,
    sect: sect.value,
  };
  setLocalStorage("info", JSON.stringify(params));
  userStore.set(params);
  baziStore.pull(params);
  GetBook({
    datetime:Solar.fromDate(new Date(datetime)).toYmdHms(),
    sex:gender.value == 0 ? 1 : 0,
    sect:sect.value,
  }).then(()=>{
    uni.redirectTo({
      url: "/pages/detail/index",
    });
  }).catch(()=>{
    uni.$tm.u.toast("获取命盘古籍失败！")
  })
}
</script>
