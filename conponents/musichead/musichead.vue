<template>
	<view class="music-head"  :style="{ color: color }">
		<view v-if="icon" class="music-head-icon" :class="{ 'music-head-iconBlack': iconBlack }">
			<text class="iconfont icon-zuojiantou" @tap="handleToBack"></text> | <text class="iconfont icon-shouye" @tap="handleToHome"></text>
		</view>
		{{ title }}
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props: ['title','icon','color','iconBlack'],
		methods: {
			handleToBack() {
				uni.navigateBack();
			},
			handleToHome() {
				uni.navigateTo({
					url: '/pages/index/index',
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.music-head {
		width: 100%;
		height: 75px;
		fsize: 16px;
		line-height: 80px;
		text-align: center;
		color: black;
		position: relative;
		
		.music-head-icon {
			position: absolute;
			left: 8px;
			top: 26px;
			width: 90px;
			background: rgba(0, 0, 0, 0.4);
			color: white;
			line-height: 31px;
			border-radius: 15px;
			display: flex;
			justify-content: space-evenly;
		}
		
		.music-head-iconBlack {
			color: black;
			border: 1px #eaeaea solid;
			background: white;
		}
	}
</style>
