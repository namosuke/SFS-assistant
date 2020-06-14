// sfsidをChrome strageから取得する
const get_sfsid = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(['sfsid'], function(result) {
			if(result.sfsid){
				resolve(result.sfsid);
			} else {
				let lessons = document.querySelector('#lessons');
				lessons.innerHTML = `⚠ SFC-SFSにログインしてください`;
				window.open('https://vu.sfc.keio.ac.jp/sfc-sfs/', '_blank');
			}
		});
	});
}
// 受講中のクラスを取得する
const loadLessons = (sfsid) => {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		let url = 'https://vu.sfc.keio.ac.jp/sfc-sfs/sfs_class/student/view_list.cgi?id=' + sfsid;
		xhr.open("GET", url, true);
		xhr.onreadystatechange = () => {
			if (xhr.readyState == 4 && xhr.status == 200) {
				let matches = xhr.responseText.matchAll(/<a href="(.*?)" target="_blank">(.*?)<\/a>/sg);
				resolve(matches);
			}
		}
		xhr.send();
	});
}
// 未提出の課題を取得する
const loadTasks = (url, name, progress) => {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.onreadystatechange = () => {
			if (xhr.readyState == 4 && xhr.status == 200) {
				progress.value++;
				let matches = xhr.responseText.matchAll(
					/課題No\.(.*?) \n<a href=\.\.\/report\/report\.cgi\?(.*?) target=report>「(.*?)」<\/a>\n<font color="(.*?)">(?:.*?)deadline<\/span>: (.*?), 提出者(.*?)名/sg
				);
				let text = '';
				for(let match of matches) {
					if(match[4] === 'red'){
						text += `<p><img src=https://vu.sfc.keio.ac.jp/sfc-sfs/img2/square_red.gif> No.${match[1]} 
						<a href="https://vu.sfc.keio.ac.jp/sfc-sfs/sfs_class/report/report.cgi?${match[2]}" target="_blank">「${match[3]}」</a><br>　(〆切: ${match[5]}, 提出者${match[6]}名 ) <p>`;
					}
				}
				if(text !== '') {
					text = `<p class="lesson">${name}</p>${text}`;
				}
				resolve(text);
			}
		}
		xhr.send();
	});
}

(async () => {
	const sfsid = await get_sfsid();
	let matches = await loadLessons(sfsid);
	let promises = [];
	let i = 0;
	let progress = document.querySelector('#progress');
	for(let match of matches) {
		promises[i] = loadTasks(match[1], match[2], progress);
		i++;
	}
	progress.setAttribute('max', i + 1);
	progress.value = 2;
	Promise.all(promises).then(
		response => {
			let text = '';
			for(let value of response) {
				text += value;
			}
			let lessons = document.querySelector('#lessons');
			lessons.innerHTML = text;
		}
	);
})();