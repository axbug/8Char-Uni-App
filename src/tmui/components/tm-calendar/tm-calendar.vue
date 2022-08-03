<template>

    <tm-drawer ref="drawer" :height="dHeight" @update:show="_show = $event" :show="_show" @close="close" @open="open"
        :hideHeader="true">
        <view class="mx-16 mt-24">
            <tm-calendar-view @update:model-value="_value = $event" :model-value="_value"
                @update:model-str="_strvalue = $event" :model-str="_strvalue" :default-value="_value" @change="change"
                @confirm="confirm" @click="onclick" :model="props.model" :color="props.color" :linear="props.linear"
                :linearDeep="props.linearDeep" :start="props.start" :end="props.end" :disabledDate="props.disabledDate"
                :multiple="props.multiple" :dateStyle="props.dateStyle" :max="props.max" ref="calendarView">
            </tm-calendar-view>
        </view>
    </tm-drawer>
</template>
<script lang="ts" setup>
/**
 * 日历(弹层式)
 * @description 用法见：tm-calendar-view组件，与其一致的用法。
 */
import { computed, ref, watch, PropType, Ref, getCurrentInstance, nextTick, watchEffect, ComponentInternalInstance } from "vue"
import { custom_props, computedTheme, computedClass, computedStyle, computedDark } from '../../tool/lib/minxs';
import tmCalendarView from "../tm-calendar-view/tm-calendar-view.vue";
import tmDrawer from "../tm-drawer/tm-drawer.vue";
import { monthDayItem, dateItemStyle, monthYearItem, weekItem, yearItem } from "../tm-calendar-view/interface"
const drawer = ref<InstanceType<typeof tmDrawer> | null>(null)
/**
 * 事件说明
 * v-model 绑定当前的时间。
 * confirm 当点击确认时触发
 * click 日期被选中时触发，注意禁用的日期不会触发 。
 * change 当切换年或者月的时候触发。
 */
const emits = defineEmits(["update:modelValue", "update:modelStr", "update:show", "confirm", "click", "change", "cancel", "close", "open"])

const props = defineProps({
    ...custom_props,
    show: {
        type: Boolean,
        default: false
    },
    /**
     * 数组
     */
    defaultValue: {
        type: Array as PropType<Array<String | Number | Date>>,
        default: () => []
    },
    modelValue: {
        type: Array as PropType<Array<String | Number | Date>>,
        default: () => []
    },
    //单向绑定输入展示日期，此字段用来在页面上展示。只向外输出。
    //功能目的：用来在页面上显示，特别是在input上绑定显示非常方便。
    //标准数据保存时，请使用modelValue保存，而不是此值。
    modelStr: {
        type: String,
        default: ''
    },
    /**
     * 日期模式
     * day : 单个日期选择模式（可多选，需要设置multiple=true;
     * week :按周选择模式。
     * month :按月选择模式。
     * year :按年选择模式。
     * rang :按日期范围选择模式。
     */
    model: {
        type: String,
        default: 'day'
    },
    color: {
        type: String,
        default: 'primary',
    },
    linear: {
        type: String,
        default: '',
    },
    linearDeep: {
        type: String,
        default: 'light',
    },
    //指的是：有效的可选时间，小于此时间，不允许选中。
    start: {
        type: [String, Number, Date],
        default: ""
    },
    //指的是：有效的可选时间，大于此时间，不允许选中。
    end: {
        type: [String, Number, Date],
        default: ""
    },

    /** 日历组件属性 */

    //被禁用的日期数组。如果["2022-1-1","2022-5-1"]
    //被禁用的日期将无法选中。
    disabledDate: {
        type: Array as PropType<Array<String | Number | Date>>,
        default: () => []
    },
    //是否允许多选。
    multiple: {
        type: Boolean,
        default: false
    },
    //设定单个日期的样式。
    dateStyle: {
        type: Array as PropType<Array<dateItemStyle>>,
        default: () => []
    },
    //当multiple=true时，可以选择的最大日期数量。
    max: {
        type: Number,
        default: 999
    }
    /** 日历组件属性结束 */

})

const _show = ref(props.show)
const isConfirm = ref(false)//是否点了确认按钮。
const _value = ref(props.defaultValue)
const _strvalue = ref("")
const _modelType = computed(() => props.model)
function close() {
    if (!isConfirm.value) {
        emits("cancel")
        //取消了，但没点确认，则要恢复默认值。
        // _value.value = [];
        // nextTick(()=>{
        //     _value.value = props.modelValue.length==0?props.defaultValue:props.modelValue;
        // })

    }
    emits("close")
    emits("update:show", false)
    nextTick(() => {
        //恢复选中之前。如果未点确认按钮，而是直接关闭的话。
		// 截止3.0.0-alpha-3041120220520001版本后，所有平台都无法获取组件的ref方法了。
		// console.log(proxy.$refs.calendarView)
        // if (!proxy.$refs.calendarView?.setDefault) return;
        // if (props.modelValue.length == 0) {
        //     // 截止2022-5-13在clinvue uniapp 在h5平台此处有bug，其它平台正常
        //     proxy.$refs.calendarView?.setDefault(props.defaultValue)
        // } else {
        //     proxy.$refs.calendarView?.setDefault(props.modelValue)
        // }
    })
    isConfirm.value = false;
}
function open() {
    emits("open")
}
watchEffect(() => {
    emits("update:modelStr", _strvalue.value)
})

watchEffect(() => {
    _show.value = props.show;
})
watch(() => props.modelValue, () => {
    _value.value = props.modelValue
    _strvalue.value = _value.value.join("~")
}, { deep: true })
function change(e: Array<string | number>) {
    emits("change", e)
}
function onclick(e: Array<string | number>) {
    emits("click", e)
}
function confirm(e: Array<string | number>) {
    emits("confirm", e)
    emits("update:modelValue", e)
    isConfirm.value = true;
    drawer.value?.close();
}

const win_bottom = uni.getWindowInfo()?.safeAreaInsets?.bottom??0
const dHeight = computed(() => {
    if (_modelType.value == 'day') return 900+win_bottom
    if (_modelType.value == 'rang') return 900+win_bottom
    if (_modelType.value == 'week') return 740+win_bottom
    if (_modelType.value == 'month') return 720+win_bottom
    if (_modelType.value == 'year') return 620+win_bottom
    return 600+win_bottom
})
</script>
