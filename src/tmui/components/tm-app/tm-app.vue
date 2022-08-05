<template>
  <view class="flex flex-col relative app" :style="[
    appConfig.theme? { background: _tranparent?'':appConfig.theme } : '',
    { 
      width: appConfig.width + 'px', 
      minHeight: appConfig.height + 'px',
      backgroundSize: `100% ${appConfig.height}px`
     },
     _bgImg?{backgroundImage:`url(${_bgImg})`}:''
  ]">
    <view :class="[blur ? 'blur' : '']" ref="bodyEl" class="flex flex-col flex-1" :style="[
      {
        zIndex: 1,
        width: appConfig.width + 'px',
        minHeight: appConfig.height + 'px',
      },
      blur
        ? { backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(248, 248, 248, 0.7)' }
        : '',
    ]">
      <slot name="default">
        <text>在这里放置内容</text>
      </slot>
    </view>
    <view :blurEffect="_blurEffect" @click.stop="toogleOpen(false)" ref="menuEl" :class="[_showMenu ? 'menuOn' : '']"
      class="fixed l-0 t-0 menu" :style="{
        width: appConfig.width + 'px',
        height: appConfig.height + 'px',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(3px)',
      }">
      <view v-if="_showMenu" :style="{
        width: appConfig.width * 0.7 + 'px',
        height: appConfig.height + 'px',
        boxShadow: '3px 0 16px rgba(0,0,0,0.3)',
      }">
        <scroll-view @click.stop="" :scroll-y="true" :style="{
          width: appConfig.width * 0.7 + 'px',
          height: appConfig.height + 'px',
        }">
          <slot name="menu" :sys="{ width: appConfig.width * 0.7, height: appConfig.height }"></slot>
        </scroll-view>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>


/**
 * 应用容器
 * @description 这是所有创建应用的最外层基础容器。
 */
import { provide, getCurrentInstance, computed, onMounted, ref, watch, onBeforeMount, PropType } from "vue";
import { useTmpiniaStore } from "../../tool/lib/tmpinia";
import { colorThemeType, cssstyle, tmVuetify } from "../../tool/lib/interface";
import { getWindow } from "../../tool/function/util";
import { custom_props, computedTheme, computedClass, computedStyle, computedDark, } from "../../tool/lib/minxs";
import { onShow, onLoad, onInit } from "@dcloudio/uni-app";

import tmSheet from "../tm-sheet/tm-sheet.vue";
// #ifdef APP-PLUS-NVUE
const animation = uni.requireNativePlugin("animation");
// #endif
const emits = defineEmits(["update:showMenu"]);
//请在scr/目录下创建一个router/index.ts路由,见文档：https://tmui.design/doc/JSTool/router.html
const store = useTmpiniaStore();
const proxy = getCurrentInstance()?.proxy ?? null;
//路由守卫---------------------------------

// end-----------------------------------------
// 混淆props共有参数
const props = defineProps({
  ...custom_props,
  	/**
	 * 是否透明背景
	 */
	transprent: {
		type: [Boolean, String],
		default: false
	},
	/**
	 * 是否透明背景,等同transprent,因单词拼写错误，现在写一个正确的。
	 */
	transparent: {
		type: [Boolean, String],
		default: false
	},
  //整体的主题色调同全局色一样。
  /**暂时不可用 */
  theme: {
    type: String,
    default: "grey-5",
  },
  bgImg: {
    type: String,
    default: "",
  },
  //应用的背景颜色。
  color: {
    type: String,
    default: "grey-4",
  },
  /**自定义暗黑的背景，你也可以通过全局配置 */
  darkColor: {
    type: String,
    default: "#050505",
  },
  /**是否模糊背景，暂时不可用 */
  blur: {
    type: [Boolean, String],
    default: false,
  },
  /**这是一个淘汰的属性，请在pages.json中配置即可，会自动读取。而不需要在这里设置 */
  navbar: {
    type: Object as PropType<{ background: string; fontColor: "#ffffff" | "#000000" }>,
    default: () => {
      return {
        background: "",
        fontColor: "",
      };
    },
  },
  showMenu: {
    type: Boolean,
    default: false,
  },
});
// 设置响应式全局组件库配置表。
const tmcfg = computed(() => store.tmStore);
const isSetThemeOk = ref(false);
//自定义样式：
// const customCSSStyle = computed(()=>computedStyle(props));
//自定类
// const customClass = computed(()=>computedClass(props));
//是否暗黑模式。
const isDark = computed(() => computedDark(props, tmcfg.value));
//计算主题
const tmcomputed = computed<cssstyle>(() =>
  computedTheme(props, isDark.value, tmcfg.value)
);
const _showMenu = ref(props.showMenu);
const sysinfo = getWindow();
const sysinfoRef = ref(sysinfo);
const _bgImg = computed(()=>props.bgImg)
const _tranparent = computed(()=>props.transparent||props.transprent)
// #ifdef H5
window.addEventListener("resize", () => {
  throttle(() => {
    sysinfoRef.value = getWindow();
  });
});
// #endif

// 视窗的宽。
const view_width = ref(sysinfo.width);
//视窗的高度。
let view_height = ref(sysinfo.height);
let timids: any = NaN;
let flag = false;
//本页面是否是tabar切换页面。
let isTabbarPage = false;
let nowPage = getCurrentPages().pop();

/**设定ios下的模糊效果 */
const _blurEffect = computed(() => {
  if (props.blur === true && isDark.value) return "dark";
  if (props.blur === true && !isDark.value) return "extralight";
  return "none";
});

/**整体的配置 */
let appConfig = ref({
  width: view_width,
  height: view_height,
  theme: tmcomputed.value.backgroundColor,
  bgImg: props.bgImg,
  dark: isDark.value,
});

onLoad((opts: any) => {
  try {
    store.tmuiConfig.router?.useTmRouterAfter({
      path: nowPage?.route ?? "",
      opts: opts,
      context: proxy ?? null,
    });
  } catch (error) { }
});
onMounted(() => {
  _onInit()
})

function _onInit() {
  /**
 * 读取pages.json中的bar页面列表。
 */
  let barLit = uni.$tm.tabBar?.list ?? [];
  for (let i = 0; i < barLit.length; i++) {
    if (nowPage?.route == barLit[i].pagePath) {
      isTabbarPage = true;
      break;
    }
  }

  if (store.tmuiConfig.autoDark) {
    // #ifdef H5
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      osChangeTheme('dark')
    } else {
      osChangeTheme('light')
    }
    // #endif

    // #ifndef H5
    osChangeTheme(sysinfo.sysinfo.osTheme)
    // #endif
  } else {
    setAppStyle()
  }

}


watch(
  () => props.showMenu,
  () => {
    _showMenu.value = props.showMenu;
    spinNvueAni();
  }
);
watch([() => tmcfg.value.color, isDark], () => {
  isSetThemeOk.value = false;
  setAppStyle();
});
watch([() => props.color], () => {
  appConfig.value.theme = tmcomputed.value.backgroundColor
});

function throttle(func: Function, wait = 100, immediate = false) {
  if (immediate) {
    if (!flag) {
      flag = true;
      // 如果是立即执行，则在wait毫秒内开始时执行
      typeof func === "function" && func();
      timids = setTimeout(() => {
        flag = false;
      }, wait);
    }
  } else {
    if (!flag) {
      flag = true;
      // 如果是非立即执行，则在wait毫秒内的结束处执行
      timids = setTimeout(() => {
        flag = false;
        typeof func === "function" && func();
      }, wait);
    }
  }
}

function setAppStyle() {
  if (isDark.value) {
    appConfig.value.theme = store.tmuiConfig?.themeConfig?.dark?.bodyColor || props.darkColor;
  } else {
    appConfig.value.theme = tmcomputed.value.backgroundColor;
  }
  // #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-KUAISHOU || MP-LARK
  uni.setBackgroundColor({
    backgroundColor: appConfig.value.theme,
    backgroundColorBottom: appConfig.value.theme,
    backgroundColorTop: appConfig.value.theme,
  }).catch(error=>{});
  // #endif

  // #ifdef APP-NVUE ||  APP-VUE
  if (plus?.webview?.currentWebview()?.setStyle) {
    plus.webview.currentWebview().setStyle({
      background: appConfig.value.theme,
      backgroundColorTop: appConfig.value.theme,
      backgroundColorBottom: appConfig.value.theme,
      userSelect: true,
      webviewBGTransparent: true,
    });
  }

  // #endif

  // #ifdef H5
  document.body.style.background = appConfig.value.theme || "";
  localStorage.setItem(
    "tmuiNavStyle",
    JSON.stringify({
      navbarBackground: isDark.value ? appConfig.value.theme : props.navbar.background,
      navbarFontColor: isDark.value ? "#ffffff" : props.navbar.fontColor,
    })
  );
  // #endif

  if (isDark.value) {
    // #ifndef MP-ALIPAY
    try {
      uni.setNavigationBarColor({
        backgroundColor: "#000000",
        frontColor: "#ffffff",
      }).catch(error=>{});
    } catch (error) {

    }

    // #endif


    // #ifdef APP
    plus.navigator.setStatusBarStyle("light");
    // #endif

    /**如果当前页面有tabbar则需要设定原生的tabbar */
    if (isTabbarPage) {
      uni.setTabBarStyle({
        backgroundColor: "#141415",
        borderStyle: "black",
        color: "#ffffff",
        selectedColor: uni.$tm.tabBar.selectedColor || tmcomputed.value.textColor,
      }).catch(error=>{});
    }
  } else {
    // #ifndef MP-ALIPAY
    try {
      let nowPageConfigs = uni.$tm.pages.filter((el) => el.path == nowPage?.route);
      if (nowPageConfigs.length > 0 && !props.navbar.background) {
        let tcolor = nowPageConfigs[0].navigationBarTextStyle;
        tcolor = tcolor.toLocaleLowerCase();
        tcolor = tcolor == "black" ? "#000000" : tcolor;
        tcolor = tcolor == "white" ? "#ffffff" : tcolor;
        uni.setNavigationBarColor({
          backgroundColor: nowPageConfigs[0].navigationBarBackgroundColor,
          frontColor: tcolor,
        }).catch(error=>{});
        uni.setStorageSync(
          "tmuiNavStyle",
          JSON.stringify({
            navbarBackground: nowPageConfigs[0].navigationBarBackgroundColor,
            navbarFontColor: tcolor,
          })
        );
      } else {
        uni.setNavigationBarColor({
          backgroundColor: props.navbar.background,
          frontColor: props.navbar.fontColor,
        }).catch(error=>{});
        uni.setStorageSync(
          "tmuiNavStyle",
          JSON.stringify({
            navbarBackground: props.navbar.background,
            navbarFontColor: props.navbar.fontColor,
          })
        );
      }
    } catch (error) {

    }
    // #endif
    // #ifdef APP
    plus.navigator.setStatusBarStyle("dark");
    // #endif
    try {
      if (isTabbarPage) {
        uni
          .setTabBarStyle({
            backgroundColor: uni.$tm.tabBar.backgroundColor || props.navbar.background,
            borderStyle: uni.$tm.tabBar.borderStyle || "white",
            color: uni.$tm.tabBar.color || props.navbar.fontColor,
            selectedColor: uni.$tm.tabBar.selectedColor || tmcomputed.value.textColor,
          }).catch(error=>{});
      }
    } catch (error) {

    }
  }
  isSetThemeOk.value = true;
}


/**
 * 设定主题
 * @params colorName 主题名称
 */
function setTheme(colorName: string) {
  store.setTmVuetifyTheme(colorName);
}

/**
 * 设定暗黑
 * @param dark boolean 空表示自动处理和切换暗黑效果
 */
function setDark(dark?: boolean) {
  let maindark = !isDark.value;
  if (typeof dark !== "undefined" && typeof dark == "boolean") {
    maindark = dark;
  }
  appConfig.value.dark = maindark;
  store.setTmVuetifyDark(maindark);

  setAppStyle();
}

function toogleOpen(type: boolean) {
  _showMenu.value = type;
  emits("update:showMenu", _showMenu.value);
}

function spinNvueAni(reveser = false) {
  // #ifdef APP-NVUE
  if (!proxy?.$refs.bodyEl) return;
  var testEl = proxy?.$refs.bodyEl;
  animation.transition(
    testEl,
    {
      styles: {
        transform: _showMenu.value
          ? `translateX(70%)   scale(0.8)`
          : `translateX(0%)  scale(1)`,
        transformOrigin: "center center",
      },
      duration: 200, //ms
      timingFunction: "ease",
      delay: 0, //ms
    },
    () => { }
  );
  setTimeout(function () {
    if (!proxy?.$refs.menuEl) return;
    var testElx = proxy?.$refs.menuEl;
    animation.transition(
      testElx,
      {
        styles: {
          transform: _showMenu.value ? `translateX(0%)` : `translateX(-101%)`,
          transformOrigin: "center center",
        },
        duration: 200, //ms
        timingFunction: "ease",
        delay: 0, //ms
      },
      () => { }
    );
  }, 50);
  // #endif
}

/** 监听当前系统的主题变化。 */
try {
  uni.onThemeChange((ev) => {
    osChangeTheme(ev.theme)
	
  })
} catch (error) {
  console.warn("没有主题切换功能：", error)
}
/**自动跟随系统设定暗黑主题。 */
function osChangeTheme(ev: 'light' | 'dark' | string | undefined) {
  if (!store.tmuiConfig.autoDark) return
  if (ev === 'light') {
    setDark(false)
  } else if (ev === 'dark') {
    setDark(true)
  }
}

// 向所有子组件传递本次获取的系统信息，以减少频繁的请求.
provide(
  "tmuiSysInfo",
  computed(() => sysinfoRef.value)
);
//向下子组件传递，相关参数，可代替store使用。
provide(
  "appTextColor",
  computed(() => tmcomputed.value.textColor)
);
//各个组件之间的间隙。
provide("custom_space_size", [0, 0]);

//向ref外层公开本组件的特定方法。
defineExpose({
  setTheme: setTheme,
  setDark: setDark,
});
</script>
<style scoped>
.app{
  /* #ifndef APP-NVUE */
  background-attachment: fixed;
  background-position: 0px 0px;
  background-repeat: no-repeat;
  /* #endif */
}
.menu {
  z-index: 999;
  transform: translateX(-101%);
}

/* #ifndef APP-NVUE */
.menu {
  transition-duration: 0.25s;
  transition-timing-function: ease;
  transition-property: transform;
  transition-delay: 0ms;
  transform: translateX(-101%);
  z-index: 999;
}

.menuOn {
  transform: translateX(0%);
}

.body {
  transition-duration: 0.25s;
  transition-timing-function: ease;
  transition-property: transform;
  transition-delay: 0ms;
  transform: translateX(0%) scale(1);
}

.bodyOn {
  transform: translateX(70%) scale(0.8);
}

/* #endif */
</style>
