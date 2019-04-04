var Modal_Box = document.getElementById('Modal_Box');
button_cancel = document.getElementById('button_cancel');
add_shortcuts = document.getElementById('add_shortcuts');
shortcuts_title = document.getElementById('shortcuts_title');
shortcuts_url = document.getElementById('shortcuts_url');
line = document.getElementsByClassName('line');
button_ok = document.getElementById('button_ok');
shortcuts_card = document.getElementById('shortcuts_card');
shortcuts_item = document.getElementsByClassName('shortcuts_item');
button_remove = document.getElementById('button_remove');
a_button = document.getElementsByClassName('a_button');

//创建存储序列
var Dindex = localStorage.getItem('Storage_index');
if (Dindex === null) {
    localStorage.setItem('Storage_index', 0);
}
var Storage_index = localStorage.getItem('Storage_index');

//判断input是否有值开启确认按钮
function button_CanUse() {
    this.onkeyup = function () {
        if (shortcuts_title.value != "" && shortcuts_url.value != "") {
            button_ok.removeAttribute('disabled');
            button_ok.style.background = '#4868ff';
            button_ok.style.color = 'white';
        } else {
            button_ok.setAttribute('disabled', 'disabled');
            button_ok.style.background = 'transparent';
            button_ok.style.color = '#a89ea7';

        }
    }

}

//取消按钮 关闭模态框 还原确认按钮
button_cancel.onclick = function () {
    shortcuts_title.value = null;
    shortcuts_url.value = null;
    Modal_Box.className = 'hide';
    button_ok.setAttribute('disabled', 'disabled');
    button_ok.style.background = 'transparent';
    button_ok.style.color = '#a89ea7';
}
//添加按钮 开启模态框
add_shortcuts.addEventListener("click", function () {
    Modal_Box.className = 'show';
    shortcuts_title.focus();
})
//input获取焦点focus时显示下划线
shortcuts_title.onfocus = function () {
    line[0].style.width = '100%';
    button_CanUse();
}
shortcuts_url.onfocus = function () {
    line[1].style.width = '100%';
}
//input丢失焦点时隐藏下划线
shortcuts_title.onblur = function () {
    line[0].style.width = '0';
    button_CanUse();
}
shortcuts_url.onblur = function () {
    line[1].style.width = '0';
}

//确认按钮 创建对象 存储对象 显示标签
button_ok.onclick = function () {
    let title_value = shortcuts_title.value;
    let url_value = shortcuts_url.value;
    if (url_value.substr(0, 7).toLowerCase() == "http://" || url_value.substr(0, 8).toLowerCase() == "https://") {
        url_value = url_value;
    } else {
        url_value = "http://" + url_value;
    }
    let correct = url_value.charAt(url_value.length-1);
    let favicon = url_value + "/favicon.ico";
    if(correct === '/'){
        favicon = url_value + "favicon.ico";
    }
    console.log(favicon)
    var shortcut = {
        title: title_value,
        url: url_value,
        icon: favicon
    }
    let obj = JSON.stringify(shortcut);
    let index_1 = localStorage.getItem('Storage_index');
    index_1++;
    localStorage.setItem('shortcuts' + index_1, obj);
    localStorage.setItem('Storage_index', index_1++);
    button_cancel.click();
    Establish();
    jump();

    ris();
    window.location.reload();
}

function opendom() {
    let index = localStorage.getItem('Storage_index');
    for (j = 1; j <= index; j++) {
        let ss = localStorage.getItem('shortcuts' + j);
        if (ss == null) {
        } else {
            var button_value = JSON.parse(ss);
            button_title = button_value.title;
            button_url = button_value.url;
            icon = button_value.icon;
            let index_text = 'shortcuts' + j;
            var div = document.createElement('div');
            div.innerHTML =
                '    <button date_index="' + j + ' " class="shortcuts_item ' + index_text + '" date_href= ' + button_url + '>\n' +
                '            <div class="a_img" >' +
                '<div class="a_img_t" style="background:url(' + icon + ') no-repeat;background-size: contain">' +
                '</div>' +
                '</div>' +
                '            <div class="a_span">' + button_title + '</div>\n' +
                '            <div class="a_button"   date_index= "' + index_text + '"  date_href= "' + button_url + '" date_title= ' + button_title + '></div>\n' +
                '        </button>'
            shortcuts_card.appendChild(div);

            ris();
        }
    }
}

//根据已存储的对象创建快捷方式书签
opendom();
jump();

function Establish() {
    let index = localStorage.getItem('Storage_index');
    let ss = localStorage.getItem('shortcuts' + index);
    var button_value = JSON.parse(ss);
    button_title = button_value.title;
    button_url = button_value.url;
    icon = button_value.url;
    let index_text = 'shortcuts' + index;
    var div = document.createElement('div');
    div.innerHTML = '    <button  date_index= "' + index + ' " class="shortcuts_item ' + index_text + '" date_href= ' + button_url + '>\n' +
        '            <div class="a_img">' +
        '<div class="a_img_t" style="background:url(' + icon + ') no-repeat;background-size: contain"> ' +
        '</div> ' +
        '</div>' +
        '            <div class="a_span">' + button_title + '</div>' +
        '            <div class="a_button"  date_index= "' + index_text + '"  date_href= "' + button_url + '" date_title= ' + button_title + '></div>\n' +
        '        </button>'
    shortcuts_card.appendChild(div);
}

//点击快捷方式时跳转页面
function jump() {
    for (i = 0; i < shortcuts_item.length; i++) {
        shortcuts_item[i].onclick = function () {
            let a = this.attributes.date_href.value;
            window.open(a);
        }
    }
}

//点击右上角小按钮时打开模态窗口
function ris() {
    var right_button = document.getElementsByClassName('a_button');
    for (let r = 0; r < right_button.length; r++) {
        right_button[r].addEventListener('click', function (event) {
            event.stopPropagation();
            button_remove.removeAttribute('disabled');
            Modal_Box.className = 'show';
            shortcuts_url.value = this.attributes.date_href.value;
            shortcuts_title.value = this.attributes.date_title.value;
            shortcuts_item_index = this.attributes.date_index.value;
            button_remove.onclick = function () {
                localStorage.removeItem(shortcuts_item_index);
                button_cancel.click();
                //点击移除按钮时隐藏此卡片；
                let remove_card = document.getElementsByClassName(shortcuts_item_index);
                remove_card[0].style.display = 'none';
            }
            button_ok.onclick = function () {
                let title = shortcuts_title.value;
                let url = shortcuts_url.value;
                let favicon = url + "/favicon.ico";
                let obje = {
                    title: title,
                    url: url,
                    icon: favicon
                }
                let obj = JSON.stringify(obje);
                localStorage.setItem(shortcuts_item_index, obj);
                button_cancel.click();
                window.location.reload();
            }
        })
    }

}

//拖拽排序
var sortable = Sortable.create(shortcuts_card, {
    store: {
        get: function (sortable) {
            var order = localStorage.getItem(sortable.options.group.name);
            return order ? order.split('|') : [];
        },
        set: function (sortable) {
            var order = sortable.toArray();
            localStorage.setItem(sortable.options.group.name, order.join('|'));
        }
    }
});
//菜单按钮隐藏
for (let c = 0; c < shortcuts_item.length; c++) {
    shortcuts_item[c].addEventListener('mousemove', function () {
        a_button[c].style.display = 'block';
    })
    shortcuts_item[c].addEventListener('mouseout', function () {
        a_button[c].style.display = 'none';
    })
}