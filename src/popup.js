// sessionをChrome strageから取得
const getStorage = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(null, function(result) {
			result ? resolve(result) : reject();
		});
	});
}
const checkStorage = storage => {
	if(Object.keys(storage).length === 0) {
		let lessons = document.querySelector('#lessons');
		lessons.innerHTML = `<div class="notice">SFC-SFSにログインしてください。</div>`;
		window.open('https://vu.sfc.keio.ac.jp/sfc-sfs/', '_blank');
		return false;
	} else {
		return true;
	}
}

// 受講中のクラスを取得
const loadLessons = (storage) => {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		let url = `https://vu.sfc.keio.ac.jp/sfc-sfs/sfs_class/student/view_list.cgi?id=${storage.user.session}`;
		xhr.open("GET", url, true);
		xhr.onreadystatechange = () => {
			if (xhr.readyState == 4 && xhr.status == 200) {
				if(/<a href="\/sfc-sfs\/" target="_parent"><b>SFC-SFS トップページ<\/b><\/a> に戻り、ログインしなおしてください。<br>/.test(xhr.responseText)) {
					let lessons = document.querySelector('#lessons');
					lessons.innerHTML = `<div class="notice">セッションがタイムアウトしました。再ログインしてください。</div>`;
					window.open('https://vu.sfc.keio.ac.jp/sfc-sfs/', '_blank');
					return;
				}
				let matches = xhr.responseText.matchAll(/<a href=".*?ks=(\w*)&yc=(\w*).*?" target="_blank">(.*?)<\/a>/sg);
				resolve(matches);
			}
		}
		xhr.send();
	});
}

// 課題を取得
const loadTasks = (yc, storage, progress) => {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		let url = `https://vu.sfc.keio.ac.jp/sfc-sfs/sfs_class/student/s_class_top.cgi?yc=${yc}&id=${storage.user.session}`;
		xhr.open("GET", url, true);
		xhr.onreadystatechange = () => {
			if (xhr.readyState == 4 && xhr.status == 200) {
				progress.value++;
				let matches = xhr.responseText.matchAll(
					/課題No\.(.*?) \n<a href=\.\.\/report\/report\.cgi.*? target=report>「(.*?)」<\/a>\n<font color="(.*?)">.*?deadline<\/span>: (.*?), 提出者(.*?)名/sg
				);
				storage['lesson'][yc]['task'] = [];
				let i = 0;
				for(let match of matches) {
					storage['lesson'][yc]['task'][i] = {
						taskNum : Number(match[1]),
						name : match[2],
						submitted : (match[3] === 'green'),
						deadline : match[4],
						submitter : Number(match[5])
					}
					i++;
				}
				resolve();
			}
		}
		xhr.send();
	});
}

const load = async () => {
	const storage = await getStorage();
	if(checkStorage(storage)) {
		document.querySelector('#reload').style.display = 'none';
		let loading = document.querySelector('#loading-area');
		loading.innerHTML = `<progress value="0" max="0" id="progress"></progress>`;
		// ストレージ初期化
		storage['lesson'] = {};
		let matches = await loadLessons(storage);
		let promises = [];
		let i = 0;
		let progress = document.querySelector('#progress');
		for(let match of matches) {
			storage['lesson'][match[2]] = {
				ks : match[1],
				name : match[3]
			};
			promises[i] = loadTasks(match[2], storage, progress);
			i++;
		}
		progress.setAttribute('max', i);
		progress.value++;
		Promise.all(promises).then(
			() => {
				storage.user.lastTaskUpdate = Date.now();
				console.log(storage);
				chrome.storage.local.set(storage);
				showTasks();
				loading.innerHTML = '';
			}
		);
	}
};

// 未提出の課題一覧を表示
const showTasks =  async () => {
	const storage = await getStorage();
	if(checkStorage(storage)) {
		if(storage.user.lastTaskUpdate) {
			let ltu = new Date(storage.user.lastTaskUpdate);
			document.querySelector('#lastTaskUpdate').innerHTML
			 = `(${ltu.getFullYear()}/${ltu.getMonth() + 1}/${ltu.getDate()} ${ltu.getHours()}:${ltu.getMinutes()})`;
		} else {
			await load();  // 未取得と見なす
		}
		let text = '';
		for(let yc in storage['lesson']) {
			let text2 = '';
			for(let task of storage['lesson'][yc]['task']){
				if(!task.submitted) {
					text2 += `<p><img src=https://vu.sfc.keio.ac.jp/sfc-sfs/img2/square_red.gif> No.${task.taskNum} 
					<a href="https://vu.sfc.keio.ac.jp/sfc-sfs/sfs_class/report/report.cgi?${yc}+${task.taskNum}+${storage.user.session}+${storage.user.lang}" target="_blank">「${task.name}」</a><br>　(〆切: ${task.deadline}, 提出者${task.submitter}名 ) <p>`;
				}
			}
			if(text2 != ''){
				text += `<p class="lesson">${storage['lesson'][yc]['name']}</p>${text2}`;
			}
		}
		document.querySelector('#lessons').innerHTML = text;
		document.querySelector('#reload').style.display = 'inline-block';
	}
}


let button = document.querySelector('#reload');
button.onclick = load;

showTasks();