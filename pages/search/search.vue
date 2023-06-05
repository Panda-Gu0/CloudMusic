<template>
	<view class="search">
		<musichead title="搜索" :icon="true" :iconBlack="true"></musichead>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="search-search">
					<text class="iconfont icon-fangdajing"></text>
					<input type="text" placeholder="搜索歌曲" v-model="searchWord" @confirm="handleToSearch(searchWord)" @input="handleToSuggest(searchWord)">
					<text class="iconfont icon-guanbi" @tap="cleanText" v-if="searchWord"></text>
				</view>
				<block v-if="searchType == 1">
				<!-- 历史搜索记录 -->
				<view class="search-history">
					<view class="search-history-head">
						<text>历史记录</text>
						<text class="iconfont icon-icon-lajitong" @tap="handleToClear"></text>
					</view>
					<view class="search-history-list">
						<view v-for="(item, index) in searchHistory" :key="index" @tap="handleToWord(item)">{{ item }}</view>
					</view>
				</view>
				<!-- 热搜榜 -->
				<view class="search-hot">
					<view class="search-hot-head">热搜榜</view>
					<view class="search-hot-item" v-for="(item, index) in searchHot" :key="index" @tap="handleToWord(item.searchWord)">
						<view class="search-hot-top">{{ index + 1 }}</view>
						<view class="search-hot-word">
							<view>
								{{ item.searchWord }}<image :src='item.iconUrl'></image>
							</view>
							<view>{{ item.content }}</view>
						</view>
						<text class="search-hot-count">{{ item.score }}</text>
					</view>
				</view>
				</block>
				<!-- 搜索结果区域 -->
				<block v-if="searchType == 2">
					<view class="search-result">
						<view class="search-result-item" v-for="(item,index) in searchList" :key="index" @tap="handleToDetail(item.id)">
							<view class="search-result-word">
								<view>{{ item.name }}</view>
								<view>{{ item.artists[0].name }} - {{ item.album.name }}</view>
							</view>
							<text class="iconfont icon-bofang"></text>
						</view>
					</view>
				</block>
				<block v-else-if="searchType == 3">
					<view class="search-suggest">
						<view class="search-suggest-head">搜索“{{ searchWord }}”</view>
						<view class="search-suggest-item" v-for="(item,index) in searchSuggest" :key="index" @tap="handleToWord(item.keyword)">
							<text class="iconfont icon-fangdajing"></text>{{ item.keyword }}
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musichead from '../../conponents/musichead/musichead.vue'
	import { searchHot, searchSuggest, searchWord } from '../../common/api.js'
	export default {
		components: {
			musichead
		},
		data() {
			return {
				searchWord: '',
				searchHot: [], // 存储搜索热词信息
				searchHistory: [], // 存储搜索记录信息
				searchType: 1, // 搜索类型(为1显示热搜榜，为2显示搜索结果)
				searchList: [], // 存储搜索结果信息
				searchSuggest: [], // 存储搜索提示信息
				timer: null // 用于防抖
			}
		},
		onLoad() {
			searchHot().then(res => {
				if(res.data.code == '200') {
					this.searchHot = res.data.data;
				}
			});
			uni.getStorage({
				key: 'searchHistory',
				success: (res) => {
					this.searchHistory = res.data;
				}
			})
		},
		methods: {
			cleanText() {
				this.searchWord = '';
				this.searchType = 1;
			},
			handleToWord(searchWord) {
				this.searchWord = searchWord;
				this.handleToSearch(searchWord);
			},
			handleToSearch(searchWord) {
				this.searchHistory.unshift(searchWord); // 将搜索过的内容存进历史记录数组当中
				this.searchHistory = [...new Set(this.searchHistory)]; // 数组去重
				if(this.searchHistory.length > 10) this.searchHistory.length = 10; // 搜索记录最多不超过10个
				uni.setStorage({ // 搜索记录存储本地实现数据持久化
					key: 'searchHistory',
					data: this.searchHistory
				});
				this.getSearchList(searchWord);
			},
			handleToClear() {
				uni.removeStorage({
					key: 'searchHistory',
					success: res => {
						this.searchHistory = [];
					}
				})
			},
			getSearchList(word) {
				searchWord(word).then(res => {
					if(res.data.code == '200') {
						this.searchList = res.data.result.songs;
						this.$store.commit('INIT_TOPLISTIDS', res.data.result.songs);
						this.searchType = 2;
					}
				})
			},
			handleToDetail(songId) {
				uni.navigateTo({
					url: '/pages/detail/detail?songId=' + songId
				})
			},
			handleToSuggest(ev) {
				let value = ev;
				if(!value) this.searchType = 1;
				// 这里用防抖
				if(this.timer !== null) clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					searchSuggest(ev).then(res => {;
						if(res.data.code == '200') {
							this.searchSuggest = res.data.result.allMatch;
							this.searchType = 3;
						}
					})
				},500)
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		
		.search-search {
			display: flex;
			align-items: center;
			height: 70rpx;
			margin: 70rpx 30rpx 30rpx 30rpx;
			background: #f7f7f7;
			border-radius: 50rpx;
			
			text {
				font-size: 26rpx;
				margin-right: 26rpx;
				margin-left: 28rpx;
			}
			
			input { 
				font-size: 29rpx;
				flex: 1;
			}
		}
		
		.search-history {
			margin: 0 30rpx 50rpx 30rpx;
			font-size: 26rpx;
			
			.search-history-head {
				display: flex;
				justify-content: space-between;
				margin-bottom: 36rpx;
			}
			
			.search-history-list {
				display: flex;
				flex-wrap: wrap;
				
				view {
					padding: 16rpx 28rpx;
					border-radius: 40rpx;
					margin-right: 30rpx;
					margin-bottom: 30rpx;
					background: #f7f7f7;
				}
			}
		}
		
		.search-hot {
			margin: 0 30rpx;
			font-size: 26rpx;
			
			.search-hot-head {
				margin-bottom: 36rpx;
			}
			
			.search-hot-item {
				display: flex;
				align-items: center;
				margin-bottom: 58rpx;
				
				.search-hot-top {
					color: #fb2222;
					width: 60rpx;
					margin-left: 8rpx;
				}
				
				.search-hot-word {
					flex: 1;
					
					view:nth-child(1) {
						font-size: 30rpx;
						color: black;
					}
					
					view:nth-child(2) {
						width: 500rpx;
						font-size: 24rpx;
						color: #878787;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					
					image {
						width: 48rpx;
						height: 22rpx;
						margin-left: 5rpx;
					}
				}
				
				.search-hot-count {
					color: #878787;
				}
			}
			
		}
		
		.search-result {
			border-top: 2rpx #e4e4e4 solid;
			padding: 30rpx;
			
			.search-result-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-bottom: 30rpx;
				margin-bottom: 30rpx;
				border-bottom: 2rpx #e4e4e4 solid;
				
				.search-result-word {
					view:nth-child(1) {
						font-size: 20rpx;
						color: #235790;
						margin-bottom: 12rpx;
					}
					
					view:nth-child(2) {
						font-size: 22rpx;
						color: #898989;
					}
				}
				text {
					font-size: 50rpx;
				}
			}
		}
		
		.search-suggest {
			border-top: 2rpx #e4e4e4 solid;
			padding: 30rpx;
			font-size: 26rpx;
			
			.search-suggest-head {
				color: #4574a5;
				margin-bottom: 74rpx;
			}
			
			.search-suggest-item {
				color: #4574a5;
				margin-bottom: 74rpx;
				
				text {
					color: #bdbdbd;
					margin-right: 28rpx;
					position: relative;
					top: 2rpx;
				}
			}
		}
	}
</style>
