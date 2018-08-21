function response (room,msg,sender,isGroupChat,replier,imageDB){
//메인함수(방,문자,본내사람,단체인지아닌지,답장할때필요한객체,??)

  msg=msg.trim() //카카오톡 앞 뒤에 공백 날려줌
  if(msg=="ㅎㅇ"){ //'ㅎㅇ' 입력시 '안녕하세요' 출력
    replier.reply("안녕하세요!");
  }
  var naver=Utils.getWebText("https://m.naver.com/");

  naver=naver.split("oRTK : ")[1]; //naver에 oRTK : 뒷부분을 따옴
  naver=naver.split("oHTP")[0]; //naver에 oHTP 앞을 따옴
  naver=naver.substring(0, naver.length-2); //뒤에 두 글자 지워줌

  var json=JSON.parse(naver); //문자열->JSON(JS에서 객체를 표기하는 방법==데이터를 저장하는 형식)

  naverarr=json.d;  //클래스를 이용해 naver에 d에 접근
  var s=""; //k를 가지고 오기 위한 변수

  for(var i=0;i<10;i++){
    s+=(i+1)+'.'+naverarr[i].k+'\n';  //k가지고 오기
  }

  if(msg=="실검"){
    replier.reply(s);
  }

  var splitmsg=msg.split(' '); //띄어쓰기를 기준으로 msg 나눈다.

  if(splitmsg[0]=="급식"){ //'급식/년도|월|일'
    bob(splitmsg[1],splitmsg[2],splitmsg[3],replier); //bob에서 replier를 사용하기위해 넘겨줌
  }

}

function bob(year,month,day,replier){
  var smonth='0'+month; //달을 받을때 앞에 '0'붙여주기
  smonth=smonth.slice(-2); //smonth의 뒤에서 두글자만 가져오기
  var url = "https://stu.sen.go.kr/sts_sci_md00_001.do?schulCode=B100000658&schulCrseScCode=4&schulKndScCode=04&ay="+year+"&mm="+smonth+"&"; //사이트주소
  var nice=Utils.getWebText(url).replace(/ |\n|\t|\r/g, ""); //' ','\n','\t','\r'을 전부(g) 공백으로 바꿔주기
  var split1 = "<td><div>"+day+"<br>";  //split의 기준,단위
  nice=nice.split(split1)[1];  //nice에서 split1의 뒷부분을 가져옴
  nice=nice.split("</div></td>")[0];  //nice에서 "</div></td>"의 앞부분을 가져옴 
  nice=nice.split("<br>").join('\n'); //<br>단위로 자르고  '\n'로 연결

  nice=nice.replace("[석식]","\n[석식]");//replace("바뀔문자,바꿀문자)

  nice=nice+"\n\n* 알레르기 정보\n1.난류 2.우유 3.메밀 4.땅콩 5.대두 6.밀 7.고등어 8.게 9.새우 10.돼지고기 11.복숭아 12.토마토 13.아황산류 14.호두 15.닭고기16.쇠고기 17.오징어 18.조개류(굴,전복,홍합 포함)"
  replier.reply(nice);
}
