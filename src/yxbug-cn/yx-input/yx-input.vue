<template>
  <view
      class="u-search"
      :style="{
        margin: margin,
      }"
      @tap="clickHandler"
  >
    <view
        class="u-content"
        :style="{
          backgroundColor: bgColor,
          borderRadius: shape === 'round' ? '100rpx' : '10rpx',
          border: borderStyle,
          height: height + 'rpx'
        }"
    >
      <view class="u-icon-wrap">
        <slot name="icon"></slot>
      </view>
      <input
          placeholder-class="u-placeholder-class"
          class="u-input"
          type="text"
          :style="[
              {
              textAlign: inputAlign,
              color: color,
              backgroundColor: bgColor,
            },
            inputStyle
          ]"
          :value="valueCom"
          :disabled="disabled"
          :focus="focus"
          :maxlength="maxlength"
          :placeholder="placeholder"
          :placeholder-style="`color: ${placeholderColor}`"
          @blur="blur"
          @confirm="search"
          @focus="getFocus"
          @input="inputChange"
      />
      <view class="u-close-wrap" v-if="keyword && clearabled && focused" @tap="clear">
        <u-icon class="u-clear-icon" name="close-circle-fill" size="34" color="#c0c4cc"></u-icon>
      </view>
    </view>
  </view>
</template>

<script setup>
import {nextTick, computed,watch,ref} from "vue";

const emits = defineEmits(["update:modelValue", "input", "change", "search", "custom", "clear", "focus", "blur"])
const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  modelValue: {
    type: String,
    default: ''
  },
  shape: {
    type: String,
    default: 'square'
  },
  bgColor: {
    type: String,
    default: '#f2f2f2'
  },
  placeholder: {
    type: String,
    default: '请输入关键字'
  },
  clearabled: {
    type: Boolean,
    default: false
  },
  focus: {
    type: Boolean,
    default: false
  },
  showAction: {
    type: Boolean,
    default: true
  },
  actionStyle: {
    type: Object,
    default() {
      return {};
    }
  },
  actionText: {
    type: String,
    default: '搜索'
  },
  inputAlign: {
    type: String,
    default: 'left'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  animation: {
    type: Boolean,
    default: false
  },
  borderColor: {
    type: String,
    default: 'none'
  },
  height: {
    type: [Number, String],
    default: 64
  },
  inputStyle: {
    type: Object,
    default() {
      return {}
    }
  },
  maxlength: {
    type: [Number, String],
    default: '-1'
  },
  searchIconColor: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#606266'
  },
  placeholderColor: {
    type: String,
    default: '#909399'
  },
  margin: {
    type: String,
    default: '0'
  },
  searchIcon: {
    type: String,
    default: 'search'
  }
})

const keyword = ref('')
const show = ref(false)
const focused = ref(props.focus)

watch(()=>keyword.value,nVal=>{
  emits('input', nVal);
  emits("update:modelValue", nVal);
  // 触发change事件，事件效果和v-model双向绑定的效果一样，让用户多一个选择
  emits('change', nVal);
})

const valueCom = computed(()=>{
  return props.modelValue;
})



const borderStyle = computed(()=>{
  if (props.borderColor) return `1px solid ${props.borderColor}`;
  else return 'none';
})

// 目前HX2.6.9 v-model双向绑定无效，故监听input事件获取输入框内容的变化
function inputChange(e) {
  keyword.value = e.detail.value;
}

// 清空输入
// 也可以作为用户通过this.$refs形式调用清空输入框内容
function clear() {
  keyword.value = '';
  // 延后发出事件，避免在父组件监听clear事件时，value为更新前的值(不为空)
  nextTick(() => {
    emits('clear');
  })
}

// 确定搜索
function search(e) {
  emits('search', e.detail.value);
  try {
    // 收起键盘
    uni.hideKeyboard();
  } catch (e) {
  }
}

// 点击右边自定义按钮的事件
function custom() {
  emits('custom', keyword.value);
  try {
    // 收起键盘
    uni.hideKeyboard();
  } catch (e) {
  }
}

// 获取焦点
function getFocus() {
  props.focused = true;
  // 开启右侧搜索按钮展开的动画效果
  if (props.animation && props.showAction) show.value = true;
  emits('focus', keyword.value);
}

// 失去焦点
function blur() {
  // 最开始使用的是监听图标@touchstart事件，自从hx2.8.4后，此方法在微信小程序出错
  // 这里改为监听点击事件，手点击清除图标时，同时也发生了@blur事件，导致图标消失而无法点击，这里做一个延时
  setTimeout(() => {
    props.focused = false;
  }, 100)
  show.vallue = false;
  emits('blur', keyword.value);
}

// 点击搜索框，只有disabled=true时才发出事件，因为禁止了输入，意味着是想跳转真正的搜索页
function clickHandler() {
  if (props.disabled) emits('click');
}
</script>

<style lang="scss" scoped>
@import "vk-uview-ui/libs/css/style.components.scss";

.u-search {
  @include vue-flex;
  align-items: center;
  flex: 1;
}

.u-content {
  @include vue-flex;
  align-items: center;
  padding: 0 18rpx;
  flex: 1;
}

.u-clear-icon {
  @include vue-flex;
  align-items: center;
}

.u-input {
  flex: 1;
  font-size: 28rpx;
  line-height: 1;
  margin: 0 10rpx;
  color: $u-tips-color;
}

.u-close-wrap {
  width: 40rpx;
  height: 100%;
  @include vue-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.u-placeholder-class {
  color: $u-tips-color;
}

.u-action {
  font-size: 28rpx;
  color: $u-main-color;
  width: 0;
  overflow: hidden;
  transition: all 0.3s;
  white-space: nowrap;
  text-align: center;
}

.u-action-active {
  width: 80rpx;
  margin-left: 10rpx;
}
</style>
