<template>
	<tm-sheet :round="0" :shadow="0" :margin="[0, 0]" :padding="[18, 0]">
		<tm-row :gutter="0">
			<tm-col class="flex-1"><tm-image class="rounded" src="./static/icon/logo.svg" :width="138" :height="138"></tm-image></tm-col>
			<tm-col class="flex-11 pl-20" align="start" _class="flex-col-center-start" :height="168">
				<tm-text _class="font-weight-b" label="八字排盘工具" class="flex-start pb-10" :font-size="38"></tm-text>
				<tm-text class="flex-start" label="专业命理师首选八字排盘工具"></tm-text>
			</tm-col>
		</tm-row>
	</tm-sheet>
</template>
