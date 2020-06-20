var getStorage = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(null, function(result) {
			result ? resolve(result) : reject();
		});
	});
}

if(document.referrer === 'https://vu.sfc.keio.ac.jp/sfc-sfs/login.cgi'){
	let match = location.search.match(/lang=([a-z]{2}).*id=([0-9a-f]{48})/);
	(async () => {
		let storage = await getStorage();
		if(Object.keys(storage).length === 0) {
			storage = {user : {}};
		}
		storage.user.lang = match[1];
		storage.user.session = match[2];
		storage.user.lastLogin = Date.now();
		chrome.storage.local.set(storage);
	})();
	location.href = `https://vu.sfc.keio.ac.jp/sfc-sfs/portal_s/s01.cgi?id=${match[2]}&type=s&mode=1&lang=${match[1]}`;
}