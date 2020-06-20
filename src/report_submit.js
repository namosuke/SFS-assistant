// 課題表示
let query = location.search;
let report = "report.cgi" + query;

let kadai = document.createElement('div');
kadai.id = 'kadai';
kadai.innerHTML = '<progress></progress>';
kadai.style.padding = '16px';
kadai.style.width = '575px';
let form = document.querySelector('form[name="form_text"]') 
|| document.querySelector('form[name="form_file"]') 
|| document.querySelector('form[name="form_url"]');
form.insertBefore(kadai, form.firstChild);

let xhr = new XMLHttpRequest();
xhr.open("GET", report, true);
xhr.onreadystatechange = function() {
	if (xhr.readyState == 4 && xhr.status == 200) {
		let response = xhr.responseText.match(/<table border=1 cellpadding=10 cellspacing=0 bgcolor=#ffeecc width=500>(.*?)<\/table>/s)[0];
		if(response) {
			document.querySelector('#kadai').innerHTML = response;
		} else {
			alert('課題内容を取得できません');
		}
	}
}
xhr.send();

// リセットボタン抹消
document.querySelector('input[type="reset"]').style.display = 'none';
let submit = document.querySelector('input[type="submit"]');
submit.style.width = '200px';
submit.style.height = '50px';

// タイトルに自動入力
let autocomp = function() {
	document.querySelector('input[name="title"]').value = document.body.innerHTML.match(/「<a href="report\.cgi.*?">(.*?)<\/a>」<\/b><br>/s)[1];
}
window.setTimeout(autocomp, 10);  // 早すぎるとだめっぽい？

// 提出時にコピーは後回し

// 文字数カウント
if(document.querySelector('textarea[name="report_text"]')) {
	let div = document.createElement('div');
	div.id = "textCounter";
	document.querySelector('textarea[name="report_text"]').parentNode.insertBefore(div, document.querySelector('textarea[name="report_text"]').nextSibling);

	document.addEventListener('keyup', function() {
		let text = document.querySelector('textarea[name="report_text"]').value;
		if(text.match(/[a-z]/gi)?.length * 2 >= text.length) {
			let words = text.replace(/[ \n.,!?()<>'"[\]]+/g, ' ').split(' ');
			if(words[words.length - 1] == '') {
				wordsLen = words.length - 1;
			} else {
				wordsLen = words.length;
			}
			counter = `${wordsLen} word${wordsLen == 1 ? '' : 's'}`;
		} else {
			counter = `${text.length} 文字`;
		}
		document.querySelector('#textCounter').innerHTML = counter;
	});
}