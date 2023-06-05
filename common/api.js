import { baseUrl } from './config.js'

// 获取热门榜单
export function topList() {
	return new Promise((resolve, reject) => { // 使用 Promise 简化请求回来的数据
		uni.request({
			url: `${baseUrl}/toplist/detail`,
			method: 'GET',
			data: {},
			success: res => {
				let result = res.data.list;
				result.length = 4;
				resolve(result);
			},
			fail: () => {},
			complete: () => {}
		});
	}) 
}

// 获取榜单歌曲列表 
export function songList(listId) {
	return uni.request({
		url: `${baseUrl}/playlist/detail?id=${listId}`,
		method: 'GET'
	});
}

// 获取歌曲详情
export function songDetail(songId) {
	return uni.request({
		url: `${baseUrl}/song/detail?ids=${songId}`,
		method: 'GET'
	});
}

// 获取相似歌曲推荐
export function songSimi(songId) {
	return uni.request({
		url: `${baseUrl}/simi/song?id=${songId}`,
		method: 'GET'
	});
}

// 获取歌曲评论
export function songComment(songId) {
	return uni.request({
		url: `${baseUrl}/comment/music?id=${songId}`,
		method: 'GET'
	});
}

// 获取歌曲歌词
export function songLyric(songId) {
	return uni.request({
		url: `${baseUrl}/lyric?id=${songId}`,
		method: 'GET'
	});
}

// 获取歌曲资源
export function songUrl(songId) {
	return uni.request({
		url: `${baseUrl}/song/url?id=${songId}`,
		method: 'GET'
	});
}

// 获取热搜列表
export function searchHot() {
	return uni.request({
		url: `${baseUrl}/search/hot/detail`,
		method: 'GET'
	});
}

// 获取搜索结果
export function searchWord(word) {
	return uni.request({
		url: `${baseUrl}/search?keywords=${word}`,
		method: 'GET'
	});
}

// 获取搜索建议
export function searchSuggest(word) {
	return uni.request({
		url: `${baseUrl}/search/suggest?keywords=${word}&type=mobile`,
		method: 'GET'
	});
}