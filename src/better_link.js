window.setTimeout(
	function(){
		if(!document.querySelector('input[name="u_login"]')){
			var st2id = location.search.match(/[0-9a-f]{48}/);
			/*document.body.innerHTML = document.body.innerHTML.replace(/href="\/sfc-sfs\/"/g, 'href="https://vu.sfc.keio.ac.jp/sfc-sfs/portal_s/s01.cgi?id=' + st2id + '&type=s&mode=1"');
			document.body.innerHTML = document.body.innerHTML.replace(/(href="https:\/\/vu\.sfc\.keio\.ac\.jp\/sfc-sfs\/.*?") target="_blank"/g, "$1 target=\"_top\"");
			document.body.innerHTML = document.body.innerHTML.replace(/(href="(?!https?:\/\/).*?") target="_blank"/g, "$1");
			document.body.innerHTML = document.body.innerHTML.replace(/ target="(?!_).*?"/g, "");
			document.body.innerHTML = document.body.innerHTML.replace(/ target="_f_new"/g, "");*/
			//document.body.innerHTML = document.body.innerHTML;
		}
	},
	1000
)