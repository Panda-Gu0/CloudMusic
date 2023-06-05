<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	.container {
		width: 100%;
		height: calc(100vh - 70px); // 头部区域固定不滑动需要减掉
		overflow: hidden;
		
		scroll-view {
			height: 100%;
		}
	}
	
	.fixbg {
		width: 100%;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		background-size: cover;
		background-position: center 0;
		filter: blur(100px);
		transform: scale(1.2);
	}
</style>
