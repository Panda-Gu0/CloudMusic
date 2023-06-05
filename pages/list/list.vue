<template>
	<view class="list">
		<view class="fixbg" :style="{ 'background-image': 'url('+playlist.coverImgUrl+')' }"></view>
		<musichead title="歌单" :icon="true" color="white"></musichead>
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true" >
				<view class="list-head">
					<view class="list-head-img">
						<image :src="playlist.coverImgUrl"></image>
						<text class="iconfont icon-yousanjiao">{{ playlist.playCount | foramtCount }}</text>
					</view>
					<view class="list-head-text">
						<view>{{ playlist.name }}</view>
						<view>
							<image :src="playlist.creator.avatarUrl" mode=""></image>{{ playlist.creator.nickname }}
						</view>
						<view>{{ playlist.description }}</view>
					</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<button class="list-share" open-type="share">
					<text class="iconfont icon-xiazai8"></text>分享给微信好友
				</button>
				<!-- #endif -->
				<view class="list-music">
					<view class="list-music-head">
						<text class="iconfont icon-bofang2"></text>
						<text>播放全部</text>
						<text>{{ `(共${playlist.trackCount}首)` }}</text>
					</view>
					<view class="list-music-item" v-for="(item,index) in playlist.tracks" :key="index" @tap="handleToDetail(item.id)">
						<view class="list-music-top">{{ index + 1 }}</view>
						<view class="list-music-song">
							<view>{{ item.name }}</view>
							<view>
								<!-- flag 在 60 和 70 之间表示该歌曲为独家歌曲 -->
								<image v-if="privileges[index].flag > 60 && privileges[index].flag < 70" src="../../static/dujia.png" mode=""></image>
								<!-- maxbr == 999000 则带有 sq 标签 -->
								<image v-if="privileges[index].maxbr == 999000" src="../../static/sq.png" mode=""></image>
								{{ item.ar[0].name }} - {{ item.name }}
							</view>
						</view>
						<text class="iconfont icon-bofang"></text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musichead from '../../conponents/musichead/musichead.vue'
	import { songList } from '../../common/api.js'
 	export default {
		components: {
			musichead
		},
		data() {
			return {
				playlist: {	// 存储歌单信息
					coverImgUrl: '',
					creator: {
						avatorUrl: ''
					}
				} ,
				privileges: [],	// 存储判断'独家'、'版权'等相关信息
				isLoading: true
			}
		},
		onLoad(option) {
			uni.showLoading({
				title: '加载中...'
			});
			songList(option.listId).then(res => {
				if(res.data.code == 200) {
					this.playlist = res.data.playlist;
					this.privileges = res.data.privileges;
					this.$store.commit('INIT_TOPLISTIDS', res.data.playlist.trackIds);
					this.isLoading = false;
					uni.hideLoading(); // 加载结束隐藏加载框
				}
			});
		},
		methods: {
			handleToDetail(songId) {
				uni.navigateTo({
					url: '/pages/detail/detail?songId=' + songId
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-head {
		display: flex;
		margin: 30rpx;
		
		.list-head-img {
			width: 264rpx;
			height: 264rpx;
			border-radius: 30rpx;
			overflow: hidden;
			position: relative;
			margin-right: 42rpx;
			
			image {
				width: 100%;
				height: 100%;
			}
			
			text {
				position: absolute;
				right: 18rpx;
				top: 15rpx;
				color: white;
				font-size: 26rpx;
			}
			
		}
		
		.list-head-text {
			flex: 1;
			color: #f0f2f7;
			
			view:nth-child(1){
				color: white;
				font-size: 34rpx;
			}
			
			view:nth-child(2){
				display: flex;
				margin: 20rpx 0;
				font-size: 24rpx;
				align-items: center;
				
				image {
					width: 54rpx;
					height: 54rpx;
					border-radius: 50%;
					margin-right: 14rpx;
				}
			}
			
			view:nth-child(3){
				line-height: 32rpx;
				font-size: 22rpx;
			}
			
		}
	}
	.list-share {
		width: 330rpx;
		height: 74rpx;
		margin: 0 auto;
		background: rgba(0, 0, 0, 0.4);
		border-radius: 37rpx;
		color: white;
		text-align: center;
		line-height: 74rpx;
		font-size: 28rpx;
		
		text {
			margin-right: 16rpx;
		}
	}
	
	.list-music {
		background: white;
		border-radius: 50rpx;
		margin-top: 40rpx;
		overflow: hidden;
		
		.list-music-head {
			height: 50rpx;
			margin: 30rpx 0 70rpx 22rpx;
			display: flex;
			
			text:nth-child(1) {
				height: 50rpx;
				font-size: 50rpx;
			}
			
			text:nth-child(2) {
				font-size: 30rpx;
				margin: 0 10rpx 0 26rpx;
			}
			
			text:nth-child(3) {
				font-size: 26rpx;
				color: #b2b2b2;
			}
		}
		
		.list-music-item {
			display: flex;
			margin: 0 32rpx 66rpx 46rpx;
			align-items: center;
			color: #959595;
			
			text {
				font-size: 50rpx;
				color: #c7c7c7;
			}
			
			.list-music-top {
				width: 58rpx;
				font-size: 30rpx;
				line-height: 30rpx;
			}
			
			.list-music-song {
				flex: 1;
				
				view:nth-child(1) {
					font-size: 28rpx;
					color: black;
					width: 70vw;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				
				view:nth-child(2) {
					font-size: 20rpx;
					align-items: center;
					width: 70vw;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					
					image {
						width: 32rpx;
						height: 20rpx;
						margin-right: 10rpx;
						flex-shrink: 0; // 当空间不足时，图片不会被等比缩小
					}
				}
				
			}
		}
	}
</style>
