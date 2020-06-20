// sessionをChrome strageから取得する
const getStorage = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(null, function(result) {
			result ? resolve(result) : reject();
		});
	});
}
const getSession = storage => {
	if(Object.keys(storage).length !== 0) {
		return storage.user.session;
	} else {
		let lessons = document.querySelector('#lessons');
		lessons.innerHTML = `<div class="notice">SFC-SFSにログインしてください。</div>`;
		window.open('https://vu.sfc.keio.ac.jp/sfc-sfs/', '_blank');
		return false;
	}
}

// 受講中のクラスを取得する
const loadLessons = (session) => {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		let url = 'https://vu.sfc.keio.ac.jp/sfc-sfs/sfs_class/student/view_list.cgi?id=' + session;
		xhr.open("GET", url, true);
		xhr.onreadystatechange = () => {
			if (xhr.readyState == 4 && xhr.status == 200) {
				if(/<a href="\/sfc-sfs\/" target="_parent"><b>SFC-SFS トップページ<\/b><\/a> に戻り、ログインしなおしてください。<br>/.test(xhr.responseText)) {
					let lessons = document.querySelector('#lessons');
					lessons.innerHTML = `<div class="notice">セッションがタイムアウトしました。再ログインしてください。</div>`;
					window.open('https://vu.sfc.keio.ac.jp/sfc-sfs/', '_blank');
					return;
				}
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

const load = async () => {
	let loading = document.querySelector('#loading-area');
	loading.innerHTML = `<progress value="0" max="0" id="progress"></progress>`;
	const storage = await getStorage();
	const session = getSession(storage);
	if(session) {
		let matches = await loadLessons(session);
		let promises = [];
		let i = 0;
		let progress = document.querySelector('#progress');
		for(let match of matches) {
			promises[i] = loadTasks(match[1], match[2], progress);
			i++;
		}
		progress.setAttribute('max', i);
		Promise.all(promises).then(
			response => {
				let text = '';
				for(let value of response) {
					text += value;
				}
				lessons.innerHTML = text;
				loading.innerHTML = '';
			}
		);
	}
};

let button = document.querySelector('#reload');
button.onclick = load;