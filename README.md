# Rahel Studio Portfolio

화이트 페이퍼 릴리프를 모티프로 만든 독립 포트폴리오 사이트입니다. 기존 네 개 웹사이트는 수정하지 않았으며, 제공된 모바일 PDF를 웹 이미지로 변환해 아이패드 프레임 안에서 스크롤되도록 구성했습니다.

## 프로젝트 링크

- 청 한복: <https://cheong-hanbok.euna1234556.chatgpt.site/#process>
- 마레아 풀빌라: <https://marea-pool-villa-direct.euna1234556.chatgpt.site/>
- 라온 세무회계: <https://eunakim1984-pixel.github.io/raon-tax-office/#strategy>
- 라 펄 필라테스: <https://eunakim1984-pixel.github.io/>

## 로컬 실행

별도 빌드 과정이 없는 정적 사이트입니다.

```bash
python3 -m http.server 4173
```

브라우저에서 `http://localhost:4173`을 열면 됩니다.

## 구조

- `index.html`: 페이지 구조와 프로젝트 링크
- `styles.css`: 반응형 레이아웃, 아이패드 프레임, 스크롤 타임라인
- `script.js`: PDF 페이지 이미지 로딩, 스크롤 거리 계산, 구형 브라우저용 재생 처리
- `assets/hero`: 생성형 이미지 도구로 제작한 페이퍼 릴리프 배경
- `assets/projects`: 제공된 PDF에서 렌더링한 프로젝트 화면
