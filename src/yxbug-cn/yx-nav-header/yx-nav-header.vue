<template>
	<tm-navbar hideHome title="八字排盘">
		<template v-slot:left>
		</template>
		<template v-slot:right>
			<view class="flex flex-center flex-row">
				<tm-icon
					:font-size="42"
					:color="store.tmStore.dark ? 'yellow' : 'yellow'"
					:name="store.tmStore.dark ? 'tmicon-ios-sunny' : 'tmicon-md-moon'"
					@click="onChangeDark"
				></tm-icon>
			</view>
		</template>
	</tm-navbar>
</template>

<script lang="ts" setup>
import { useTmpiniaStore } from '@/tmui/tool/lib/tmpinia';
const store = useTmpiniaStore();
const onChangeDark = () => store.setTmVuetifyDark(!store.tmStore.dark);
</script>
