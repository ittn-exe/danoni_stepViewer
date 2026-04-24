# danoni_stepViewer
ダンシング☆おにぎり / Dancing☆Onigiri 用の譜面ビューアです。

## 概要
個人サイトで使用しているビューアを管理しています。

## 構成
- viewer.html - 表示用HTML
- viewer.js - 本体JS
- config.json - キー種設定情報
- music_list.json - 楽曲リスト情報

## 実装されている機能
- music_list.json に記載された譜面ファイルを探しにいく
- 7 key 譜面の読み込み
- setColor、frzColorを取得し、オブジェに色をつける
- 表示譜面のハイスピ倍率変更
- 表示譜面のREVERSE表示

## 実装したはずだが未確認の機能
- 11/11L keyの読み込み

## 未実装の機能
- 7 key 以外の読み込み - ヘッダーの判定もしていなければレーンの定義もしていません
→11/11Lだけとりあえず対応した気がします(動作未確認)
- 小節線、タイミング表示
- 曲中の拍変化やBPM変化的なそういうものの表示
- その他思い付いていない機能諸々

## その他
https://github.com/ittn-exe/danoni_stepViewer/wiki
こちらで色々書きます

## 言い訳
とりあえず公開してみるテスト