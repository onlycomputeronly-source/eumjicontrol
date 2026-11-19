음지중앙정보국 공개 홈페이지 연동 업데이트

이 패키지는 기존 공개 홈페이지 디자인을 유지하면서 관리자 페이지에서 저장한 내용을 공개 페이지에 표시하도록 연결하는 업데이트입니다.

포함 파일: index.html, about.html, duties.html, news.html, organization.html, open.html, api-config.js, public-content.js, public-notices.js, assets/logo.png

적용 방법:
1. GitHub Pages 저장소 onlycomputeronly-source/eumjicenter의 기존 파일을 백업합니다.
2. ZIP 안의 HTML 및 JS 파일을 공개 저장소에 업로드하여 기존 파일과 교체합니다.
3. assets/logo.png는 기존 파일과 동일하면 교체하지 않아도 됩니다.
4. GitHub Pages 배포 후 브라우저에서 Ctrl+F5로 새로고침합니다.

연동 내용:
- 메인/기관소개/주요업무/기관안내/정보공개: /api/content 데이터를 불러와 제목·설명·본문 표시
- 알림마당 및 메인 공지: 기존 /api/notices 연동 유지
- 기관안내: /api/documents 목록을 불러와 PDF 열람 링크 표시
- API 주소: https://eumjicontrol.onrender.com

주의: 관리자 서버의 /api/content, /api/documents, /api/notices가 동작해야 합니다. PDF 파일 자체는 Render 서버의 uploads 폴더에 저장됩니다. Render 재시작/재배포 후 파일이 유지되도록 Persistent Disk를 연결하는 것을 권장합니다.
