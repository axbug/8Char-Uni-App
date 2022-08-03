<template>
	<tm-table :width="690" :cellHeight="120" :header="header" :table-data="store.table"></tm-table>
</template>

<script lang="ts" setup>
import { ref, toRef } from 'vue';
import { useBaziStore } from '@/store/bazi.ts';

interface headerOpts {
	title:string,
	key:string,
	width:number,
}

const store = useBaziStore();
const width: number = 126;
const header:headerOpts[] = [
	{ title: '\\', key: 'name', width: width },
	{ title: '年柱', key: 'year', width: width },
	{ title: '月柱', key: 'month', width: width },
	{ title: '日柱', key: 'day', width: width },
	{ title: '时柱', key: 'time', width: width }
];
</script>
