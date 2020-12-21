<template>
	<div v-transfer-dom :data-transfer="transfer" class="airx-modal" :class="classObj" :value="value" v-show="visible">
		<div class="airx-modal-mask" :style="maskStyleObj" @click="closeModal"></div>
		<div class="airx-modal-box" :style="boxStyleObj">
			<div class="airx-modal-title">
				<div class="airx-modal-title-content">{{title}}</div>
				<div class="airx-modal-title-close" @click="closeModal"><i class="fa fa-times" aria-hidden="true"></i></div>
			</div>
			<div class="airx-modal-content">
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<script>
	import TransferDom from '../directives/transfer-dom';

	//import '../animate.min.css';

	export default {
		name: 'airx-modal',
		/**
		 * modal 模态接口参数
		 * @param {string} modal.zindex 模态框z-index层级
		 * @param {string} modal.title 模态框标题
		 * @param {string} modal.mask 模态框是否显示遮罩
		 * @param {string} modal.transfer 是否将当前元素置于页面DOM最底部
		 */
		directives: {
			TransferDom
		},
		props: {
			value: {
				type: Boolean,
				default: false
			},
			orient: {
				type: String,
				default: 'horizontal'
			},
			size: {
				type: String,
				default: 'lg'
			},
			zindex: {
				type: Number,
				default: 1
			},
			title: {
				type: String,
				default: '提示'
			},
			mask: {
				type: Boolean,
				default: true
			},
			shadow: {
				type: Boolean,
				default: true
			},
			transfer: {
				type: Boolean,
				default: true
			},
		},
		data() {
			return {
				visible: false,
				scrollTopSize: 0,
			}
		},
		// 在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。
		beforeCreate() {},
		// 在实例创建完成后被立即调用
		created() {},
		// 在挂载开始之前被调用
		beforeMount() {},
		// el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子
		mounted() {},
		// 数据更新时调用
		beforeUpdate() {},
		// 由于数据更改导致的虚拟 DOM 重新渲染和打补丁
		updated() {},
		// keep-alive 组件激活时调用
		activated() {},
		// keep-alive 组件停用时调用
		deactivated() {},
		// 实例销毁之前调用
		beforeDestroy() {},
		// 实例销毁后调用
		destroyed() {},
		// 当捕获一个来自子孙组件的错误时被调用
		errorCaptured() {},
		watch: {
			value(val) {
				let _self = this;
				this.visible = val;
				if(val) {
					_self.jsFun();
				}
			},
			visible(val) {
				this.$emit('input', val);
			}
		},
		computed: {
			classObj() {
				let classObj = {};
				if(this.orient === 'vertical') classObj['flex-vertical'] = true;
				return classObj;
			},
			boxStyleObj() {
				let styleObj = {};
				styleObj['z-index'] = this.zindex;
				if(!this.shadow) styleObj['box-shadow'] = 'none';

				switch(this.size) {
					case 'lg':
						styleObj['left'] = '5%';
						styleObj['right'] = '5%';
						break;
					case 'md':
						styleObj['left'] = '15%';
						styleObj['right'] = '15%';
						break;
					case 'sm':
						styleObj['left'] = '25%';
						styleObj['right'] = '25%';
						break;
					case 'xs':
						styleObj['left'] = '35%';
						styleObj['right'] = '35%';
						break;
					default:
						break;
				}

				return styleObj;
			},
			maskStyleObj() {
				let styleObj = {};
				styleObj['z-index'] = this.zindex;
				if(!this.mask) styleObj['opacity'] = 0;
				return styleObj;
			},
		},
		methods: {
			jsFun() {
				let _self = this;
				this.scrollTopSize = document.body.scrollTop;
				document.body.scrollTop = document.documentElement.scrollTop = 0;
				document.onkeydown = function(event) {
					var e = event || window.event || arguments.callee.caller.arguments[0];
					if(e && e.keyCode == 27) {
						//alert("按 esc");
						_self.closeModal();
					}
				};
			},
			closeModal() {
				this.visible = false;
				document.body.scrollTop = document.documentElement.scrollTop = this.scrollTopSize;
				this.$emit("on-close");
			},
		}
	}
</script>

<style>

</style>