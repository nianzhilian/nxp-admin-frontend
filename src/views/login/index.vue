<template>
	<div class="login-container">
		<div class="login-header">
			<div class="wraper">
				<div class="logo">
					<img src="../../assets/images/logo.png">
				</div>
				<p>管理后台登录</p>
			</div>
		</div>
		<div class="login-section">
			<div class="login-box">
				<h2>登录天驶云管理后台</h2>
				<div style="margin-right:60px;">
					<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="60">
						<div class="fix">
							<Form-item prop="name">
								<Input v-model="formValidate.name" placeholder="请输入账号" @on-enter="handleSubmit('formValidate')"></Input>
							</Form-item>
						</div>
						<div class="fix">
							<Form-item prop="pwd">
								<Input v-model="formValidate.pwd" type="password" placeholder="请输入密码" @on-enter="handleSubmit('formValidate')"></Input>
							</Form-item>
						</div>
						<Form-item>
							<Button style="width:100%" :loading="loading" @click="handleSubmit('formValidate')" type="info">登录</Button>
						</Form-item>
					</Form>
				</div>

			</div>
		</div>
		<div class="login-footer">
			<p>@北京天驶科贸有限责任公司<span>京ICP备 15006638号-2</span></p>
		</div>
	</div>
</template>

<script>
	import {
		md5
	} from '../../utils/common.js'
	import {
		fetchPostUrlencoded
	} from '../../utils/requestHttp.js'
	import Ajax from '../../utils/ajax.js'
	export default {
		data() {
				const validateBillName = (rule, value, callback) => {
					if(!value) {
						callback(new Error('请输入账号'));
					} else {
						callback();
					}
				};
				const validateBillPwd = (rule, value, callback) => {
					if(!value) {
						callback(new Error('请输入密码'));
					} else {
						callback();
					}
				};
				return {
					loading: false,
					obj:{
		        params:{
		          loginName:'',
		          passWord:''
		        },
		        url:'/nxp-admin/login'
		      },
					formValidate: {
						name: '',
						pwd: ''
					},
					ruleValidate: {
						name: [{
							validator: validateBillName,
							trigger: 'blur',
							required: true,
						}],
						pwd: [{
							validator: validateBillPwd,
							trigger: 'blur',
							required: true,
						}]
					}
				}
			},
			methods: {
				handleSubmit(name) {
					this.$refs[name].validate((valid) => {
						if(valid) {
							this.loading = true;
							this.obj.params.loginName = this.formValidate.name;
              this.obj.params.passWord = (md5(this.formValidate.pwd)).toUpperCase();
							this.$store.dispatch('LoginByUsername',this.obj).then(()=>{
								console.log(this.$store.getters.info);
								if(this.$store.getters.info.code == 105){
			              this.loading = false;
			              this.$Message.error("用户名密码不匹配");
			            }else{
										localStorage.setItem('user', JSON.stringify(this.$store.getters.info))
			              this.$router.push({ path: '/' })
			              this.loading = false;
									}
							  }).catch(()=>{
							      this.loading = !this.loading;
							  });

						} else {
							this.$Message.error('表单验证失败!');
						}
					})
				}
			}
	}
</script>

<style>
	.login-header {
		height: 56px;
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		background: #FFF;
		box-shadow: 0 0 10px #DDD;
		z-index: 99;
	}

	.login-header .wraper {
		width: 1200px;
		overflow: hidden;
		margin: 0 auto;
	}

	.login-header .wraper .logo {
		float: left;
		padding: 18px 20px 18px 0;
		background: url(../../assets/images/back_pic_03.gif) no-repeat right center;
	}

	.login-header .wraper p {
		float: left;
		line-height: 56px;
		margin-left: 24px;
		color: #555555;
		font-size: 18px;
	}

	.login-section {
		width: 100%;
		height: 100%;
		background: #f9f9f9;
	}

	.login-section .login-box {
		width: 480px;
		height: 320px;
		box-shadow: 0 0 10px #DDD;
		background: #FFF;
		position: absolute;
		left: 50%;
		top: 50%;
		margin: -160px 0 0 -240px;
	}

	.login-section .login-box h2 {
		font-size: 24px;
		text-align: center;
		line-height: 100px;
	}

	.login-footer {
		height: 56px;
		width: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
		background: #FFF;
		box-shadow: 0 0 10px #ddd;
		z-index: 98;
		text-align: center;
	}

	.login-footer p {
		line-height: 56px;
		font-size: 14px;
		color: #d2d2d2;
	}
</style>
