import * as flexbox from './flexbox'
import * as modal from './modal'

import css from './static/css/font-awesome.min.css'

const components = {
	...flexbox,
	...modal
}

const install = function(Vue,option) {
	Object.keys(components).forEach((key)=>{
		Vue.component(components[key].name,components[key])
	})
}

export default {
	install
}
