<template>
  <view class="flex flex-row">
    <slot name="default" :data="{ data: time_data, finish: isfinish }">
      <tm-text :color="props.color" :label="text"></tm-text>
    </slot>
  </view>
</template>
<script lang="ts" setup>
import tmText from "../tm-text/tm-text.vue";
import { computed, onMounted, ref, watch } from "vue";

const emits = defineEmits(["start", "end", "change"]);
const props = defineProps({
  time: {
    type: Number,
    default: 10 * 1000,
  },
  format: {
    type: String,
    default: "DD天HH小时MM分SS秒MS毫秒",
  },
  autoStart: {
    type: Boolean,
    default: true,
  },
  color: {
    type: String,
    default: "",
  },
});
let timid: number | undefined = undefined;
let now = ref(0);
interface timeFormar {
  day: number | string;
  hour: number | string;
  minutes: number | string;
  seconds: number | string;
  millisecond: number | string;
}
let time_data = computed((): timeFormar => formatTime(props.time - now.value));

const isfinish = ref(true);

watch(
  () => now.value,
  () => {
    if (now.value == props.time || now.value === 0) {
      isfinish.value = true;
    }
  }
);
const text = computed<string>(() => {
  let ps = props.format;
  ps = ps.replace(/(DD)/g, String(time_data.value.day));
  ps = ps.replace(/(MM)/g, String(time_data.value.minutes));
  ps = ps.replace(/(HH)/g, String(time_data.value.hour));
  ps = ps.replace(/(SS)/g, String(time_data.value.seconds));
  ps = ps.replace(/(MS)/g, String(time_data.value.millisecond));
  return ps;
});
onMounted(() => {
  formatTime(props.time);
  if (props.autoStart) {
    start();
  }
});
function formatTime(my_time: number): timeFormar {
  var daysRound = Math.floor(my_time / 1000 / 60 / 60 / 24);
  var hoursRound = Math.floor((my_time / 1000 / 60 / 60) % 24);
  var minutesRound = Math.floor((my_time / 1000 / 60) % 60);
  var secondsRound = Math.floor((my_time / 1000) % 60);
  var millisecondRound = Math.floor(my_time % 1000);
  let time: timeFormar = {
    day: daysRound > 9 ? daysRound : "0" + daysRound, //天
    hour: hoursRound > 9 ? hoursRound : "0" + hoursRound, //小时,
    minutes: minutesRound > 9 ? minutesRound : "0" + minutesRound, //分.
    seconds: secondsRound > 9 ? secondsRound : "0" + secondsRound, //秒。
    millisecond: millisecondRound > 9 ? millisecondRound : "00" + millisecondRound, //毫秒。
  };
  return time;
}
// 开始或者继续。
function start() {
  clearInterval(timid);
  emits("start");
  timid = setInterval(() => {
    let lst = now.value + 50;
    if (lst > props.time) {
      clearInterval(timid);
      isfinish.value = true;
      emits("end");
      return;
    }
    isfinish.value = false;
    now.value = lst;
    emits("change", time_data);
  }, 50);
}
// 停止，直接结束。
function stop() {
  clearInterval(timid);
  now.value = props.time;
  emits("end");
}
// 暂停。
function pause() {
  clearInterval(timid);
}
// 重置。
function resinit() {
  clearInterval(timid);
  now.value = 0;
  isfinish.value = true;
}
//对外暴露的方法和属性。
defineExpose({
  finish: isfinish,
  start: start,
  stop: stop,
  pause: pause,
  resinit: resinit,
});
</script>
