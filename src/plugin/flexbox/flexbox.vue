<template>
	<div class="my-flexbox" :class="classObj">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name: 'my-flexbox',
		props: {
			orient: {
				type: String,
				default: 'horizontal'
			},
		},
		computed: {
			classObj() {
				let classObj = {};
				if(this.orient === 'vertical') classObj['flex2-vertical'] = true;
				return classObj;
			}
		}
	}
</script>

<style>

</style>