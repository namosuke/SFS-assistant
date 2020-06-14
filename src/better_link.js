const get_sfsid = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(['sfsid'], function(result) {
			if(result.sfsid){
				resolve(result.sfsid);
			} else {
				reject();
			}
		});
	});
}
get_sfsid().then(
	response => {
		document.body.innerHTML = document.body.innerHTML
		.replace(/<a href="\/sfc-sfs\/"><img/, '<a href="https://vu.sfc.keio.ac.jp/sfc-sfs/portal_s/s01.cgi?id=' + response + '&type=s&mode=1"><img')
		.replace(/(href="https:\/\/vu\.sfc\.keio\.ac\.jp\/sfc-sfs\/.*?") target="_blank"/g, "$1 target=\"_top\"")
		.replace(/(href="(?!https?:\/\/).*?") target="_blank"/g, "$1")
		.replace(/ target="(?!_).*?"/g, "")
		.replace(/ target="_f_new"/g, "");
	}
)