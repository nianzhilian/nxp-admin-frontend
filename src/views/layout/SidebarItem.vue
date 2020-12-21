<template>
	<ul class="nav">
		<template v-for="item in routes">
			<li v-bind:class="{active: selectedNav == item.code}" v-if="!item.hidden&&item.noDropdown&&item.children.length>0" class='submenu-title-noDropdown'>
				<div @click="itemClick(item.code)">
					<router-link :to="item.path+'/'+item.children[0].path">
						<Tooltip placement="right" :transfer="true" :content="item.children[0].name">
						<Icon  :type="getIcon(item.ico)" size="16"></Icon>
						<span class="text">{{item.children[0].name}}</span>
						</Tooltip>
					</router-link>
				</div>
			</li>
			<li v-bind:class="{active: selectedNav == item.code}" v-if="!item.noDropdown&&!item.hidden">
				<div @click="itemClick(item.code)">
					<router-link :to="item.path">
						<Tooltip placement="right" :transfer="true" :content="item.name">
	          			<Icon v-if='item.ico' :type="getIcon(item.ico)" size="16"></Icon>
          				<span class="text">{{item.name}}</span>
          				</Tooltip>
					</router-link>
				</div>
				<ul>
					<template v-for="child in item.children" v-if='!child.hidden'>
						<li>
							<div @click="itemClick(item.code)">
								<router-link :to="item.path+'/'+child.path">
									<Tooltip placement="right" :transfer="true" :content="child.name">
										<Icon type="grid" size="16"></Icon>
										<span class="text">{{child.name}}</span>
									</Tooltip>
								</router-link>
							</div>
						</li>
					</template>
				</ul>
			</li>
		</template>
	</ul>
</template>

<script>
	export default {
		name: 'SidebarItem',
		selectedNav: 's1',
		props: {
			routes: {
				type: Array
			}
		},
		methods: {
			linkHref(item) {
				let obj = {
					name: item.href
				};
				return obj
			},
			itemClick(code) {
				this.selectedNav = code;
			},
			getIcon(icon) {
				return icon
			}
		},
		data() {
			return {
				tb: '',
				selectedNav: 0,
			}
		}
	}
</script>