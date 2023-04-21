<template>
  <u-divider bg-color="transparent" class="u-p-30">{{copyright()}}</u-divider>
</template>

<script setup>
import {APP_AUTHOR, APP_NAME} from "@/config";

const copyright = () => {
  let date = `2022 - ${new Date().getFullYear()}`
  return `© ${date} ${APP_NAME} Powered by ${APP_AUTHOR}`
}
</script>
