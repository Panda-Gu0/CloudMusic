<template>
	<view class="content">
		<musichead title="网易云音乐" :icon="false"></musichead>
		<view class="container">
			<!-- 搜索区域 -->
			<scroll-view scroll-y="true" >
				<view class="index-search" @tap="handleToSearch">
					<text class="iconfont icon-fangdajing"></text>
					<input type="text" placeholder="搜索歌曲">
				</view>
				<!-- 热榜列表 -->
				<view v-if="isLoading">
				 <m-for-skeleton
				    :avatarSize="200"
				    :row="3"
				    :loading="isLoading"
				    isarc="square"
				    v-for="(item,key) in 4"
				    :key="key"
					:title="false"
					:titleStyle="{}"
					>
				    </m-for-skeleton>
				</view>
				<view class="index-list" v-else v-for="(item, index) in topList" :key="index">
					<view class="index-list-item" @tap="handleToList(item.id)">
						<view class="index-list-img">
							<image :src="item.coverImgUrl"></image>
							<text>{{ item.updateFrequency }}</text>
						</view>
						<view class="index-list-text">
							<view v-for="(item, index) in item.tracks" :key="index">{{ index + 1 }}.{{ item.first }} - {{ item.second }}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musichead from '../../conponents/musichead/musichead.vue'
	import mForSkeleton from '../../conponents/m-for-skeleton/m-for-skeleton.vue'
	import { topList } from '../../common/api.js'
	export default {
		components: {
			musichead,
			mForSkeleton
		},
		data() {
			return {
				topList: [],
				isLoading: true
			}
		},
		onLoad() {
			topList().then(res => {
				if(res.length) {
					this.isLoading = false;
					this.topList = res;
				}
			})
		},
		methods: {
			handleToList(listId) {
				uni.navigateTo({
					url: '/pages/list/list?listId=' + listId
				});
			},
			handleToSearch() {
				uni.navigateTo({
					url:'/pages/search/search'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-search {
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
	
	.index-list {
		margin: 0 30rpx;
		
		.index-list-item {
			display: flex;
			margin-bottom: 34rpx;
			
			.index-list-img {
				width: 212rpx;
				height: 212rpx;
				position: relative;
				border-radius: 30rpx;
				overflow: hidden;
				margin-right: 22rpx;
				
				image {
					width: 100%;
					height: 100%;
				}
				
				text {
					position: absolute;
					left: 12rpx;
					bottom: 16rpx;
					color: white;
					font-size: 20rpx;
				}
				
			}
			
			.index-list-text {
				font-size: 24rpx;
				line-height: 66rpx;
				
				view {
					max-width: 450rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
</style>
