<template>
    <tm-sheet :transprent="true" :margin="props.margin" :padding="props.padding">

        <tm-sheet :transprent="props.transprent" :round="props.round" no-level 
		:margin="[0, 0]" :padding="_inputPadding"
            :border="props.border" 
			:text="props.text" :color="_color" 
			:outlined="props.outlined"
			:shadow="props.shadow"
			:linear="props.linear"
			:linearDeep="props.linearDeep"
			>
            <view class="flex flex-row "
                :class="[propsDetail.type == 'textarea' ? 'flex-row-top-center' : 'flex-row-center-center']"
                :style="[{ height: `${_height}rpx` }]">

                <view v-if="propsDetail.search || propsDetail.searchLabel" class="px-9"></view>
                <slot name="left"></slot>
                <view v-if="propsDetail.prefix" class="pr-16">
                    <tm-icon :font-size="propsDetail.fontSize" :name="propsDetail.prefix"></tm-icon>
                </view>
                <view v-if="propsDetail.prefixLabel" class="pr-24">
                    <tm-text :font-size="propsDetail.fontSize" :label="propsDetail.prefixLabel"></tm-text>
                </view>

                <view v-if="!isAndroid" @click="emits('click', $event)" class="flex-1 relative flex-row flex"
                    :style="[{ width: '0px' }]">
                    <!-- <view @click.stop="emits('click',$event)" class=" l-0 t-0 flex-1 " :style="{height: `${_height}rpx`,background:'red'}"></view> -->
                    <input class="flex-1" :userInteractionEnabled="false" v-if="propsDetail.type != 'textarea'"
                        :value="_value" :focus="propsDetail.focus" @focus="focus" @blur="blur" @confirm="confirm" @input="inputHandler"
                        @keyboardheightchange="emits('keyboardheightchange')" :password="showPasswordText"
                        :maxlength="propsDetail.maxlength" :disabled="propsDetail.disabled"
                        :cursorSpacing="propsDetail.cursorSpacing" :confirmType="propsDetail.confirmType"
                        :confirmHold="propsDetail.confirmHold" :autoBlur="propsDetail.autoBlur"
                        :holdKeyboard="propsDetail.holdKeyboard" :adjustPosition="propsDetail.adjustPosition"
                        :type="propsDetail.type" :placeholder="propsDetail.placeholder" :style="[
                            {
                                height: `${_height}rpx`,
                                color: propsDetail.fontColor ? propsDetail.fontColor : tmcomputed.textColor,
                                'text-align': props.align,
                                'fontSize': `${propsDetail.fontSize_px}px`
                            },
                        ]" :placeholder-style="`fontSize:${propsDetail.fontSize_px}px`" />

                    <textarea :userInteractionEnabled="false" v-if="propsDetail.type == 'textarea'" :value="_value"
                        :focus="propsDetail.focus" @focus="focus" @blur="blur" @confirm="confirm" @input="inputHandler"
                        @keyboardheightchange="emits('keyboardheightchange')" :maxlength="propsDetail.maxlength"
                        :disabled="propsDetail.disabled"
                        :placeholder="propsDetail.placeholder" :cursorSpacing="propsDetail.cursorSpacing"
                         :confirmHold="propsDetail.confirmHold"
                        :autoBlur="propsDetail.autoBlur" :holdKeyboard="propsDetail.holdKeyboard"
						:cursor="propsDetail.cursor"
						:show-confirm-bar="propsDetail.showConfirmBar"
						:selectionStart="propsDetail.selectionStart"
						:selectionEnd="propsDetail.selectionEnd"
						:disable-default-padding="propsDetail.disableDefaultPadding"
						:fixed="propsDetail.fixed"
                        :adjustPosition="propsDetail.adjustPosition" :type="propsDetail.type" :style="[
                            {
                                height: `${_height}rpx`, width: 'auto', 'word-break': 'break-word',
                                color: propsDetail.fontColor ? propsDetail.fontColor : tmcomputed.textColor,
                                'text-align': props.align,
                                'fontSize': `${propsDetail.fontSize_px}px`
                            },
                        ]" class="wrap flex-1 py-12"
                        :placeholder-style="`fontSize:${propsDetail.fontSize_px}px`"></textarea>
                </view>
                <view v-if="isAndroid" class="flex-1 relative flex-row flex " :style="[{ width: '0px' }]">
                    <!-- <view @click.stop="emits('click',$event)" class=" l-0 t-0 flex-1 " :style="{height: `${_height}rpx`,background:'red'}"></view> -->
                    <input class="flex-1" @click="emits('click', $event)" :userInteractionEnabled="false"
                        v-if="propsDetail.type != 'textarea'" :value="_value" :focus="propsDetail.focus" @focus="focus" @blur="blur"
                        @confirm="confirm" @input="inputHandler" @keyboardheightchange="emits('keyboardheightchange')"
                        :password="showPasswordText" :disabled="propsDetail.disabled"
                        :cursorSpacing="propsDetail.cursorSpacing" :confirmType="propsDetail.confirmType"
                        :confirmHold="propsDetail.confirmHold" :autoBlur="propsDetail.autoBlur"
                        :holdKeyboard="propsDetail.holdKeyboard" :adjustPosition="propsDetail.adjustPosition"
                        :maxlength="propsDetail.maxlength" :type="propsDetail.type"
                        :placeholder="propsDetail.placeholder" :style="[
                            {
                                height: `${_height}rpx`,
                                color: propsDetail.fontColor ? propsDetail.fontColor : tmcomputed.textColor,
                                'text-align': props.align,
                                'fontSize': `${propsDetail.fontSize_px}px`
                            },
                        ]" :placeholder-style="`fontSize:${propsDetail.fontSize_px}px`" />
                    <textarea @click="emits('click', $event)" :userInteractionEnabled="false"
                        v-if="propsDetail.type == 'textarea'" :value="_value" :focus="propsDetail.focus" @focus="focus" @blur="blur"
                        @confirm="confirm" @input="inputHandler" @keyboardheightchange="emits('keyboardheightchange')"
                        :disabled="propsDetail.disabled"
                        :placeholder="propsDetail.placeholder" :cursorSpacing="propsDetail.cursorSpacing"
                         :confirmHold="propsDetail.confirmHold"
                        :autoBlur="propsDetail.autoBlur" :holdKeyboard="propsDetail.holdKeyboard"
                        :adjustPosition="propsDetail.adjustPosition" :maxlength="propsDetail.maxlength"
						:autoHeight="propsDetail.autoHeight"
						:cursor="propsDetail.cursor"
						:show-confirm-bar="propsDetail.showConfirmBar"
						:selectionStart="propsDetail.selectionStart"
						:selectionEnd="propsDetail.selectionEnd"
						:disable-default-padding="propsDetail.disableDefaultPadding"
						:fixed="propsDetail.fixed"
						
                        :type="propsDetail.type" :style="[
                            {
                                height: `${_height}rpx`, width: 'auto', 'word-break': 'break-word',
                                color: propsDetail.fontColor ? propsDetail.fontColor : tmcomputed.textColor,
                                'text-align': props.align,
                                'fontSize': `${propsDetail.fontSize_px}px`
                            },
                        ]" class="wrap flex-1 py-10"
                        :placeholder-style="`fontSize:${propsDetail.fontSize_px}px`"></textarea>
                </view>
                <view class="pl-16" v-if="propsDetail.showClear && _valueLenChar > 0">
                    <tm-icon @click="clearBtn" :font-size="propsDetail.fontSize * 0.9" name="tmicon-times-circle-fill">
                    </tm-icon>
                </view>
                <view class="pl-16" v-if="_requiredError">
                    <tm-icon :font-size="propsDetail.fontSize" name="tmicon-exclamation-circle"></tm-icon>
                </view>
                <view class="pl-16" v-if="propsDetail.suffix">
                    <tm-icon :font-size="propsDetail.fontSize * 0.85" :name="propsDetail.suffix"></tm-icon>
                </view>


                <view v-if="propsDetail.suffixLabel" class="pl-16">
                    <tm-text :font-size="propsDetail.fontSize" :label="propsDetail.suffixLabel"></tm-text>
                </view>


                <view class="pl-16" v-if="showPasswordIcon">
                    <!-- tmicon-eyeslash-fill -->
                    <tm-icon @click="changeSeePassword" :font-size="propsDetail.fontSize"
                        :name="showPasswordText ? 'tmicon-eyeslash-fill' : 'tmicon-eye-fill'"></tm-icon>
                </view>
                <view v-if="propsDetail.showCharNumber && _valueLenChar > 0 && propsDetail.type != 'textarea'"
                    class=" pl-16 flex-row flex">
                    <tm-text :label="_valueLenChar"></tm-text>
                    <tm-text v-if="propsDetail.maxlength > 0" :label="'/' + propsDetail.maxlength"></tm-text>
                </view>
                <view v-if="propsDetail.showCharNumber && _valueLenChar > 0 && propsDetail.type == 'textarea'"
                    class=" pl-16 flex-row flex absolute r-0 b-12">
                    <tm-text :label="_valueLenChar"></tm-text>
                    <tm-text v-if="propsDetail.maxlength > 0" :label="'/' + propsDetail.maxlength"></tm-text>
                </view>
                <slot name="right">
                    <view v-if="propsDetail.search || propsDetail.searchLabel" class="pl-16">
                        <TmButton :followTheme="props.followTheme"
						 @click="searchClick" 
						:color="props.focusColor" :font-size="24" 
						:height="_height - 11"
                            :padding="[16, 0]" block :margin="[0, 0]" :icon="propsDetail.search"
                            :label="propsDetail.searchLabel"></TmButton>
                    </view>
                </slot>
            </view>
        </tm-sheet>

        <!-- <view v-if="propsDetail.showBottomBotder" :class="[`mt-${props.margin[1]*2}`]">
            <tm-divider :margin="[0,0]"></tm-divider>
        </view> -->
        <!-- _requiredError -->
        <!-- <view v-if="false" class="pt-12">
            <tmText :font-size="24" color="red" :label="_errorLabel"></tmText>
        </view> -->
    </tm-sheet>
</template>

<script lang="ts" setup>
import { computed, PropType, ref, watch, getCurrentInstance, inject, toRaw } from 'vue';
import { inputPushItem, rulesItem } from "./../tm-form-item/interface"
import tmSheet from '../tm-sheet/tm-sheet.vue';
import tmIcon from '../tm-icon/tm-icon.vue';
import tmText from '../tm-text/tm-text.vue';
import { custom_props, computedTheme, computedClass, computedStyle, computedDark } from '../../tool/lib/minxs';
import { useTmpiniaStore } from '../../tool/lib/tmpinia';
import TmButton from '../tm-button/tm-button.vue';
const store = useTmpiniaStore();
const emits = defineEmits(["focus", "blur", "confirm", "input", "update:modelValue", "clear", "search", "keyboardheightchange", 'click'])
const { proxy } = getCurrentInstance()
const props = defineProps({
    ...custom_props,
	followTheme: {
		type: [Boolean,String],
		default: true
	},
    color: {
        type: String,
        default: 'grey-4'
    },
    //激活时的主题配色。
    focusColor: {
        type: String,
        default: 'primary'
    },
    //默认使用自动配色
    fontColor: {
        type: String,
        default: ''
    },
    text: {
        type: Boolean,
        default: true
    },
    outlined: {
        type: Boolean,
        default: false
    },
    border: {
        type: Number,
        default: 0
    },
    transprent: {
        type: Boolean,
        default: false
    },
    round: {
        type: Number,
        default: 3
    },
	shadow:{
		type: Number,
		default: 0
	},
    margin: {
        type: Array as PropType<Array<number>>,
        default: () => [0, 0]
    },
    padding: {
        type: Array as PropType<Array<number>>,
        default: () => [0, 0]
    },
    height: {
        type: Number,
        default: 64
    },
    //前缀图标
    prefix: {
        type: String,
        default: ''
    },
    //前缀文字
    prefixLabel: {
        type: String,
        default: ''
    },
    //后缀图标
    suffix: {
        type: String,
        default: ''
    },
    //后缀文字
    suffixLabel: {
        type: String,
        default: ''
    },

    fontSize: {
        type: Number,
        default: 30
    },
    //tmicon-search
    search: {
        type: String,
        default: ''
    },
    //搜索
    searchLabel: {
        type: String,
        default: ''
    },
    showClear: {
        type: Boolean,
        default: false
    },
    password: {
        type: Boolean,
        default: false
    },
    //是否禁用
    disabled: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: '请输入内容'
    },
    //错误时，提示的文本。
    errorLabel: {
        type: String,
        default: '请输入内容'
    },
    //对齐方式。
    //left,right,center
    align: {
        type: String,
        default: 'left'
    },
    modelValue: {
        type: [String, Number],
        default: ""
    },
    inputPadding: {
        type: Array as PropType<Array<number>>,
        default: () => [24, 0]
    },
    //是否显示字符统计。
    showCharNumber: {
        type: Boolean,
        default: false
    },
    maxlength: {
        type: Number,
        default: -1
    },
    type: {
        type: String,
        default: 'text'
    },
    cursorSpacing: {
        type: Number,
        default: 24
    },
    confirmType: {
        type: String,
        default: 'done'
    },
    confirmHold: {
        type: Boolean,
        default: false
    },
    autoBlur: {
        type: Boolean,
        default: true
    },
    holdKeyboard: {
        type: Boolean,
        default: false
    },
    adjustPosition: {
        type: Boolean,
        default: true
    },
	//默认的聚集状态
	focus: {
        type: Boolean,
        default: false
    },
	cursor: {
	    type: Number,
	    default: 0
	},
	showConfirmBar: {
	    type: Boolean,
	    default: true
	},
	selectionStart: {
	    type: Number,
	    default: -1
	},
	selectionEnd: {
	    type: Number,
	    default: -1
	},
	disableDefaultPadding: {
	    type: Boolean,
	    default: false
	},
	fixed:{
	    type: Boolean,
	    default: false
	},
})

let parentFormItem = proxy.$parent
while (parentFormItem) {
    if (parentFormItem?.tmFormComnameFormItem == 'tmFormComnameFormItem' || !parentFormItem) {
        break;
    } else {
        parentFormItem = parentFormItem?.$parent ?? undefined

    }
}

const isAndroid = ref(false)
isAndroid.value = uni.getSystemInfoSync().platform == 'android' ? true : false;
const _height = computed(() => props.height)
const _inputPadding = computed(() => {
    if (props.search !== '' || props.searchLabel !== '') {
        return [4, 0]
    }
    return props.inputPadding;
})
const propsDetail = computed(() => {
    return {
		focus:props.focus,
        prefix: props.prefix,
        prefixLabel: props.prefixLabel,
        fontSize: props.fontSize,
        fontSize_px: uni.upx2px(props.fontSize),
        suffix: props.suffix,
        suffixLabel: props.suffixLabel,
        fontColor: props.fontColor,
        search: props.search,
        searchLabel: props.searchLabel,
        showClear: props.showClear,
        password: props.password,
        disabled: props.disabled,
        placeholder: props.placeholder,
        showCharNumber: props.showCharNumber,
        maxlength: props.maxlength,
        cursorSpacing: props.cursorSpacing,
        confirmType: props.confirmType,
        confirmHold: props.confirmHold,
        autoBlur: props.autoBlur,
        holdKeyboard: props.holdKeyboard,
        adjustPosition: props.adjustPosition,
		type: props.type,
        cursor: props.cursor,
        showConfirmBar: props.showConfirmBar,
        selectionStart: props.selectionStart,
        selectionEnd: props.selectionEnd,
        disableDefaultPadding: props.disableDefaultPadding,
        fixed: props.fixed
    }
})
// 设置响应式全局组件库配置表。
const tmcfg = computed(() => store.tmStore);
//自定义样式：
const customCSSStyle = computed(() => computedStyle(props));
//自定类
const customClass = computed(() => computedClass(props));
//是否暗黑模式。
const isDark = computed(() => computedDark(props, tmcfg.value));
//当前是否显示检验错误状态？
const _requiredError = ref(false)
//是否聚焦中。
const _foucsActive = ref(props.focus||false)
watch(()=>props.focus,()=>{
	_foucsActive.value = props.focus
})
const _color = computed(() => {
    let color = props.color;
    if (_foucsActive.value){
		if(props.followTheme&&store.tmStore.color){
			 color = store.tmStore.color;
		}else{
			color = props.focusColor;
		}
	} 
    if (_requiredError.value) color = 'red';
    return color;
})
//计算主题
const tmcomputed = computed(() => {
    const _props =
        { ...props, color: _color.value }
    return computedTheme(_props, isDark.value,tmcfg.value)
});

//显示密码和关闭密码。
const showPasswordText = ref(propsDetail.value.password)
const showPasswordIcon = computed(() => props.password)
const _errorLabel = ref(props.errorLabel)
const _value = ref(props.modelValue)
const _valueLenChar = computed(() => {
    //在ios上字符的长度不能采用str.length来计算。因为一个中文=2。一个英文=1；
    let str = String(_value.value).split("")
    return str.length;
})
watch(() => props.modelValue, () => _value.value = props.modelValue)
//--------------form表单专用------------------
const rulesObj = inject("tmFormItemRules", computed<Array<rulesItem>>(() => {
    return [{
        message: props?.errorLabel ?? "请填写必要的内容",
        required: false,
        validator: false
    }]
}))

//-------------- end ------------------

function searchClick() {
    emits("search", _value.value)
}
function clearBtn() {
    _value.value = "";
    emits("update:modelValue", "")
    emits("clear")
}
function changeSeePassword() {
    showPasswordText.value = !showPasswordText.value;
}
function focus() {
    _foucsActive.value = true;
    emits("focus")
	// pushFormItem();
}
function blur() {
    _foucsActive.value = false;
    pushFormItem();
    emits("blur")
}
function confirm() {
    emits("confirm", _value.value)
}
function inputHandler(e) {

    _value.value = e.detail.value;
    emits("input", e.detail.value)
    emits("update:modelValue", e.detail.value)
	
    return e.detail.value;
}
let timerId = NaN;
function debounce(func:Function, wait = 500, immediate = false) {
  // 清除定时器
  if (!isNaN(timerId)) clearTimeout(timerId);
  // 立即执行，此类情况一般用不到
  if (immediate) {
	var callNow = !timerId;
	timerId = setTimeout(() => {
	  timerId = NaN;
	}, wait);
	if (callNow) typeof func === "function" && func();
  } else {
	// 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
	timerId = setTimeout(() => {
	  typeof func === "function" && func();
	}, wait);
  }
}
watch(_value,()=>debounce(pushFormItem,350))

//--------------以下是专门为form表单专用------------------
const tmFormFun = inject("tmFormFun", computed(() => ""))
const validate =(rules:Array<rulesItem>)=>{
    rules = rules.map(el=>{
        if(typeof el.validator === "function" && el.required===true){
            return el
        }else if(typeof el.validator === "boolean" && el.required===true){
            return {
                ...el,
                validator:(val:string|number)=>{
					
                    return String(val).length == 0 || typeof val === null ?false:true
                }
            }
        }else{
            return {
                ...el,
                validator:(val:string|number)=>{
                    return true
                }
            }
        }
        
    })
    let rules_filter:Array<rulesItem> = rules.filter(el=>{
        return typeof el.validator === "function" && el.required===true
    })
    let rules_fun:Array<Promise<rulesItem>> = rules_filter.map(el=>{
        return new Promise(async (res,rej)=>{
            if(typeof el.validator ==='function'){
                let vr = await el.validator(_value.value)
                if(vr){
                    res({
                        message:String(el.message),
                        validator:true
                    })
                }else{
                    rej({
                        message:el.message,
                        validator:false
                    })
                }
            }else{
                res({
                    message:el.message,
                    validator:true
                })
            }
        })
    })

    return Promise.all(rules_fun)
}
async function pushFormItem(isCheckVail = true) {
    if (parentFormItem) {
        if (isCheckVail) {
            validate(toRaw(rulesObj.value)).then(ev => {
				
                parentFormItem.pushCom({
                    value: _value.value,
                    isRequiredError: false,//true,错误，false正常 检验状态
                    componentsName: 'tm-input',//表单组件类型。
                    message: ev.length==0?"":ev[0].message//检验信息提示语。
                })
            }).catch(er => {
                parentFormItem.pushCom({
                    value: _value.value,
                    isRequiredError: true,//true,错误，false正常 检验状态
                    componentsName: 'tm-input',//表单组件类型。
                    message: er.message,//检验信息提示语。
                })

            })
        }
        
    }
}
watch(tmFormFun, () => {
    if (tmFormFun.value == 'validate') {
        pushFormItem();
    }
    if (tmFormFun.value == 'reset') {
        _value.value = "";
        _requiredError.value = false;
        emits("update:modelValue", _value.value)
        pushFormItem(false);
    }
    if (tmFormFun.value == 'clearValidate') {
        _requiredError.value = false;
        pushFormItem(false);
    }
})
pushFormItem(false)
//-------------- end ------------------
</script>

<style scoped>
</style>>
