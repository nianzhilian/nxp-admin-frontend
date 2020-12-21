<template>
	<div class="app-container">
		<Input v-model="val" placeholder="请输入配件名称" style="width: 100%;padding: 0 0 20px 0;"></Input>
		<div slot="footer">
			<Button type="primary" @click="save()" v-if="val == ''" disabled>{{editId ? '修改' :'新增'}}</Button>
			<Button type="primary" @click="save()" v-if="val != ''">{{editId ? '修改' :'新增'}}</Button>&nbsp;&nbsp;&nbsp;
		</div>
	</div>
</template>

<script>
	import {
		md5,
		getLocalTime,
		splitK,
		rmoney,
		orderStatus,
		dateTrans
	} from '../../utils/common.js'
	import {
		fetchPostUrlencoded,
		fetchGet
	} from '../../utils/requestHttp.js'
	export default {
		props: ['editId','editVal'],
		data() {
			return {
				val:'',
				addPartsData: {
					theModal: {
						show: false,
						title: ''
					},
				},
			}
		},
		created() {
			this.watcName();
		},
		watch: {
			editId:'watcName'
		},
		methods: {
			watcName(){
				this.val = this.editVal;
			},
			myDate(Option) {
				var self = this;
				if(self.statu == 2) {
					if(Option) {
						this.startDate = Option[0] + ' ' + '00' + ':' + '00' + ':' + '00';
						this.endtDate = Option[1] + ' ' + '23' + ':' + '59' + ':' + '59';
					}
					self.getStandName();
				} else if(self.statu == 3) {
					if(Option) {
						this.startDate = Option[0] + ' ' + '00' + ':' + '00' + ':' + '00';
						this.endtDate = Option[1] + ' ' + '23' + ':' + '59' + ':' + '59';
					}
				}
			},
			//自定义添加添加名称
			save() {
				if(this.editId) {
					fetchPostUrlencoded('/nxp-admin/carLine/updatePj', {
						'pjName': this.val,
						'pjNbr': this.editId
					}).then((res) => {
						this.btnLoading = false;
						if(res.flag === 0) {
							this.$Message.success(res.msg);
							this.$emit('close');
						} else {
							this.$Message.error(res.msg);
						}
					})
				} else {
					fetchPostUrlencoded('/nxp-admin/carLine/addPj', {
						'pjName': this.val
					}).then((res) => {
						this.btnLoading = false;
						if(res.flag === 0) {
							this.$Message.success(res.msg);
							this.$emit('close');
						} else {
							this.$Message.error(res.msg);
						}
					})
				}

			}
		}
	}
</script>