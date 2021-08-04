'use strict';

{
	//モジュール
	const http = require('http');
	const express = require('express');
	const socketIO = require('socket.io');
	const moment = require('moment');
	//オブジェクト
	const app = express();//express使うため
	const server = http.Server(app);//server立ち上げ
	const io = socketIO(server);//socket.io使うため
	//定数
	const PORT = process.env.PORT || 3000;
	//グローバル変数
	let iCountUser = 0;//ユーザ数
	//接続時の処理
	io.on('connection',(socket)=>{
		console.log('connection');
		let userName="";//ニックネーム
		//切断時の処理
		socket.on('disconnect',() => {
			console.log('disconnect');
		});
		//ログイン情報の取得、処理
		socket.on('login',(userName_)=>{
			userName = userName_;
			iCountUser++;
			//時刻追加
			const strNow = moment().format("lll");
			const personal_info = {
				strName:userName,
				strMsg:userName + 'がログインしました ' + iCountUser +'人目の参加者',
				strDate:strNow,
			}
			console.log('userName : ',userName);
			//全員に送信
			io.emit('spread userName',personal_info);
		});
		//新しいメッセージ受信時の処理
		socket.on('new message',(strMessage,strUserName) => {
			console.log('new message'+strMessage+'by'+strUserName);
			//送信元含む全員に送信
			io.emit('spread message',strMessage,strUserName);
		});
	});
	//公開フォルダの指定
	app.use(express.static(__dirname + '/public'));
	//サーバーの起動
	server.listen(PORT,()=>{
		console.log('server starts on port : %d',PORT);
	});

}
