음지중앙정보국 관리자 시스템 (초기 버전)

포함 기능
- 관리자 로그인/로그아웃
- 공지사항 등록/수정/삭제
- 공지사항 JSON 파일 저장
- 로그인 시도 제한, 세션 쿠키, 보안 헤더
- 기존 공개 HTML 페이지 유지

로컬 실행
1. Node.js 설치
2. 프로젝트 폴더에서 터미널 실행
3. npm install
4. .env.example을 복사해 .env로 이름 변경
5. .env의 ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET 값을 직접 변경
6. npm start
7. http://localhost:3000/admin.html 접속

중요: .env 파일은 절대로 GitHub에 올리지 마세요. .gitignore에 포함되어 있습니다.
GitHub Pages는 server.js를 실행할 수 없습니다. 현재 공개 페이지가 GitHub Pages에 올라가 있어도 관리자 API는 별도의 Node.js 호스팅 서비스에 배포해야 합니다. 실제 공개 사이트에 공지사항이 자동 반영되도록 하려면 공개 페이지의 공지 목록을 이 API에 연결하고, API 주소를 배포 환경에 맞게 설정해야 합니다.
현재 관리자 기능은 공지사항 CRUD만 실제 서버 저장이 구현되어 있습니다. 다른 고정 페이지 내용 편집 기능은 다음 개발 단계입니다.


공지사항을 GitHub Pages 공개 홈페이지에 표시하는 연결 방법은 README_CONNECTED.txt를 참고하세요.
