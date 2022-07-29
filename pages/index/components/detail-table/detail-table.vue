<template>
	<view v-if="$store.state.bazi.table.length">
		<u-table bg-color="transparent" color="#f8f8f8">
			<u-tr>
				<u-th v-for="item in list.th">{{ item }}</u-th>
			</u-tr>
			<u-tr v-for="ritem in $store.state.bazi.table">
				<u-td v-for="hitem in ritem.list">
					<text :decode="true">{{ hitem }}</text>
				</u-td>
			</u-tr>
		</u-table>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: {
				th: ['\\', '年柱', '月柱', '日柱', '时柱']
			}
		};
	}
};
</script>

<style lang="scss"></style>
