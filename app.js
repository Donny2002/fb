const https = require('https'); // 운영 서버용
//const http = require('http'); // 로컬 테스트용
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const request = require('request');

// .env 파일의 내용을 로딩한다
require('dotenv').config({path:"/home/ec2-user/vars/.env"})

const app = express();
 // json 형식으로 들어온 값을 처리하는 객체 등록
 // 이 객체를 등록하지 않으면 json 형식으로 전달 받은 데이터를 다룰 수 없다
app.use(bodyParser.json());

// URL 인코딩 형식으로 클라이언트가 보낸 데이터를 처리하는 객체 등록
// 이 객체를 등록하지 않으면 URL 인코딩 형식으로 전달 받은 데이터를 다룰 수 없다
app.use(bodyParser.urlencoded({
  extended: true
}));

// 클라이언트에서 정적 웹 자원을 요청했을 때 그 자원을 찾을 폴더를 지정한다
// 정적 웹 자원은 실행하지 않고 그대로 읽어서 클라이언트에게 보내는 파일(html,css,gif,jpg,js 등)
app.use(express.static('public'))

// 클라이언트 요청을 처리할 모듈을 가져온다
//import root from './routes/root.js';
//import webhook from './routes/webhook.js';
//import hello from './routes/hello.js';
// URL과 그 URL의 요청을 처리할 모듈을 설정
app.use('/', require('./routes/root'));
app.use('/webhook', require('./routes/webhook'));
app.use('/hello', require('./routes/hello'));

/*
// Incoming events handling
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  //console.log(JSON.stringify(message));

  var messageId = message.mid;
  var messageText = message.text;
  var messageAttachments = message.attachments; // 사진이나 음성 관련

  if (messageText) {
    // If we receive a text message, check to see if it matches a keyword
    // and send back the template example. Otherwise, just echo the text we received.
    if (messageText.startsWith("op:")) {
      var arr = messageText.substring(3).split(',');
      var result = 0;
      switch (arr[0]) {
        case 'plus':
          result = parseInt(arr[1]) + parseInt(arr[2]);
          break;
      }
      sendTextMessage(senderID, "결과=" + result);
    } else if (messageText == 'generic') {
      sendGenericMessage(senderID);
    } else if (messageText == 'image') {
      sendImageMessage(senderID);
    } else if (messageText == 'button1') {
      sendButton1Message(senderID);
    } else if (messageText == 'button2') {
      sendButton2Message(senderID);
    } else if (messageText == 'led') {
      sendLedMessage(senderID);
    } else {
      sendTextMessage(senderID, "올바른 명령어가 아닙니다.(T0T;)");
    }

  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}
*/

/*
function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to
  // let them know it was successful
  if (payload == "led_on") {
    sendTextMessage(senderID, "전구를 켜겠습니다");
    request({
      uri: 'http://donny-noh.xyz:8080/chatbot/json/led/on',
      qs: {
        'senderID': senderID
      },
      method: 'POST'
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log('SpringBoot 응답 ===>', body);
          var obj = JSON.parse(body);
          var senderID = obj.data.senderID;
            if (obj.state == 'success') {
              sendTextMessage(senderID, "전구-" + obj.data.state);
            } else {
              sendTextMessage(senderID, "전구제어 실패!")
            }
          } else {
            console.log('SpringBoot 요청 오류!');
            console.log(error);
          }
    })
  } else if (payload == "led_off") {
    sendTextMessage(senderID, "전구를 끄겠습니다");
  } else {
    sendTextMessage(senderID, "실행할 수 없는 명령입니다...");
  }

}
*/
//////////////////////////
// Sending helpers
//////////////////////////


// Set Express to listen out for HTTP requests
// var server = app.listen(process.env.PORT || 3000, function() {
//  console.log("Listening on port %s", server.address().port);
//});

// 인증서 데이터를 로딩 => node HTTPS 서버를 실행할 때 사용
var options = {
  key: fs.readFileSync('/home/ec2-user/vars/custom.key'),
  cert: fs.readFileSync('/home/ec2-user/vars/www_donny-noh_xyz.crt'),
  ca: fs.readFileSync('/home/ec2-user/vars/www_donny-noh_xyz.ca-bundle')
}

https.createServer(options, app).listen(9999, function() {
  console.log('서버가 시작되었습니다!')
})


/*
로컬 테스트용
http.createServer(app).listen(9999, function() {
  console.log('서버가 시작되었습니다!')
})
*/

// nodejs 모듈 설치
// => npm(node package manager) 프로그램을 이용하여 모듈을 설치한다.
// => npm install 모듈명1 모듈명2 모듈명3...
//
// express 모듈 설치
// => npm install express
