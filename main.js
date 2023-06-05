import App from './App'
import './static/iconfont/iconfont.css'
import store from './store/index.js'

// 格式化播放量
Vue.filter('foramtCount', value => {
	if(value > 10000 && value < 100000000) {
		value /= 1000;
		return value.toFixed(1) + '万';
	} else if(value > 100000000) {
		value /= 100000000;
		return value.toFixed(1) + '亿';
	} else return value;
})

// 格式化时间戳
Vue.filter('formatTime', value => {
	let date = new Date(value);
	return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
})



// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App,
  store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif