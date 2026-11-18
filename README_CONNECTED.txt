음지중앙정보국 공지사항 연결 버전

관리자에서 등록한 공지사항이 일반 홈페이지의 메인 화면과 알림마당에 표시되도록 API 연결 코드가 추가되었습니다.

작동 구조
1) 관리자 페이지(admin.html)에서 공지사항 작성
2) Node.js 서버(server.js)가 data/notices.json에 저장
3) 공개 페이지(index.html, news.html)가 GET /api/notices 호출
4) 응답받은 공지사항을 화면에 표시

필수 설정 및 배포 순서
A. Node.js 서버 배포
- Node.js를 지원하는 호스팅에 이 프로젝트를 배포합니다.
- 환경변수 ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET 설정
- PUBLIC_SITE_ORIGIN=https://onlycomputeronly-source.github.io 설정
- 서버의 /api/notices 주소가 외부에서 HTTPS로 접근 가능해야 합니다.
- 서버와 데이터 파일이 재시작 후에도 보존되는 영구 저장소가 필요합니다. JSON 파일 저장 방식은 영구 디스크를 제공하는 호스팅에서만 안전하게 유지됩니다.

B. 공개 홈페이지의 API 주소 설정
- api-config.js 파일을 엽니다.
- 아래 줄의 빈 문자열을 실제 Node 서버 주소로 변경합니다.
  window.EUMJI_API_BASE_URL = "https://실제-Node-서버-주소";
- 예: https://eumji-api.example.com (예시는 형식 설명이며 실제 주소가 아닙니다.)
- 저장 후 GitHub 저장소에 커밋하여 Pages에 다시 배포합니다.

C. 관리자 페이지
- 관리자 페이지는 Node 서버 주소/admin.html 에서 엽니다.
- GitHub Pages 주소/admin.html은 정적 파일일 뿐 로그인 API와 연결되지 않으므로 관리자 접속 주소로 사용하지 않습니다.

주의
- GitHub Pages는 server.js를 실행할 수 없습니다. Node.js 백엔드는 반드시 별도로 호스팅해야 합니다.
- 브라우저에서 API를 읽도록 CORS 허용 목록을 구성했습니다.
- 현재 공지사항 데이터는 data/notices.json 파일에 저장됩니다. 호스팅이 임시 파일 시스템이면 재배포/재시작 때 데이터가 사라질 수 있으므로 영구 디스크 또는 PostgreSQL 등 영구 DB를 사용하세요.
- .env 파일과 관리자 비밀번호를 GitHub에 올리지 마세요.
- 현재 동기화된 항목은 공지사항입니다. 나머지 고정 페이지 본문 편집 기능은 아직 별도로 구현해야 합니다.
