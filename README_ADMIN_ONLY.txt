음지중앙정보국 관리자 전용 업데이트

이 패키지는 관리자 서버/관리자 화면 파일만 포함합니다.
공개 홈페이지의 index.html, about.html, duties.html, news.html, organization.html, open.html 등은 포함하지 않으며 수정하지 않습니다.

포함 파일:
- admin.html / admin.js : 관리자 화면
- server.js / package.json : 관리자 API 및 PDF 업로드 처리
- assets/logo.png : 관리자 화면 로고
- data/*.json : 최초 실행용 빈 데이터 파일

적용 위치:
기존 eumjicontrol 서버 저장소에 위 파일을 반영하고 Render를 재배포합니다.
기존 저장 데이터가 있다면 data 폴더의 기존 파일을 덮어쓰지 마세요.
기존 환경변수 ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET, PUBLIC_SITE_ORIGIN은 유지합니다.

중요:
이 업데이트는 공개 HTML 파일을 변경하지 않습니다. 따라서 현재 공개 페이지의 디자인/HTML은 그대로 유지됩니다.
다만 기관소개/주요업무/기관안내/정보공개/PDF 내용을 공개 페이지에 자동 표시하려면, 공개 HTML이 기존 API 데이터 로딩 스크립트를 이미 포함하고 있어야 합니다. 이 패키지는 공개 HTML을 자동으로 수정하지 않습니다.
