<template>
	<view>
		<tm-sheet :round="3" :shadow="2">
			<template v-for="(bitem, bindex) in friend">
				<tm-text :font-size="24" _class="font-weight-b pt-10" :label="['开源仓库', '项目相关'][bindex]"></tm-text>
				<tm-divider :margin="[12, 12]"></tm-divider>
				<tm-row :width="630" :column="4" color="blue-grey" :gutter="5">
					<tm-col v-for="item in bitem" :height="168">
						<tm-image
							class="round-3"
							:src="item.icon"
							:width="100"
							:height="100"
							style="background-color: #ffffff;"
							@click="ToLink(item.url)"
						></tm-image>
						<tm-text class="py-8" :label="item.title" _class="font-weight-b"></tm-text>
					</tm-col>
				</tm-row>
			</template>
		</tm-sheet>
		<!-- <tm-divider class="pa-30" :label="'© 2022 八字排盘 Powered by 阿轩的Bug'"></tm-divider> -->
	</view>
</template>

<script lang="ts" setup>
import { friend } from '@/common/config.ts';

const ToLink = (url: string): void => (location.href = url);
</script>
