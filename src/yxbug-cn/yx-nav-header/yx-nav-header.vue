<template>
  <u-navbar
      title-bold
      :is-back="false"
      title-color="#333333"
      :title="APP_NAME"
  ></u-navbar>
</template>

<script setup>
import {APP_NAME} from "@/config";
</script>
