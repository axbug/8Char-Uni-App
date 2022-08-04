<template>
	<view>
		<tm-navbar hideHome title="八字排盘">
			<template v-slot:left></template>
			<template v-slot:right>
				<view class="flex flex-center flex-row">
					<tm-icon
						class="pr-30"
						:font-size="44"
						:color="store.tmStore.dark ? 'grey-5' : 'grey'"
						name="tmicon-md-contrast"
						@click="theme_show = true"
					></tm-icon>
					<tm-icon
						:font-size="44"
						:color="store.tmStore.dark ? 'yellow' : 'yellow'"
						:name="store.tmStore.dark ? 'tmicon-ios-sunny' : 'tmicon-md-moon'"
						@click="onChangeDark"
					></tm-icon>
				</view>
			</template>
		</tm-navbar>
		<yx-set-theme :show="theme_show" @update:show="theme_show = $event"></yx-set-theme>
	</view>
</template>

<script lang="ts" setup>
import { ref,watchEffect } from 'vue';
import { useTmpiniaStore } from '@/tmui/tool/lib/tmpinia';
const store = useTmpiniaStore();
const theme_show = ref(false);
const onChangeDark = () => store.setTmVuetifyDark(!store.tmStore.dark);
</script>
