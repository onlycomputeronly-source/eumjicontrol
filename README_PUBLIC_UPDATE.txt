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


본문 소제목 입력 방법:
- 관리자 페이지의 본문 입력란에서 소제목으로 사용할 줄 앞에 [제목]을 붙입니다.
- 예: [제목] 기관 소개
- 다음 줄부터 일반 문장을 입력하면 본문 문단으로 표시됩니다.
- [제목] 표시는 공개 홈페이지에 노출되지 않고, 제목 글자만 기존 남색 세로선 서식으로 표시됩니다.
- 기존에 사용하던 '기관 소개', '설립 목적', '운영 원칙', '운영 슬로건' 등 일부 제목도 계속 인식하도록 호환성을 유지했습니다.

예시:
[제목] 기관 소개
음지중앙정보국은 정보의 수집과 분석, 기록 및 보존을 중심으로 운영되는 가상의 정보기관입니다.

[제목] 설립 목적
다양한 정보와 자료를 체계적으로 정리합니다.

[제목] 운영 슬로건
우리는 음지를 지향하고, 양지를 지양한다.
