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

  if(splitmsg[0]=="날씨"){
    weather(splitmsg[1], replier);
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

var RE = 6371.00877; // 지구 반경(km)
var GRID = 5.0; // 격자 간격(km)
var SLAT1 = 30.0; // 투영 위도1(degree)
var SLAT2 = 60.0; // 투영 위도2(degree)
var OLON = 126.0; // 기준점 경도(degree)
var OLAT = 38.0; // 기준점 위도(degree)
var XO = 43; // 기준점 X좌표(GRID)
var YO = 136; // 기1준점 Y좌표(GRID)
//
// LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
//


function dfs_xy_conv(code, v1, v2) {  //좌표변환 코드 (모름...)
    var DEGRAD = Math.PI / 180.0;
    var RADDEG = 180.0 / Math.PI;

    var re = RE / GRID;
    var slat1 = SLAT1 * DEGRAD;
    var slat2 = SLAT2 * DEGRAD;
    var olon = OLON * DEGRAD;
    var olat = OLAT * DEGRAD;

    var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);
    var rs = {};
    if (code == "toXY") {
        rs['lat'] = v1;
        rs['lng'] = v2;
        var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        var theta = v2 * DEGRAD - olon;
        if (theta > Math.PI) theta -= 2.0 * Math.PI;
        if (theta < -Math.PI) theta += 2.0 * Math.PI;
        theta *= sn;
        rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
        rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    }
    else {
        rs['x'] = v1;
        rs['y'] = v2;
        var xn = v1 - XO;
        var yn = ro - v2 + YO;
        ra = Math.sqrt(xn * xn + yn * yn);
        if (sn < 0.0) - ra;
        var alat = Math.pow((re * sf / ra), (1.0 / sn));
        alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

        if (Math.abs(xn) <= 0.0) {
            theta = 0.0;
        }
        else {
            if (Math.abs(yn) <= 0.0) {
                theta = Math.PI * 0.5;
                if (xn < 0.0) - theta;
            }
            else theta = Math.atan2(xn, yn);
        }
        var alon = theta / sn + olon;
        rs['lat'] = alat * RADDEG;
        rs['lng'] = alon * RADDEG;
    }
    return rs;
}

String.prototype.getType = function(a){  //getType메소드 추가
  return this.split("<" + a + ">")[1].split("</" + a + ">")[0];
  //str.split("<day>")[1].split("</day>")[0];와 같은 형식으로 반환
}

function weather(place, replier){
  var url="https://maps.google.com/maps/api/geocode/json?key=AIzaSyDdn71QlD4gg5LTU5tAh6D2lzEZ21nLJes&address="+encodeURI(place); //place장소를 좌표로 html로 보여줌
  var html = Util.WWW(url); //html긁어오기 == Utils.getWebText(url)
  var json = JSON.parse(html);  //전체를 JSON으로 바꿈
  json = json.results[0].geometry.location; //result 0번째에,geometry에 location에 좌표가있다.
  var v1 = json.lat; //location에 lat
  var v2 = json.lng; //location에 lng

  var rs=dfs_xy_conv("toXY",v1,v2); //좌표변환

  var weatherday = ["오늘 ", "내일 ", "모레 "];  //day는 '0, 1, 2'가 각각 '오늘 내일 모레'를 뜻함
  var weathersky = ["", "맑음", "구름 조금", "구름 많음", "흐림"];  //sky는 '1 , 2, 3, 4'가 각각 '맑음 구름조금 구름많음 흐림'을 뜻함
  var weatherpty = ["없음", "비", "비/눈", "눈/비", "눈"];  //pty는 '0~4'가 각각 '없음, 비, 비/눈, 눈/비, 눈'을 뜻함

  var kma="http://www.kma.go.kr/wid/queryDFS.jsp?gridx=" +  rs.x + "&gridy=" + rs.y; //날씨를 갖고오는 주소
  //replier.reply(kma);
  var kmahtml = Util.WWW(kma); //kma의 html
  var s=""; //최종값
  for(var i=0;i<5;i++){
    var split1="<data seq=\""+i+"\">";  //<data seq="0"> -> 날씨정보를 담고있는 한 단위
    var split2="</data>";
    var seq = kmahtml.split(split1)[1].split(split2)[0];
    var day=seq.getType("day");  // getType를 이용하여 값을 빼냄
    var hour=seq.getType("hour");
    var temp=seq.getType("temp");
    var sky=seq.getType("sky");
    var pty=seq.getType("pty");
    var pop=seq.getType("pop");
    var nowstr = "<" + weatherday[day] + hour + "시>\n";  //지금까지의 seq결과를 nowstr에 임시저장
    nowstr += temp + "도\n";
    nowstr += "강수 : " + weatherpty[pty] + "\n";
    nowstr += "강수 확률 : " + pop + "%\n\n";
    s += nowstr; //nowstr의 결과를 최종적으로 s에 대입
  }
  replier.reply(s); //출력
}

var Util = {
    WWW: function(url) {
        var ret = "asdf";
        var isFinished = false;
        try {
            new java.lang.Thread({
                run: function() {
                    if (url.indexOf("http://") !== -1 || url.indexOf("https://") !== -1) {
                        var URLContent = "";
                        var bufferedReader = new java.io.BufferedReader(new java.io.InputStreamReader(java.net.URL(url).openStream()));
                        var temp = "";
                        while ((temp = bufferedReader.readLine()) != null) {
                            URLContent += (temp + "\n");
                        }
                        bufferedReader.close();
                        ret = URLContent;
                        isFinished = true;
                    }
                    if (url.indexOf("file://") != -1) {
                        const file = new java.io.File(url.replace("file://", ""));
                        if (!(file.exists())) return "";
                        const fis = new java.io.FileInputStream(file);
                        const isr = new java.io.InputStreamReader(fis);
                        const br = new java.io.BufferedReader(isr);
                        var str = br.readLine();
                        var line = "";
                        while ((line = br.readLine()) != null) {
                            str += "\n" + line;
                        }
                        fis.close();
                        isr.close();
                        br.close();
                        ret = str;
                        isFinished = true;
                    }
                }
            }).start();
        } catch (e) {
            send("Error on WWW function" + "\n" + e);
        }
        while (1) {
            if (isFinished) return ret;
        }
    }
};
