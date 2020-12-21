<template>
	<div :class="smallClass">
		<div class="header-section">
			<div class="header-main">
				<img src="../../assets/images/logo.png">
				<div class="text">
					<span class="str fl">管理后台</span>
					<span class="version">{{version1}}<br>{{version2}}</span>
					<Button @click="toFinance" icon="chatboxes" v-if="userPower(3301,3205,3601,3701,3101,3501,3511,3216,3305)" type="ghost" >财务系统</Button>
				</div>
				<div class="ops">
					<div class="usersearch">
						<Input v-model='searchStr' @on-enter="globalSearch" placeholder="搜点什么吧...">
						<Button @click="globalSearch" slot="append" icon="search"></Button>
						</Input>
					</div>
					<div class="useroper">
						<Dropdown trigger="click" placement="bottom-end">
							<Button type="ghost" v-if="getLocalStorage.userInfo">
  	            					{{getLocalStorage.userInfo['name']}}
  	            					<Icon type="arrow-down-b"></Icon>
  	        					</Button>
							<Dropdown-menu slot="list">
								<!--
								<Dropdown-item>
  	                					<Icon type="android-person" size=16></Icon>&nbsp;&nbsp<span>修改密码</span>
  	                				</Dropdown-item>
  	                				-->
								<Dropdown-item>
									<span @click="logout">
  	                					<Icon type="android-exit" size=16></Icon>&nbsp;&nbsp退出登录</span>
								</Dropdown-item>
							</Dropdown-menu>
						</Dropdown>
					</div>
					<div class="fullscreenBtn">
						<Button type="ghost" icon="arrow-expand" @click="fullScreenFun" v-if="!fullScreen"></Button>
						<Button type="ghost" icon="arrow-shrink" @click="fullScreenFun" v-if="fullScreen"></Button>
					</div>
				</div>
			</div>
		</div>
		<div class="nxp-right-content">
			<div class="main-content">
				<div class="page-frame">
					<app-main></app-main>
				</div>
			</div>
		</div>
		<div class="nxp-left-content">
			<div class="main-content">
				<div class="btn-close-nav">
					<a href="javascript:;" @click="breviaryNav">
						<Icon type="navicon-round" size="16"></Icon>
					</a>
				</div>
				<sidebar class="sidebar-container"></sidebar>
			</div>
		</div>
		<!-- <div  class="upload_loading_wrap" v-if="getLoading" >
	    <div class="mask"></div>
	    <div class="load_pos">
	        <div style="width:40px; margin: 0 auto;">
	            <div class="load4">
	                <div class="loader"></div>
	            </div>
	        </div>
	        <div class="load_txt">正在加载...</div>
	    </div>
	</div> -->
	</div>
</template>

<script>
	import { AppMain, Sidebar } from './index.js'
	import { userPower } from '../../utils/common.js'
	import { fetchGet, fetchPostUrlencoded } from '../../utils/requestHttp.js'
	import Ajax from '../../utils/ajax.js'
	export default {
		name: 'layout',
		components: {
			// Navbar,
			Sidebar,
			AppMain
		},
		computed: {
			getLocalStorage() {
				var _storage = {};
				var key = 'user';
				var storageStr = localStorage.getItem(key);
				if(storageStr) {
					_storage = JSON.parse(storageStr);
				}
				return _storage
			},
			smallClass() {
				if(this.navStatus) {
					return 'smallPage'
				} else {
					return ''
				}
			},
		},
		created() {
			let _self = this;
			Ajax.get('/nxp-sso/Auth/UserInfo').then((res)=>{
				console.log(res);
				if(res.code == 200){
					this.setLocalStorage('userInfo',res.data);
				}
			})
			// fetchPostUrlencoded('/nxp-admin/login', {}).then((res) => {
			// 	if(res.flag == 0) {} else {
			// 		this.$Message.error('请先登录');
			// 		_self.$store.dispatch('LogOut', '/nxp-admin/logout').then(() => {
			// 			location.reload() // 为了重新实例化vue-router对象 避免bug
			// 		})
			// 	}
			// })
		},
		methods: {
			setLocalStorage(attr,val){
				let obj = JSON.parse(localStorage.getItem('user'));
				obj[attr] = val;
				localStorage.setItem('user', JSON.stringify(obj));
			},
			userPower(code) {
				var _that = this;
				let re = false;
				let roles = this.$store.getters.roles;
				this.setLocalStorage('permInfo',roles);
				for (var i in arguments) {
					if(userPower(arguments[i])) {
						re = true;
						break;
					}
				}
				return re;
			},
			toFinance() {
				location.href = "/finance";
			},
			logout() {
				let _self = this;
				_self.$Modal.confirm({
					title: '提示',
					content: '<p>确认退出系统吗？</p>',
					onOk: () => {
						_self.$store.dispatch('LogOut').then(() => {
							location.reload() // 为了重新实例化vue-router对象 避免bug
						})
					},
					onCancel: () => {}
				});
			},
			globalSearch() {
				this.$router.push({
					path: '/dashboard/globalSearch',
					query: {
						str: this.searchStr
					}
				})
			},
			breviaryNav() {
				this.navStatus = !this.navStatus;
			},
			fullScreenFun() {
				if(this.fullScreen) {
					this.fullScreen = !this.fullScreen;
					if(document.exitFullscreen) {
						document.exitFullscreen();
					} else if(document.msExitFullscreen) {
						document.msExitFullscreen();
					} else if(document.mozCancelFullScreen) {
						document.mozCancelFullScreen();
					} else if(document.webkitCancelFullScreen) {
						document.webkitCancelFullScreen();
					}
				} else {
					this.fullScreen = !this.fullScreen;
					var docElm = document.documentElement;
					if(docElm.requestFullscreen) {
						docElm.requestFullscreen();
					} else if(docElm.mozRequestFullScreen) {
						docElm.mozRequestFullScreen();
					} else if(docElm.webkitRequestFullScreen) {
						docElm.webkitRequestFullScreen();
					} else if(elem.msRequestFullscreen) {
						elem.msRequestFullscreen();
					}
				}
			},
			routeWatch() {
				if(this.$route.query.str != undefined && this.$route.query.str != '') {
					if(this.searchStr != this.$route.query.str) {
						this.searchStr = this.$route.query.str;
					}
				} else {
					this.searchStr = '';
				}
			},
		},
		mounted() {
			fetchGet('/admin/builddata.txt').then((res) => {
				this.version1 = res;
			});
			fetchGet('/admin/buildnumber.txt').then((res) => {
				this.version2 = res;
			});
		},
		watch: {
			"$route": "routeWatch"
		},
		data() {
			return {
				version1: '',
				version2: '',
				searchStr: '',
				navStatus: false,
				fullScreen: false,
				roles:this.$store.getters.roles
			}
		}
	}
</script>

<style>
	.header-section {
		position: fixed;
		width: 100%;
		height: auto;
		left: 0;
		top: 0;
		line-height: 50px;
		z-index: 3;
	}

	.header-section .header-main {
		line-height: 50px;
		margin: 0 0 0 0;
		font-size: 16px;
		background: #FFFFFF;
		border-bottom: #DDDDDD 1px solid;
		overflow: hidden;
	}

	.header-section .header-main>img {
		float: left;
		/*background: url('../../assets/images/logo-space.png') no-repeat right center;*/
		display: block;
		margin: 15px 0 0 10px;
		padding: 0 20px 0 0;
	}

	.header-section .header-main .text {
		float: left;
	}

	.header-section .header-main .version {
		float: left;
		color: #ff0000;
		font-size: 12px;
		height: 24px;
		line-height: 12px;
		margin: 13px 10px 0 10px;
		overflow: hidden;
	}

	.header-section .header-main .ops {
		float: right;
		font-size: 12px;
		margin-right: 10px;
	}

	.header-section .header-main .ops .usersearch {
		float: left;
		padding: 9px 10px 9px 0;
	}

	.header-section .header-main .ops .useroper {
		float: left;
		padding: 0 10px 0;
	}

	.header-section .header-main .ops .fullscreenBtn {
		float: right;
	}

	.header-section .header-main .ivu-dropdown-item {
		line-height: normal;
	}

	.nxp-right-content {
		float: left;
		height: 100%;
		padding-top: 51px;
		width: 100%;
	}

	.nxp-right-content .main-content {
		margin: 0 0 0 200px;
	}

	.nxp-right-content .main-content .page-frame {
		padding: 20px;
	}

	.menu-rest .ivu-menu-item i {
		margin-right: 6px;
	}

	.menu-rest a {
		display: block;
		width: 100%;
		padding: 14px 24px;
	}

	.menu-rest .router-link-active {
		background: none repeat scroll 0 0 #f6f8fe;
		border: 0 none;
		color: #38c1ff;
	}

	.menu-rest .ivu-menu-vertical .ivu-menu-item {
		padding: 0;
	}

	.nxp-left-content {
		background: none repeat scroll 0 0 #ffffff;
		border-right: 1px solid #DDD;
		height: 100%;
		overflow-y: auto;
		width: 200px;
		position: fixed;
		z-index: 2;
		text-align: left;
		line-height: 50px;
	}

	.nxp-left-content .btn-close-nav {
		border-bottom: #DDD 1px solid;
		background: #f9f9f9;
		text-align: center;
		margin-top: 51px;
		line-height: 30px;
	}

	.nxp-left-content a {
		display: block;
		padding: 0 20px;
	}

	.nxp-left-content .nav li ul {
		display: none;
	}

	.nxp-left-content .nav li.active ul {
		display: block;
	}

	.nxp-left-content .text {
		margin-left: 10px;
	}

	.nxp-left-content .nav li a.router-link-active,
	.nxp-left-content .nav li a:hover {
		background-color: #e6f2ff;
		color: #38c1ff;
	}
	/*缩略模式*/

	.smallPage {}

	.smallPage .nxp-left-content {
		width: 50px;
		overflow-y: auto;
		text-align: center;
	}

	.smallPage .nxp-left-content .text {
		display: none;
	}

	.smallPage .nxp-left-content a {
		padding: 0;
	}

	.smallPage .nxp-right-content .main-content {
		margin: 0 0 0 50px;
	}
</style>
