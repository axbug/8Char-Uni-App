<template>
  <view>
    <yx-sheet :round="3" :shadow="2">
      <template v-for="bitem in friendList">
        <text class="yx-text-weight-b u-p-t-10 u-m-b-20 u-font-38">关于项目</text>
        <u-row>
          <u-col v-for="item in bitem" :span="3">
            <view class="u-flex u-text-center u-row-center u-p-t-14">
              <u-image
                  :height="100"
                  :src="getUrl(item.icon)"
                  :width="100"
                  @click="ColClick(item)"
              ></u-image>
            </view>
            <view class="yx-text-weight-n u-text-center u-p-t-10">{{item.title}}</view>
          </u-col>
        </u-row>
      </template>
    </yx-sheet>
    <yx-copyright></yx-copyright>
  </view>
</template>

<script setup>
import {friendList} from "./config";
import {getUrl} from "@/utils/file";
import {clearLocalStorage} from "@/utils/cache";
import {init} from "@/utils/launch";

const ColClick = (item) => {
  if (item.type === "route") {
    // #ifdef H5
    window.open(item.url);
    // #endif
    // #ifndef H5
    uni.setClipboardData({
      data: item.url,
      success: function () {
        uni.$u.toast("链接已复制到剪贴板，请粘贴到浏览器进行访问！",4000);
      }
    });
    // #endif
  }else if(item.type === "clearCache"){
    clearLocalStorage()
    uni.$u.toast("缓存清理完毕！");
    init()
  }
};
</script>
