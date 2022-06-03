2022 항해99 최종 프로젝트
====================
[Mafiyang] 화상 온라인 마피아 게임
--------
실시간 화상채팅으로 즐기는 온라인 마피아 게임입니다.
# 👀시연영상
https://youtu.be/lOeT7W-7Azk
# 💻아키텍쳐
![image](https://user-images.githubusercontent.com/88572124/171763166-932427fe-0eb5-4846-a9e4-d2b1b6e4b2e7.png)
# 🐑게임 플레이
![image](https://user-images.githubusercontent.com/88572124/171763294-6c15fb48-2c2c-4745-b284-95e2e617f9ad.png)
게임룸에 입장뒤 게임을 시작하면 직업을 랜덤으로 부여 받습니다.
![image](https://user-images.githubusercontent.com/88572124/171763331-fe7c1a56-4398-4741-ac8a-72e68bfcce2f.png)
밤이 되면 시민을 제외한 직업들은 각자의 능력을 사용할 수 있습니다. (마피아끼리는 채팅 가능)
![image](https://user-images.githubusercontent.com/88572124/171763359-5f19ab1c-b20d-4503-a3b4-1550ef2056a1.png)
어젯밤에 일어났던 일들을 다음날 낮에 기사로 확인할 수 있습니다.

# 📝주요 기술
- Socket.io
    1. 백엔드와 프론트 환경이 node.js, 자바스크립트 기반인 점을 들어 스프링환경에서 사용하는 sockJS가 아닌 socket.io로 개발 진행하였음
    2. 기존의 단방향 통신인 HTTP 에도 폴링, 롱폴링 등의 방법이 있지만 서버와 클라이언트가 데이터를 교환하는 횟수가 늘어나면 가해지는 부하가 커지는점과, 지원되지 않는 브라우저가 존재한다는 점을 꼽아 웹소켓 라이브러리를 사용하여 단점을 상쇄하려고 하였음.
- WebRTC
    1. 실시간 화상 커뮤니케이션을 위해 브라우저 간 직접 통신하는 WebRTC를 사용하였으며, 처음에는 서버를 구축하고자 하였으나 3주 안에 완성을 하는 것을 목표로 하였기 때문에 IP와 포트번호를 대체한 peerId를 제공하는 peerJS 라이브러리를 도입
    2. 게임룸에 입장한 유저정보를 비디오와 함께 보여주기 위해 비디오를 포함한 추가 데이터  실시간 송수신
    3. RTC의 Signaling sever는 Socket 통신으로 동시성 제어
    
# 🧑🏻‍💻마피양의 팀원들👩🏻‍💻
|Name|Position|Role|Github|
|------|---|---|---|
|김동선(리더)|BE|백엔드 게임 알고리즘 구성, Socket.io, Nest.js, 테스트 코드|https://github.com/dongsun1|
|이현승|BE|유저관리, 소셜로그인, Nest.js, 테스트 코드|https://github.com/HYUNSEUNG91|
|조찬익(부리더)|FE|프론트엔드 게임 알고리즘 구성, Socket.IO를 이용한 실시간 통신 구현|https://github.com/chamchipack|
|김지나|FE|유저관리, 소셜로그인, webRTC, 반응형UI, 배포|https://github.com/zzinao|
|김지수|Designer|디자인 담당|
