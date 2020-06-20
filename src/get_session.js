if(document.referrer === 'https://vu.sfc.keio.ac.jp/sfc-sfs/login.cgi'){
	let session = location.search.match(/[0-9a-f]{48}/);
	chrome.storage.local.set({user: {session: session}});
	location.href = `https://vu.sfc.keio.ac.jp/sfc-sfs/portal_s/s01.cgi?id=${session}&type=s&mode=1&lang=ja`;
}