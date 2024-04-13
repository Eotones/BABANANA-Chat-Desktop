# BABANANA Chat Desktop

**BABANANA Chat Desktop** 是 [BABANANA Chat](https://banana.eotones.net/) 的桌面版應用程式，目前基本功能可以使用了。

![BABANANA Chat Desktop](https://raw.githubusercontent.com/Eotones/BABANANA-Chat-Desktop/master/assets/readme_img/babanana_chat_desktop_07_2.png)

## 下載

打包版本可以到 [Releases頁面](https://github.com/Eotones/BABANANA-Chat-Desktop/releases) 下載

## 使用說明

* 遊戲中使用的話要把遊戲調成**視窗化全螢幕**才能讓這APP顯示在最上層
* 設定選單在桌面右下角系統選單的圖示點右鍵
* 視窗畫面點右鍵有重新整理的功能

## Building

You'll need [Node.js](https://nodejs.org) installed on your computer in order to build this app.

```bash
$ git clone https://github.com/Eotones/BABANANA-Chat-Desktop.git
$ cd BABANANA-Chat-Desktop
$ npm install
$ npm start
```

## 打包成.exe執行檔

```bash
$ npm run build_win64
```

* 如果要打包其他作業系統版本的話請參考: [electron/electron-packager](https://github.com/electron/electron-packager)