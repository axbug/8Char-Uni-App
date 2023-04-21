<script setup>
import {onLaunch, onPageNotFound} from '@dcloudio/uni-app';
import {toHome} from "@/utils/router";
import {init} from "@/utils/launch";

onLaunch(()=>{
  init()
})

onPageNotFound(() => {
  toHome()
});
</script>

<style lang="scss">
@import "vk-uview-ui/index.scss";
@import "./style/index.scss";
</style>
