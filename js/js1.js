var v8_main = document.getElementById("retrieval_v8_main");
svg = document.querySelectorAll('#retrieval_v8 li');
retrieval_v8 = document.getElementById('retrieval_v8');
retrieval_go = document.getElementById('retrieval_go');
retrieval = document.getElementById('retrieval_value');
word_item = document.getElementsByClassName('word_item');
SN = document.getElementsByClassName('SN');
go = document.getElementById('retrieval_go');
select = document.getElementsByClassName('select');
retrieval_clean = document.getElementById('retrieval_clean');
bianqian = document.getElementById('bianqian');
bianqian_text = document.getElementById('bianqian_text');


//搜索引擎列表隐藏或显示
v8_main.addEventListener('click', function (event) {
    event.stopPropagation();
    if (retrieval_v8.className === 'show') {
        retrieval_v8.className = 'hide';
    }
    else if (retrieval_v8.className === 'hide') {
        retrieval_v8.className = 'show';
    }
});
//点击区域外自动关闭搜索引擎列表和设置列表
document.addEventListener('click', function () {
    if (retrieval_v8.className === 'show') {//搜索引擎列表
        retrieval_v8.className = 'hide';
    }
    if (setWindows.className === 'show') {//设置列表
        setWindows.className = 'hide';
        set.classList.remove('animationSet');
    }
});

//引擎切换时的图片切换和链接切换
for (let i = 0; i < svg.length; i++) {
    svg[i].onclick = function () {
        let data = this.attributes.dataSvg.value;//图片切换
        let use = this.attributes.datause.value;//链接切换
        v8_main.setAttribute('src', data);
        v8_main.setAttribute('use', use);
        //存储浏览器选择
        localStorage.setItem('Default engine', use);

    }
}
//默认搜索引擎
var DE = localStorage.getItem('Default engine');
if (!DE) {
    localStorage.setItem('Default engine', 'baidu');
    v8_main.setAttribute('src', './img/v8_icon/baidu.svg');
    v8_main.setAttribute('use', 'baidu');
}
else {
    v8_main.setAttribute('src', './img/v8_icon/' + DE + '.svg');
    v8_main.setAttribute('use', DE);
}


//搜索引擎访问
retrieval_go.onclick = function () {
    let retrieval_value = document.getElementById('retrieval_value').value;
    let use = v8_main.attributes.use.value;
    switch (use) {
        case 'baidu':
            window.open('https://www.baidu.com/s?word=' + retrieval_value);
            break;
        case 'google':
            window.open('http://www.google.com/search?q=' + retrieval_value);
            break;
        case 'taobao':
            window.open('https://s.taobao.com/search?q=' + retrieval_value);
            break;
        case 'bing':
            window.open('https://cn.bing.com/search?q=' + retrieval_value);
            break;
    }
};
//选中效果
for (let p = 0; p < word_item.length; p++) {
    word_item[p].onmouseover = function () {
        clean_select();
        this.classList.add('select');
        this.onclick = function () {     //点击候选词时填充值到maim
            retrieval.value = this.innerHTML;
            go.click();
        }
    }
    word_item[p].onmouseout = function () {
        this.classList.remove('select');

    }
}

//上下键选择
var xulie = 0;
retrieval.onfocus = function () {
    retrieval.onkeyup = function (e) {
        switch (e.which) {
            default:
                getword();
                break;
            case 38 : //上键切换候选词
                xulie--;
                if (xulie < 1) {
                    xulie = SN.length;
                }
                clean_select();
                word_item[xulie - 1].classList.add('select');
                break

            case 40 : //下键切换候选词
                xulie++;
                if (xulie > SN.length) {
                    xulie = 1;
                }
                clean_select();
                word_item[xulie - 1].classList.add('select');
                break;
            case 13 :    //回车键访问
                try {
                    retrieval.value = select[0].innerHTML;
                    go.click();
                }
                catch (e) {
                    go.click();
                }
                clean_select();
                xulie = 0;
                break;
        }
    }
}

//清除所有select
function clean_select() {
    for (let i = 0; i < SN.length; i++) {
        word_item[i].classList.remove('select');
    }
}

//清除候选词
retrieval_clean.onclick = function () {
    retrieval.value = null;
    clean_words();
}

function clean_words() {
    for (i = 0; i < word_item.length; i++) {
        word_item[i].innerHTML = '';
        word_item[i].classList.remove('SN');
    }
}

//获取候选词 jsonp
function defaultSug(data) {
    let words = data.s;
    let i = 0;
    for (; i < words.length; i++) {
        word_item[i].innerHTML = words[i];
        word_item[i].classList.add('SN');
    }
}

function forGoogle(data) {
    let words = data[1];
    let i = 0;
    for (; i < words.length; i++) {
        word_item[i].innerHTML = words[i][0];
        word_item[i].classList.add('SN');
    }
}

function cb(data) {
    let words = data.result;
    let i = 0;
    for (; i < words.length; i++) {
        word_item[i].innerHTML = words[i][0];
        word_item[i].classList.add('SN');
    }
}

function getword() {
    clean_words();
    let retrieval_value = document.getElementById('retrieval_value').value;
    let use = v8_main.attributes.use.value;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    switch (use) {
        case 'baidu':
            script.src = 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?cb=defaultSug&wd=' + retrieval_value;
            break;
        case 'bing':
            script.src = 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?cb=defaultSug&wd=' + retrieval_value;
            break;
        case 'google':
            script.src = 'https://suggestqueries.google.com/complete/search?client=psy-ab&hl=zh-CN&jsonp=forGoogle&q=' + retrieval_value;
            break;
        case 'taobao':
            script.src = 'https://suggest.taobao.com/sug?code=utf-8&q=' + retrieval_value + '&callback=cb ';
            break;
    }
    document.head.appendChild(script);
    document.head.removeChild(script);
}

//获取候选词  ajax
// function getword() {
//     clean_words();
// //     let retrieval_value = document.getElementById('retrieval_value').value;
// //     let use = v8_main.attributes.use.value;
//     var ajax = new XMLHttpRequest();
//     switch (use) {
//         case 'baidu':
//             ajax.open('get', 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?cb=defaultSug&wd=' + retrieval_value);
//             ajax.send();
//             ajax.onreadystatechange = function () {
//                 if (ajax.readyState == 4 && ajax.status == 200) {
//                     console.log(ajax.responseText);
//                     eval(ajax.responseText);
//
//                     function defaultSug(arr) {
//                         let words = arr.s;
//                         let i = 0;
//                         for (; i < words.length; i++) {
//                             word_item[i].innerHTML = words[i];
//                             word_item[i].classList.add('SN');
//                         }
//                     }
//                 }
//             }
//             break;
//         case 'taobao':
//             ajax.open('get', 'https://suggest.taobao.com/sug?code=utf-8&q=' + retrieval_value);
//             ajax.send();
//             ajax.onreadystatechange = function () {
//                 if (ajax.readyState == 4 && ajax.status == 200) {
//                     let words = eval("(" + ajax.responseText + ")").result;
//                     let i = 0;
//                     for (; i < words.length; i++) {
//                         word_item[i].innerHTML = words[i][0];
//                         word_item[i].classList.add('SN');
//                     }
//                 }
//             }
//             break
//         case 'google':
//             ajax.open('get', 'http://suggestqueries.google.com/complete/search?client=psy-ab&hl=zh-CN&jsonp=forGoogle&q=' + retrieval_value);
//             ajax.send();
//             ajax.onreadystatechange = function () {
//                 if (ajax.readyState == 4 && ajax.status == 200) {
//                     var c = eval(ajax.responseText);
//
//                     function forGoogle(arr) {
//                         let words = arr[1];
//                         let i = 0;
//                         for (; i < words.length; i++) {
//                             word_item[i].innerHTML = words[i][0];
//                             word_item[i].classList.add('SN');
//                         }
//                     }
//                 }
//             }
//             break
//         case 'bing':
//             ajax.open('get', 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?cb=defaultSug&wd=' + retrieval_value);
//             ajax.send();
//             ajax.onreadystatechange = function () {
//                 if (ajax.readyState == 4 && ajax.status == 200) {
//                     eval(ajax.responseText);
//
//                     function defaultSug(arr) {
//                         let words = arr.s;
//                         let i = 0;
//                         for (; i < words.length; i++) {
//                             word_item[i].innerHTML = words[i];
//                             word_item[i].classList.add('SN');
//                         }
//                     }
//                 }
//             }
//             break;
//     }
// }


//状态存储
var OOF = localStorage.getItem('openoroff');

if (OOF === null) { //第一次使用时添加默认设置
    var oof = new Array();
    oof[0] = 'open';//便签的开关状态 默认为开
    oof[1] = 'off'; //壁纸模糊的开关状态 默认为关
    oof[2] = '1'; //当前壁纸序号 默认为1；
    oof[3] = 'off';//自定义壁纸开关状态，默认为关
    oof[4] = 'open';//壁纸控制栏的显示状态，默认显示
    oof[5] = 'open';//便签按钮的显示状态，默认显示
    localStorage.setItem('openoroff', oof);
}
var tools_oof = localStorage.getItem('openoroff').split(',');

//便签
var bianqiantxt = localStorage.getItem('text');
if (bianqiantxt) {
    bianqian_text.value = bianqiantxt;
}
else {
    bianqian_text.value = '';
}
if (tools_oof[0] === 'open') { //页面加载时判定上次关闭页面时便签窗口的显示状态
    bianqian_text.className = 'bianqian_text_open';
    bianqian.style.backgroundColor = 'rgba(13, 17, 13, 0.27)'
}
else {
    bianqian_text.className = 'bianqian_text';
}
bianqian.onclick = function () { //便签的显示和关闭
    if (bianqian_text.className === 'bianqian_text_open') {
        bianqian.style.backgroundColor = 'rgba(13, 17, 13, 0)';
        bianqian_text.className = 'bianqian_text';
        tools_oof[0] = 'off';
        localStorage.setItem('openoroff', tools_oof);
    }
    else {
        bianqian.style.backgroundColor = 'rgba(13, 17, 13, 0.27)'
        bianqian_text.className = 'bianqian_text_open';
        tools_oof[0] = 'open';
        localStorage.setItem('openoroff', tools_oof);
        bianqian_text.focus();
    }
}
bianqian_text.addEventListener('keyup', function () {//存储便签文本
    let texts = bianqian_text.value;
    localStorage.setItem('text', texts);
})

//壁纸模糊
var wallpaper_blur = document.getElementsByClassName('wallpaper_blur');
bg = document.getElementById('bg');
if (tools_oof[1] === 'open') {
    bg.className = 'bg';
}
else {
    bg.classList.remove('bg');
}
wallpaper_blur[0].onclick = function () {
    if (tools_oof[1] === 'off') {
        bg.className = 'bg';
        tools_oof[1] = 'open';
        localStorage.setItem('openoroff', tools_oof);
    }
    else {
        bg.classList.remove('bg');
        tools_oof[1] = 'off';
        localStorage.setItem('openoroff', tools_oof);
    }
}
//壁纸控制
var control_up = document.getElementsByClassName('control_up')[0];
var control_down = document.getElementsByClassName('control_down')[0];
var wallpaper_get_url = document.getElementById('wallpaper_get_url');
var wallpaper_get = document.getElementsByClassName('wallpaper_get')[0];
var wallpaper_post = document.getElementsByClassName('wallpaper_post')[0];
var wallpaper_switch = document.getElementsByClassName('wallpaper_switch')[0];
var btn_file = document.getElementById('btn_file');

var wallpaper_number = tools_oof[2];


function bggg() { //背景更改函数
    // bg.style.background = 'url("./img/background/' + wallpaper_number + '.jpg") no-repeat 0 0';//本地加载
    wallpaper_number = Number(wallpaper_number)//字符串转数字；
    switch (wallpaper_number) {//图床匹配加载
        case 1:
            bg.style.background = 'url("https://pic.superbed.cn/item/5c7a56003a213b0417fedc09") no-repeat 0 0';
            break;
        case 2:
            bg.style.background = 'url("https://pic.superbed.cn/item/5c7a58513a213b0417feffda") no-repeat 0 0';
            break;
        case 3:
            bg.style.background = 'url("https://pic.superbed.cn/item/5c7a56d23a213b0417fee990") no-repeat 0 0';
            break;
        case 4:
            bg.style.background = 'url("https://pic.superbed.cn/item/5c7a58663a213b0417ff0155") no-repeat 0 0';
            break;
        case 5:
            bg.style.background = 'url("https://pic.superbed.cn/item/5c7a587c3a213b0417ff02dc") no-repeat 0 0';
            break;
        default:
            bg.style.background = 'url("https://pic.superbed.cn/item/5c7a56003a213b0417fedc09") no-repeat 0 0';
            break;
    }
    bg.style.backgroundSize = 'cover';
}

bgqr();

function bgqr() {
    if (tools_oof[3] === 'open') {
        wallpaper_switch.style.background = 'url(./svg/annexb.svg) no-repeat rgba(0, 0, 0, 0.7) center';
        wallpaper_switch.style.backgroundSize = '90%';
        let base64 = localStorage.getItem('base64');
        bg.style.background = 'url(' + base64 + ')';
        bg.style.backgroundSize = 'cover';
    }
    else {
        bggg();
        wallpaper_switch.style.background = 'url(./svg/annex.svg) no-repeat rgba(0, 0, 0, 0.7) center';
        wallpaper_switch.style.backgroundSize = '90%';
    }
}

control_up.onclick = function () { //壁纸上回滚
    wallpaper_number--;
    if (wallpaper_number < 1) {
        wallpaper_number = 5;
    }
    tools_oof[2] = wallpaper_number;
    localStorage.setItem('openoroff', tools_oof);
    bggg();
    tools_oof[3] = 'off';
    localStorage.setItem('openoroff', tools_oof);
    bgqr();
}
control_down.onclick = function () { //壁纸下前进
    wallpaper_number++;
    if (wallpaper_number > 5) {
        wallpaper_number = 1;
    }
    tools_oof[2] = wallpaper_number;
    localStorage.setItem('openoroff', tools_oof);
    bggg();
    tools_oof[3] = 'off';
    localStorage.setItem('openoroff', tools_oof);
    bgqr();
}

//下载壁纸
wallpaper_get.onclick = function () {
    wallpaper_get_url.href = './img/background/' + wallpaper_number + '.jpg';
    wallpaper_get_url.download = 'background' + wallpaper_number + '.jpg';
    wallpaper_get_url.click();
}
//使用自定义壁纸
wallpaper_post.onclick = function () {
    btn_file.click();
}
btn_file.onchange = function () {
    changepic(this);
    wallpaper_switch.style.background = 'url(./svg/annexb.svg) no-repeat rgba(0, 0, 0, 0.7) center';
    wallpaper_switch.style.backgroundSize = '90%';
    tools_oof[3] = 'open';
    localStorage.setItem('openoroff', tools_oof);
}

function changepic(obj) {
    //Base64
    let img = getObjectURL(obj.files[0]);
    let image = new Image();
    image.src = img;
    image.onload = function () {
        let base64 = getBase64Image(image);
        // console.log(base64);
        try {
            localStorage.setItem('base64', base64);
            bg.style.background = 'url(' + base64 + ')';
            bg.style.backgroundSize = 'cover';
        }
        catch (e) {
            tools_oof[3] = 'off';
            localStorage.setItem('openoroff', tools_oof);
            bgqr();
            alert('太大了，进不来');
        }
    }

    function getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
        var dataURL = canvas.toDataURL("image/" + ext);
        return dataURL;
    }


}

function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}

//自定义壁纸开关
wallpaper_switch.onclick = function () {
    if (tools_oof[3] === 'open' && localStorage.getItem('base64') != null) {
        tools_oof[3] = 'off';
        localStorage.setItem('openoroff', tools_oof);
        bgqr();
    }
    else if (tools_oof[3] === 'off' && localStorage.getItem('base64') != null) {
        tools_oof[3] = 'open';
        localStorage.setItem('openoroff', tools_oof);
        bgqr();
    }
    else {
        alert('请先添加自定义壁纸');
        btn_file.click();
    }
}
//info图标
var info = document.getElementById('info');
var infotxt = document.getElementById('infotxt');
info.onclick = function () {
    infotxt.innerText = '请尽可能使用Chrome或Firfox访问，其他浏览器暂未作兼容适配.';
}

//设置窗口
var set = document.getElementById('set');
setWindows = document.getElementById('setWindows');
set.addEventListener('click', function (event) {
    event.stopPropagation();
    if (setWindows.className === 'show') {
        setWindows.className = 'hide';
        set.classList.remove('animationSet');
    }
    else if (setWindows.className === 'hide') {
        setWindows.className = 'show';
        set.className = 'animationSet';
    }
});

//页面重置，清空所有localstorage；
var reset = document.getElementById('reset');
reset.onclick = function () {
    localStorage.clear();
    window.location.reload();
}

//壁纸控制栏的隐藏
var wallpaperSwitch = document.getElementById('wallpaperSwitch');
bianqianSwitch = document.getElementById('bianqianSwitch');
wallpaper = document.getElementsByClassName('wallpaper')[0];
if (tools_oof[4] === 'off') {
    wallpaper.classList.add('hide');
    wallpaper_blur[0].classList.add('hide');
}
wallpaperSwitch.addEventListener('click', function (event) {
    event.stopPropagation();
    if (tools_oof[4] === 'open') {
        wallpaper.classList.add('hide');
        wallpaper_blur[0].classList.add('hide');
        tools_oof[4] = 'off';
        localStorage.setItem('openoroff', tools_oof);
    }
    else {
        wallpaper.classList.remove('hide');
        wallpaper_blur[0].classList.remove('hide');
        tools_oof[4] = 'open';
        localStorage.setItem('openoroff', tools_oof);
    }
})

//便签栏的隐藏
var bianqianButton = document.getElementsByClassName('tools')[0];
if (tools_oof[5] === 'off') {
    bianqianButton.classList.add('hide');
}
bianqianSwitch.addEventListener('click', function (event) {
    event.stopPropagation();
    if (tools_oof[5] === 'open') {
        bianqianButton.classList.add('hide');
        bianqian.style.backgroundColor = 'rgba(13, 17, 13, 0)';
        bianqian_text.className = 'hide';
        tools_oof[0] = 'off';
        tools_oof[5] = 'off';
        localStorage.setItem('openoroff', tools_oof);

    }
    else {
        bianqianButton.classList.remove('hide');
        tools_oof[5] = 'open';
        localStorage.setItem('openoroff', tools_oof);
    }
})

//备份和恢复
var backup_G = document.getElementById('backup_G');
backup_ok = document.getElementById('backup_ok');
backup_value = document.getElementById('backup_value');
backup_G.addEventListener('click', function (event) {
    event.stopPropagation();
    let backuptext = '';
    for (var i = 0; i < localStorage.length; i++) {
        backuptext += localStorage.key(i) + "`" + localStorage.getItem(localStorage.key(i)) + "~"
    }
    backup_value.value = compileStr(backuptext);
    saveFile(compileStr(backuptext));
})
backup_ok.onclick = function () {
    localStorage.clear();
    let uptext = uncompileStr(backup_value.value).split("~");
    for (i = 0; i < uptext.length; i++) {
        if (!uptext[i]) {
            //无需操作
        }
        else {
            let backuptext = uptext[i].split('`');
            localStorage.setItem(backuptext[0], backuptext[1]);
        }
    }
    window.location.reload();
}
backup_value.addEventListener("click", function (event) {
    event.stopPropagation();
})

//生成TXT文件
function fakeClick(obj) {
    var ev = document.createEvent("MouseEvents");
    ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    obj.dispatchEvent(ev);
}

function exportRaw(name, data) {
    var urlObject = window.URL || window.webkitURL || window;
    var export_blob = new Blob([data]);
    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
    save_link.href = urlObject.createObjectURL(export_blob);
    save_link.download = name;
    fakeClick(save_link);
}

function saveFile(text) {
    var inValue = text;
    exportRaw('Retrieval.txt', inValue);
}

//对字符串进行混淆
function compileStr(code) {
    var c = String.fromCharCode(code.charCodeAt(0) + code.length);
    for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
    }
    return escape(c);
}

function uncompileStr(code) { //字符串解混淆
    code = unescape(code);
    var c = String.fromCharCode(code.charCodeAt(0) - code.length);
    for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
}