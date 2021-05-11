// 渲染進程 renderer-process
console.log('[renderer-process] start');

const {ipcRenderer} = require('electron');

const win_name = 'chat';
const chat_lines_limit = 50;

const chat_main = {
    get_chat_dom: function() {
        this.dom = document.querySelector("#output");
        this.dom_heat = document.querySelector("#heat");
        this.dom_view = document.querySelector("#view");
    },
    writeToScreen: function(message, class_name_arr){
        let pre = document.createElement("div");

        pre.classList.add("output_lines");
        if (typeof class_name_arr !== "undefined") {
            pre.classList.add(...class_name_arr);
        } else {
            pre.classList.add("kk_chat");
        }

        message = message.trim();

        pre.textContent = message;

        this.dom.appendChild(pre);

        this.scroll_to_bottom_auto();

        while(this.dom.childElementCount > chat_lines_limit){
            this.dom.removeChild(this.dom.childNodes[0]); 
        }

        this.scroll_to_bottom_auto();
    },
    scroll_to_bottom_auto: function () { //畫面自動捲動
        this.dom.parentElement.scrollTo(0, this.dom.scrollHeight); //畫面自動捲動
    },
    display_heat: function(arg){
        this.dom_heat.textContent = `●熱度: ${arg}`;
    },
    display_view: function(arg){
        this.dom_view.textContent = `●觀眾數: ${arg}`;
    }
};

document.addEventListener('DOMContentLoaded', function () {
    //傳送視窗載入完成狀態
    //(主進程本身有偵測視窗載入完成的狀況,另外再寫ipc通訊是可以讓程式依需求往後調整延遲執行)
    // ipcRenderer.send('win-loaded', 'chat-window');

    //當兩個視窗都載入完成時才讓兩個視窗進行通訊
    ipcRenderer.on('win-loaded', (event, message) => {
        if(message === 'all-windows-loaded') {
            //ipc code..
        }
    });

    chat_main.get_chat_dom();

    //ipcRenderer
    ipcRenderer.on('main-to-chat', (event, message) => {
        //console.log(message); // Prints 'whoooooooh!'
        document.querySelector("#footer_msg").textContent = `接收: ${message}`;

        //chat_main.writeToScreen(message);
    });

    ipcRenderer.on('chat-msg', (event, message) => {
        chat_main.writeToScreen(message);
    });

    ipcRenderer.on('main-to-chat-heat', (event, arg) => {
        chat_main.display_heat(arg);
    });

    ipcRenderer.on('main-to-chat-view', (event, arg) => {
        chat_main.display_view(arg);
    });
});