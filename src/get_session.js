if(document.referrer === 'https://vu.sfc.keio.ac.jp/sfc-sfs/login.cgi'){
	let match = location.search.match(/lang=([a-z]{2}).*id=([0-9a-f]{48})/);
	chrome.storage.local.set({
		user: {
			session: match[2],
			lang : match[1]
		}
	});
	location.href = `https://vu.sfc.keio.ac.jp/sfc-sfs/portal_s/s01.cgi?id=${match[2]}&type=s&mode=1&lang=${match[1]}`;
}