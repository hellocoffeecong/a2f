# Data Editing Guide

이 폴더의 JSON은 페이지 데이터 소스입니다.

## 파일 목록
- `news.json`: 뉴스 목록
- `education.json`: 교육 프로젝트 목록
- `publication.json`: 논문/출판 목록

## 빠른 추가 방법
1. `templates/*.template.json`에서 원하는 템플릿을 복사
2. 실제 JSON 파일에 객체 추가
3. `id`는 기존 최대값 + 1로 입력
4. `image/src`는 접근 가능한 URL(예: Vercel Blob public URL) 사용
5. 저장 후 화면 확인

## 공통 규칙
- JSON 문법 엄수: 쉼표 위치, 따옴표, 배열/객체 닫기
- `id` 중복 금지
- 날짜 문자열은 `YYYY.MM.DD` 권장
- 이미지 URL은 가능한 절대 URL 사용

## 템플릿 경로
- `templates/news.template.json`
- `templates/education.template.json`
- `templates/publication.template.json`
