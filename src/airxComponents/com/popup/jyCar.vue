<!--车型规格-->
<template>
	<div>
		<Row>
			<Col span="8"> 品牌</Col>
			<Col span="16"> {{data.brandName}}</Col>
		</Row>
		<Row>
			<Col span="8"> 车系</Col>
			<Col span="16"> {{data.familyName}}</Col>
		</Row>
		<Row>
			<Col span="8"> 车组</Col>
			<Col span="16"> {{data.groupName}}</Col>
		</Row>
		<Row>
			<Col span="8"> 标准名称</Col>
			<Col span="16"> {{data.standardName}}</Col>
		</Row>
		<Row>
			<Col span="8"> 车型</Col>
			<Col span="16"> {{data.vehicleName}}</Col>
		</Row>
	</div>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../../utils/requestHttp.js'
	import { getLocalTime, dateTrans, splitK,logHttp } from '../../../utils/common.js'

	export default {
		components: {},
		props: [
			'data'
		],
		data() {
			return {

			}
		},
		mounted() {},
		methods: {},
	}
</script>

<style scoped="scoped">
</style>
