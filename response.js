function response (room,msg,sender,isGroupChat,replier,imageDB){
//메인함수(방,문자,본내사람,단체인지아닌지,답장할때필요한객체,??)

  msg=msg.trim() //카카오톡 앞 뒤에 공백 날려줌
  if(msg=="ㅎㅇ"){ //'ㅎㅇ' 입력시 '안녕하세요' 출력
    replier.reply("안녕하세요!");
  }
  var html=Utils.getWebText("https://www.naver.com/");
  var naver=Utils.getWebText("https://m.naver.com/");

  naver=naver.split("oRTK : ")[1]; //naver에 oRTK : 뒷부분을 따옴
  naver=naver.split("oHTP")[0]; //naver에 oHTP 앞을 따옴
  naver=naver.substring(0, naver.length-2); //뒤에 두 글자 지워줌

  var json=JSON.parse(naver); //문자열->JSON(JS에서 객체를 표기하는 방법==데이터를 저장하는 형식)

  naverarr=json.d;  //클래스를 이용해 naver에 d에 접근
  var s=""; //k를 가지고 오기 위한 변수

  for(var i=0;i<10;i++){
    s+=(i+1).toStirng()+'.'+naverarr[i].k+'\n'  //k가지고 오기
  }

  if(msg=="실검"){
    replier.reply(s);
  }
}
