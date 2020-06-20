let query = location.search;
let queries = query.slice(1).split('+');
let div = document.createElement('div');
div.innerHTML = `<a href="https://vu.sfc.keio.ac.jp/sfc-sfs/sfs_class/student/s_class_top.cgi?yc=${queries[0]}&id=${queries[2]}"><< 授業ページ</a>`;
let title = document.querySelector('.one');
title.parentNode.insertBefore(div, title);