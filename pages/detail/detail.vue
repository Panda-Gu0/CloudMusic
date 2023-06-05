<template>
	<view class="detail">
		<view class="fixbg" :style="{ 'background-image': 'url('+songDetail.al.picUrl+')' }"></view>
		<musichead :title="songDetail.name" :icon="true" color="white"></musichead>
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true" style="height: 1150rpx; overflow: scroll;">
				<!-- 磁盘滚动区域 -->
				<view class="detail-play" @tap="handleToPlay">
					<image :src="songDetail.al.picUrl" :class="{ 'detail-play-run': isPlayRotate }"></image>
					<text class="iconfont" :class="iconPlay"></text>
					<view></view>
				</view>
				<!-- 歌词滚动区域 -->
				<view class="detail-lyric">
					<view class="detail-lyric-wrap" :style="{ transform: 'translateY('+ - (lyricIndex - 1) * 82 + 'rpx)' }">
						<view class="detail-lyric-item" v-for="(item, index) in songLyric" :key="index" :class="{ active: lyricIndex == index }">{{ item.lyric }}</view>
					</view>
				</view>
				<!-- 喜欢歌曲推荐区域 -->
				<view class="detail-like">
					<view class="detail-like-head">喜欢这首歌的人也听</view>
					<view class="detail-like-item" v-for="(item, index) in songSimi" :key="index" @tap="handleToSimi(item.id)">
						<view class="detail-like-img">
							<image :src="item.album.blurPicUrl" mode=""></image>
						</view>
						<view class="detail-like-song">
							<view>{{ item.name }}</view>
							<view>
								<image v-if="item.privilege.flag > 60 && item.privilege.flag < 70" src="/static/dujia.png" mode=""></image>
								<image v-if="item.privilege.maxbr == 999000" src="/static/sq.png" mode=""></image>
								{{ item.album.artists[0].name }} - {{ item.name }}
							</view>
						</view>
						<text class="iconfont icon-bofang"></text>
					</view>
				</view>
				<!-- 评论区域 -->
				<view class="detail-comment">
					<view class="detail-comment-head">精彩评论</view>
					<view class="detail-comment-item" v-for="(item, index) in songComment" :key="index">
						<view class="detail-comment-img">
							<image :src="item.user.avatarUrl"></image>
						</view>
						<view class="detail-comment-content">
							<view class="detail-comment-title">
								<view class="detail-comment-name">
									<view>{{ item.user.nickname }}</view>
									<view>{{ item.time | formatTime }}</view>
								</view>
								<view class="detail-comment-like">{{ item.likedCount | foramtCount }}<text class="iconfont icon-dianzan" style="margin-left: 10rpx;" @tap="showTip"></text></view>
							</view>
							<view class="detail-comment-text">{{ item.content }}</view>
						</view>
					</view>
					<view class="downloadTip" @tap="showTip">
						<text>下载网易云音乐查看更多评论</text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musichead from '../../conponents/musichead/musichead.vue'
	import { songDetail, songSimi, songComment, songLyric, songUrl } from '../../common/api.js'
	export default {
		components: {
			musichead
		},
		data() {
			return {
				songDetail: {	// 存储歌曲详情信息
					al: {
						picUrl: ''
					}
				}, 
				songSimi: [], // 存储相似歌曲信息
				songComment: [], // 存储歌曲评论信息
				songLyric: [], // 存储歌词信息
				lyricIndex: 0, // 记录高亮歌词下标
				iconPlay: 'icon-zanting1', // 播放状态图标
				isPlayRotate: true, // 磁盘图是否旋转,
				isLoading: true
			}
		},
		onLoad(option) {
			this.getMusic(option.songId);
		},
		onUnload() {
			this.cancelLyricIndex();
			// #ifdef H5
			this.bgAudioMannager.destroy(); // H5 端退出时需要销毁音乐对象
			// #endif
		},
		onHide() {
			this.cancelLyricIndex();
			// #ifdef H5
			this.bgAudioMannager.destroy(); // H5 端退出时需要销毁音乐对象
			// #endif
		},
		methods: {
			getMusic(songId) {
				this.$store.commit('NEXT_ID', songId); // 获取下一首歌曲 Id
				uni.showLoading({
					title:'加载中...'
				})
				this.isLoading = true;
				
				Promise.all([ songDetail(songId), songSimi(songId), songComment(songId), songLyric(songId), songUrl(songId) ]).then(res => {
					if(res[0].data.code == '200') {
						this.songDetail = res[0].data.songs[0];
					}
					if(res[1].data.code == '200') {
						this.songSimi = res[1].data.songs;
					}
					if(res[2].data.code == '200') {
						this.songComment = res[2].data.hotComments;
					}
					if(res[3].data.code == '200') {
						let lyric = res[3].data.lrc.lyric;
						// 利用正则表达式分割歌词
						let reg =  /\[([^\]]+)\]([^\[]+)/g;
						let result = [];
						lyric.replace(reg, ($0, $1, $2) => {
							result.push({ "time": this.formatTimeToSec($1), "lyric": $2 });
						});
						this.songLyric = result;
					}
					if(res[4].data.code == '200') {
						// 使用内置 API 控制音乐播放
						if(res[4].data.data[0].freeTrialInfo !== null) {
							uni.showToast({
								title:'VIP歌曲可试听前30s',
								icon:'none',
								duration: 4000
							})
						}
						
						// #ifdef MP-WEIXIN
						this.bgAudioMannager = uni.getBackgroundAudioManager();
						this.bgAudioMannager.title = this.songDetail.name;
						// #endif
						
						// #ifdef H5
						if(!this.bgAudioMannager) { // 没有音乐播放对象的时候才构建一个新的播放对象
							this.bgAudioMannager = uni.createInnerAudioContext();
						}
						this.iconPlay = 'icon-bofang';
						this.isPlayRotate = false;
						// #endif
						
						this.bgAudioMannager.src = res[4].data.data[0].url || '';
						this.listenLyricIndex(); // 这里需要注意没有进行播放操作的时候也需要先监听一下歌词
						this.bgAudioMannager.onPlay(() => {
							this.iconPlay = 'icon-zanting1';
							this.isPlayRotate = true;
							this.listenLyricIndex();
						});
						this.bgAudioMannager.onPause(() => {
							this.iconPlay = 'icon-bofang';
							this.isPlayRotate = false;
						});
						this.bgAudioMannager.onEnded(() => { // 当前歌曲播放结束进入到下一首歌曲
							this.getMusic(this.$store.state.nextId);
						})
					}
					this.isLoading = false;
					uni.hideLoading();
				})
			},
			// 将歌词时间转换成秒
			formatTimeToSec(value) {
				let arr = value.split(':');
				return (Number(arr[0] * 60) + Number(arr[1])).toFixed(1);
			},
			// 控制音乐的播放与暂停
			handleToPlay() {
				if(this.bgAudioMannager.paused) {
					this.bgAudioMannager.play();
				} else {
					this.bgAudioMannager.pause();
					this.cancelLyricIndex();
				}
			},
			// 监听歌词 index 变化
			listenLyricIndex() {
				clearInterval(this.timer);
				this.timer = setInterval(() => {
					for(let i = this.lyricIndex; i < this.songLyric.length; i++) {
						// 处理数组越界问题(当滚动到最后一句歌词时将 lyricIndex 设置为歌词数组中的最后一个元素)
						if(this.bgAudioMannager.currentTime > this.songLyric[this.songLyric.length - 1].time) {
							return this.lyricIndex = this.songLyric.length - 1;
						}
						// 歌词高亮时机(介于上一句歌词播放结束和下一句歌词播放开始)
						if(this.bgAudioMannager.currentTime > this.songLyric[i].time && this.bgAudioMannager.currentTime < this.songLyric[i+1].time) {
							return this.lyricIndex = i;
						}
					}
				}, 900);
			},
			// 清除对歌词的监听
			cancelLyricIndex() {
				clearInterval(this.timer);
			},
			// 点击跳转到相似歌曲
			handleToSimi(songId) {
				this.getMusic(songId);
			},
			showTip() {
				uni.showToast({
				  title: '体验更多内容请前往官网下载网易云APP',
				  icon: 'none',
				  duration: 2000
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail-play {
		width: 580rpx;
		height: 580rpx;
		background: url(~@/static/disc.png);
		background-size: cover;
		margin: 214rpx auto 0 auto;
		position: relative;
		
		image {
			width: 370rpx;
			height: 370rpx;
			border-radius: 50%;
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			// 旋转动画
			animation: 10s linear move infinite;
			animation-play-state: paused;
		}
		
		.detail-play-run {
			animation-play-state: running;
		}
		@keyframes move {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}
		
		text {
			width: 100rpx;
			height: 100rpx;
			font-size: 100rpx;
			color: white;
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			margin: auto;
		}
		
		view {
			width: 230rpx;
			height: 360rpx;
			background: url(~@/static/needle.png);
			position: absolute;
			left: 100rpx;
			right: 0;
			top: -200rpx;
			margin: auto;
			background-size: cover;
		}
	}
	
	.detail-lyric {
		font-size: 32rpx;
		line-height: 82rpx;
		height: 246rpx;
		text-align: center;
		overflow: hidden;
		color: #6f6e73;
		
		.detail-lyric-wrap {
			transition: .5s;
		}
		
		.detail-lyric-item {
			width: 720rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			height: 82rpx;
		}
		
		.active {
			color: white;
		}
	}
	
	.detail-like {
		margin: 0 30rpx;
		
		.detail-like-head {
			font-size: 36rpx;
			color: white;
			margin: 50rpx 0;
		}
		
		.detail-like-item {
			display: flex;
			align-items: center;
			margin-bottom: 28rpx;
			
			.detail-like-img {
				width: 82rpx;
				height: 82rpx;
				border-radius: 20rpx;
				overflow: hidden;
				margin-right: 20rpx;
				
				image {
					width: 100%;
					height: 100%;
				}
			}
			
			.detail-like-song {
				flex: 1;
				color: #c6c2bf;
				
				view:nth-child(1) {
					font-size: 28rpx;
					color: white;
					margin-bottom: 12rpx;
				}
				
				view:nth-child(2) {
					font-size: 22rpx;
				}
				
				image {
					width: 26rpx;
					height: 20rpx;
					margin-right: 10rpx;
				}
			}
		}
		text {
			font-size: 50rpx
		}
	}
	
	.detail-comment {
		margin: 0 30rpx;
		
		.detail-comment-head {
			font-size: 36rpx;
			color: white;
			margin: 50rpx 0;
		}
		
		.detail-comment-item {
			margin-bottom: 28rpx;
			display: flex;
			
			.detail-comment-img {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 18rpx;
				
				image {
					width: 100%;
					height: 100%;
				}
			}
			
			.detail-comment-content {
				flex: 1;
				color: #cbcacf;
				
				.detail-comment-title {
					display: flex;
					justify-content: space-between;
					
					.detail-comment-name {
						view:nth-child(1) {
							font-size: 26rpx;
						}
						
						view:nth-child(2) {
							font-size: 20rpx;
						}
					}
					
					.detail-comment-like {
						font-size: 29rpx;
					}
				}
				.detail-comment-text {
					font-size: 28rpx;
					line-height: 40rpx;
					color: white;
					margin-top: 20rpx;
					border-bottom: 1px #e0e0e0 solid;
					padding-bottom: 40rpx;
				}
			}
		}
		
		.downloadTip {
			font-size: 30rpx;
			text-align: center;
			margin: 0 auto;
			margin-bottom: 20rpx;
			width: 60%;
			padding: 10rpx;
			height: 40rpx;
			line-height: 40rpx;
			border-radius: 30rpx;
			background: rgba(0, 0, 0, 0.4);
			color: white;
		}
	}
</style>
