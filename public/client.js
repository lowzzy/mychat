"use strict";

{
  const socket = io.connect();
  let g_userName = "";

  socket.on("connect", () => {
    console.log("connect");
  });
  //login時
  $("#login").submit(() => {
    const $userName = $("#input_name");
    const userName_val = $userName.val();
    g_userName = userName_val;
    if (userName_val) {
      $("#message_container").toggleClass("disable");
      $("#login_container").toggleClass("disable");
      $("#message_list").toggleClass("disable");
      socket.emit("login", userName_val);
    }
    $("#title").text("トーク");
    return false;
  });

  // 「Send」ボタンを押したときの処理
  $("#message").submit(() => {
    const $inp = $("#input_message");
    const text = $inp.val();

    console.log("#input_message :" + text + "by: " + g_userName);

    if (text) {
      // サーバーに、イベント名 'new message' で入力テキストを送信
      socket.emit("new message", text, g_userName);
      // テキストボックスを空に
      $inp.val("");
    }
    // フォーム送信はしない
    return false;
  });

  // サーバーからのメッセージ拡散に対する処理
  socket.on("spread message", (strMessage, userName) => {
    console.log("spread message :" + strMessage + "by: " + userName);

    // 拡散されたメッセージをメッセージリストに追加
    const li_element = $("<li>").text(userName + ":" + strMessage);
    $("#message_list").prepend(li_element);
  });

  socket.on("spread userName", (personal_info) => {
    console.log("spread userName :" + personal_info.strName);

    const li_element = $("<li>").text(
      personal_info.strDate + " : " + personal_info.strMsg
    );
    $("#message_list").prepend(li_element);
  });
}
