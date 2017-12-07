const api = require('./api');
const sendAPI = require('./send');

// postback을 받았을 때 그 postback을 처리할 함수를 보관하는 객체
const postbackHandler = {};

// postback을 처리할 함수를 등록한다.
const addPostback = (postback, handler) => {
    postbackHandler[postback] = handler;
}

// 등록된 메시지 핸들러를 찾아서 리턴한다.
const getHandler = (postback) => {
    return postbackHandler[postback];
};

addPostback('/environment', (recipientId) => {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"button",
            "text":"관리하실 메뉴를 선택하세요",
            "buttons":[
              {
                "type":"postback",
                "title":"공기질",
                "payload":"/environment/fine_dust"
              },
              {
                "type":"postback",
                "title":"온도",
                "payload":"/environment/temperature"
              },
              {
                "type":"postback",
                "title":"습도",
                "payload":"/environment/humidity"
              }
            ]
          }
        }
      }
    };

    api.callMessagesAPI(messageData);
});

addPostback('/environment/fine_dust', (recipientId) => {
    sendAPI.sendTextMessage(recipientId, '현재 실내의 미세먼지 레벨은 value1 입니다.')
});

addPostback('/environment/temperature', (recipientId) => {
    sendAPI.sendTextMessage(recipientId, '현재 실내의 온도는 value2도 입니다.')
});

addPostback('/environment/humidity', (recipientId) => {
    sendAPI.sendTextMessage(recipientId, '현재 실내의 습도가 높습니다. 제습기를 가동할까요? => (하부 DOM구조는 내일^^;)')
});


addPostback('/led', (recipientId) => {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"button",
            "text":"LED 스위치",
            "buttons":[
              {
                "type":"postback",
                "title":"ON",
                "payload":"/led/on"
              },
              {
                "type":"postback",
                "title":"OFF",
                "payload":"/led/off"
              }
            ]
          }
        }
      }
    };

    api.callMessagesAPI(messageData);
});

addPostback('/led/on', (recipientId) => {
    sendAPI.sendTextMessage(recipientId, 'LED를 켭니다.')
});

addPostback('/led/off', (recipientId) => {
    sendAPI.sendTextMessage(recipientId, 'LED를 끕니다.')
});

addPostback('/addr', (recipientId) => {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"button",
            "text":"검색 항목",
            "buttons":[
              {
                "type":"postback",
                "title":"동이름",
                "payload":"/addr/dong"
              },
              {
                "type":"postback",
                "title":"도로명",
                "payload":"/addr/road"
              },
              {
                "type":"postback",
                "title":"우편번호",
                "payload":"/addr/post"
              }
            ]
          }
        }
      }
    };
    api.callMessagesAPI(messageData);
});

addPostback('/addr/dong', (recipientId) => {
    sendAPI.sendTextMessage(recipientId, '동이름?');
});

addPostback('/addr/road', (recipientId) => {
    sendAPI.sendTextMessage(recipientId, '도로명?');
});

addPostback('/addr/post', (recipientId) => {
    sendAPI.sendTextMessage(recipientId, '우편번호?');
});

addPostback('/calc', (recipientId) => {
    sendAPI.sendTextMessage(recipientId, '식을 입력하세요.\n예)2 + 3');
});

module.exports = {
    getHandler
};
