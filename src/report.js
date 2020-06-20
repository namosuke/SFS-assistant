var getStorage = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(null, function(result) {
			result ? resolve(result) : reject();
		});
	});
}

(async () => {
	let query = location.search;
	let queries = query.slice(1).split('+');
	let storage = await getStorage();
	if(Object.keys(storage).length !== 0) {
		let div = document.createElement('div');
		div.innerHTML = `<a href="https://vu.sfc.keio.ac.jp/sfc-sfs/sfs_class/student/s_class_top.cgi?lang=${storage.user.lang}&yc=${queries[0]}&ks=${storage['lesson'][queries[0]]['ks']}&id=${storage.user.session}"><< 授業ページ</a>`;
		let title = document.querySelector('.one');
		title.parentNode.insertBefore(div, title);
	}
})();