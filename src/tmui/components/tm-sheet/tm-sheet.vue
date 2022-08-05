<!--
 * @Date: 2022-03-29 12:54:41
 * @LastEditors: tmzdy
 * @Author: tmzdy
 * @Description: 文件
-->
<template>
  <view
    :hover-class="(props.url ? ' opacity-7 ' : '  ') + props.hoverClass"
    
    v-if="_blue_sheet"
    :blurEffect="_blurEffect"
    @click="onClick"
    @longpress="longpress"
    @touchend="touchend"
    @touchstart="touchstart"
    @touchcancel="touchcancel"
    @mousedown="mousedown"
    @mouseup="mouseup"
    @mouseleave="mouseleave"
    :class="[
      'flex flex-col noNvueBorder',
      parenClass_p,
      !isDisabledRoundAndriod ? `round-${props.round}` : '',
    ]"
    :style="[
      {
        marginLeft: _margin[0] + 'rpx',
        marginTop: _margin[1] + 'rpx',
        marginRight: _margin[2] + 'rpx',
        marginBottom: _margin[3] + 'rpx',
        paddingLeft: _padding[0] + 'rpx',
        paddingTop: _padding[1] + 'rpx',
        paddingRight: _padding[2] + 'rpx',
        paddingBottom: _padding[3] + 'rpx',
      },
      _height_real ? { height: _height + props.unit } : '',
      _width_real ? { width: _width + props.unit } : '',
      tmcomputed.borderCss,
      _blur && store.tmStore.os == 'ios' && _isNvue === true ? '' : _bgcolor,
      !_transprent && props.shadow > 0 ? tmcomputed.shadowColor : '',
      !_transprent && _blur ? { backdropFilter: 'blur(6px)' } : '',
      customCSSStyle,
    ]"
  >
    <view
      
      :class="['flex noNvueBorder flex-col flex-1', customClass]"
      :style="contStyle_p"
    >
      <slot></slot>
    </view>
  </view>
</template>
<script lang="ts" setup>
/**
 * 基础容器
 * @description 提供了基础窗口布局，以代替view进行布局，可随意修改样式。
 */
import {
  getCurrentInstance,
  computed,
  ref,
  provide,
  watch,
  PropType,
  nextTick,
} from "vue";
import { cssstyle, tmVuetify } from "../../tool/lib/interface";
import {
  custom_props,
  computedTheme,
  computedClass,
  computedStyle,
  computedDark,
} from "../../tool/lib/minxs";
import { useTmpiniaStore } from "../../tool/lib/tmpinia";
const store = useTmpiniaStore();
// 混淆props共有参数
const props = defineProps({
  ...custom_props,
  parenClass: {
    type: String,
    default: "",
  },
  contStyle: {
    type: String,
    default: "",
  },
  height: {
    type: [Number],
    default: 0,
  },
  width: {
    type: [Number],
    default: 0,
  },
  color: {
    type: String,
    default: "white",
  },
  transprent: {
    type: [Boolean, String],
    default: false,
  },

  border: {
    type: [Number, String],
    default: 0,
  },
  margin: {
    type: Array as PropType<Array<number>>,
    default: () => [32],
  },
  padding: {
    type: Array as PropType<Array<number>>,
    default: () => [24],
  },
  unit: {
    type: String,
    default: "rpx",
  },
  hoverClass: {
    type: String,
    default: "none",
  },
  //暗下强制的背景色，
  //有时自动的背景，可能不是你想要暗黑背景，此时可以使用此参数，强制使用背景色，
  //只能是颜色值。
  darkBgColor: {
    type: String,
    default: "",
  },
  //不是同层背景，默认是同层，为false
  //如果输入框表单与tmshee在同一层下。他们的黑白暗黑背景色是相同的。为了区分这个问题，需要单独指示，以便区分背景同层。
  //主意：它只在黑和白之间的色系才起作用，其它颜色下不起作用。
  noLevel: {
    type: Boolean,
    default: false,
  },
  //是否开启磨砂背景。只有是黑白灰色系才能使用。
  blur: {
    type: Boolean,
    default: false,
  },
  url: {
    type: String,
    default: "",
  },

});
const emits = defineEmits([
  "click",
  "longpress",
  "touchend",
  "touchstart",
  "touchcancel",
  "mousedown",
  "mouseup",
  "mouseleave",
]);
const proxy = getCurrentInstance()?.proxy ?? null;
const parenClass_p = computed(() => props.parenClass);
const contStyle_p = computed(() => props.contStyle);
const _transprent = computed(() => props.transprent);

// 设置响应式全局组件库配置表。
const tmcfg = computed(() => store.tmStore);
const _blur = computed(() => {
  //安卓平台没有这功能
  if (tmcfg.value.os == "android" && _isNvue.value) {
    return false;
  }
  return props.blur;
});
//自定义样式：
const customCSSStyle = computed(() => computedStyle(props));
//自定类
const customClass = computed(() => computedClass(props));
//是否暗黑模式。
const isDark = computed(() => computedDark(props, tmcfg.value));
//计算主题
const tmcomputed = computed<cssstyle>(() => {
  let text = props.text;
  if (_blur.value && tmcfg.value.os == "ios" && _isNvue.value) {
    text = true;
  }
  let _props_rs = uni.$tm.u.deepClone(props)
  const customPropsDefault = uni.$tm.u.deepObjectMerge(_props_rs,{blur: _blur.value, text: text })
  return computedTheme(
    customPropsDefault,
    isDark.value,
    tmcfg.value
  );
});
const _isNvue = ref(false);
// #ifdef APP-NVUE
_isNvue.value = true;
// #endif
/** 数组是左，上，右，下顺序。 */
const _margin = computed(() => {
  if (props.margin.length == 1)
    return [props.margin[0], props.margin[0], props.margin[0], props.margin[0]];
  if (props.margin.length == 2)
    return [props.margin[0], props.margin[1], props.margin[0], props.margin[1]];
  if (props.margin.length == 3)
    return [props.margin[0], props.margin[1], props.margin[2], 0];
  if (props.margin.length == 4)
    return [props.margin[0], props.margin[1], props.margin[2], props.margin[3]];
  return [0, 0, 0, 0];
});
const _padding = computed(() => {
  if (props.padding.length == 1)
    return [props.padding[0], props.padding[0], props.padding[0], props.padding[0]];
  if (props.padding.length == 2)
    return [props.padding[0], props.padding[1], props.padding[0], props.padding[1]];
  if (props.padding.length == 3)
    return [props.padding[0], props.padding[1], props.padding[2], 0];
  if (props.padding.length == 4)
    return [props.padding[0], props.padding[1], props.padding[2], props.padding[3]];
  return [0, 0, 0, 0];
});

const _width = computed(() => props.width + _padding.value[0] + _padding.value[2]);
const _height = computed(() => props.height + _padding.value[1] + _padding.value[3]);
const _width_real = computed(() => props.width);
const _height_real = computed(() => props.height);
const _noLevel = computed(() => props.noLevel);

const _blue_sheet = ref(true);
const _blurEffect = computed(() => {
  if (props.blur === true && isDark.value) return "dark";
  if (props.blur === true && !isDark.value) return "extralight";
  return "none";
});
watch(
  () => isDark.value,
  () => {
    // #ifdef APP-NVUE
    //在ios下。如果切换带有磨砂效果时，如果不触发发更新视图，页面是不会更改。
    if (store.tmStore.os == "ios" && _blur.value === true) {
      _blue_sheet.value = false;
      nextTick(() => (_blue_sheet.value = true));
    }
    // #endif
    
  }
);
const _bgcolor = computed(() => {
  if (_transprent.value === true) return `background-color:rgba(255,255,255,0);`;
  if (props.darkBgColor !== "" && isDark.value === true) {
    return `background-color:${props.darkBgColor};`;
  }
  
  if (props.linearColor.length==2) {
    return { 'background-image': `linear-gradient(${tmcomputed.value.linearDirectionStr},${props.linearColor[0]},${props.linearColor[1]})` }
  }
  if ( tmcomputed.value.gradientColor?.length==2) {
    return tmcomputed.value.backgroundColorCss;
  }

  if (
    _noLevel.value &&
    tmcomputed.value.isBlackAndWhite === true &&
    isDark.value === true
  ) {
    return `background-color: ${tmcomputed.value.inputcolor}`;
  }
  return `background-color: ${tmcomputed.value.backgroundColor}`;
});
//当前是否点按，因为uniapp的hover-class在安卓端有bug，因此采用自定事件来定义hover类。
const isLongPress = ref(false);
function longpress(e: Event) {
  isLongPress.value = true;
  emits("longpress", e);
}
function touchstart(e: Event) {
  isLongPress.value = true;
  emits("touchstart", e);
}
function touchend(e: Event) {
  isLongPress.value = false;
  emits("touchend", e);
}
function touchcancel(e: Event) {
  isLongPress.value = false;
  emits("touchcancel", e);
}
function mousedown(e: Event) {
  isLongPress.value = true;
  emits("mousedown", e);
}
function mouseup(e: Event) {
  isLongPress.value = false;
  emits("mouseup", e);
}
function mouseleave(e: Event) {
  isLongPress.value = false;
  emits("mouseleave", e);
}

function onClick(e: Event) {
  emits("click", e);
  if (typeof props.url === "string" && props.url) {
    uni.navigateTo({
      url: props.url,
      fail(result) {
        console.log(result);
      },
    });
  }
}

const c_w = computed(() => {
  let w = parseFloat(String(_width.value)) - parseFloat(String(props.padding[0]));
  // #ifndef APPNVUE
  w = w - parseFloat(String(props.border)) * 2;
  // #endif
  // #ifdef APPNVUE
  w = w - parseFloat(String(props.border));
  // #endif
  return w;
});
const c_h = computed(() => {
  let h = parseFloat(String(_height.value)) - parseFloat(String(props.padding[1]));
  // #ifndef APPNVUE
  h = h - parseFloat(String(props.border)) * 2;
  // #endif
  // #ifdef APPNVUE
  h = h - parseFloat(String(props.border));
  // #endif
  return h;
});
// 设置响应式主题文字色。
let textColor = computed(() => {
  return tmcomputed.value.textColor;
});
provide("appTextColor", textColor);
</script>

<style scoped>
/* #ifdef H5 */
.webpc {
  cursor: pointer;
}
/* #endif */
/* #ifndef APP-NVUE */
.noNvueBorder {
  box-sizing: border-box;
}
/* #endif */
</style>
