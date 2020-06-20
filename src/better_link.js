if(/<a href="\/sfc-sfs\/" target="_parent"><b>SFC-SFS トップページ<\/b><\/a> に戻り、ログインしなおしてください。<br>/.test(document.body.innerHTML)) {
	location.href = 'https://vu.sfc.keio.ac.jp/sfc-sfs/';
}
var getStorage = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(null, function(result) {
			result ? resolve(result) : reject();
		});
	});
}

const rewriteLink = async () => {
	let storage = await getStorage();
	if(Object.keys(storage).length === 0) {
		chrome.storage.onChanged.addListener(rewriteLink);
	} else {
		document.body.innerHTML = document.body.innerHTML
		.replace(/<a href="\/sfc-sfs\/"><img/, `<a href="https://vu.sfc.keio.ac.jp/sfc-sfs/portal_s/s01.cgi?id=${storage.user.session}&type=s&mode=1&lang=${storage.user.lang}"><img`)
		.replace(/(href="https:\/\/vu\.sfc\.keio\.ac\.jp\/sfc-sfs\/.*?") target="_blank"/g, `$1 target="_top"`)
		.replace(/(href="(?!https?:\/\/).*?") target="_blank"/g, "$1")
		.replace(/ target="(?!_).*?"/g, "")
		.replace(/ target="_f_new"/g, "");
	}
};

rewriteLink();