# 삼행시 생성기

Claude API를 활용한 삼행시 생성 웹 애플리케이션입니다.

## 기능

- 3글자 단어를 입력하면 자동으로 삼행시를 생성합니다
- 깔끔하고 모던한 UI 디자인
- 반응형 디자인으로 모바일에서도 사용 가능
- 로딩 애니메이션 및 에러 처리

## 기술 스택

- **Frontend**: HTML, CSS, JavaScript (Vanilla JS)
- **Backend**: Vercel Serverless Functions
- **AI**: Claude API (claude-opus-4-1-20250805)

## 로컬 개발 환경 설정

### 1. 저장소 클론

```bash
git clone <repository-url>
cd threeline
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env` 파일을 생성하고 Anthropic API 키를 설정합니다:

```bash
cp .env.example .env
```

`.env` 파일을 열어 API 키를 입력합니다:

```
ANTHROPIC_API_KEY=your_actual_api_key_here
```

API 키는 [Anthropic Console](https://console.anthropic.com/)에서 발급받을 수 있습니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## Vercel 배포

### 1. Vercel CLI 설치 (선택사항)

```bash
npm install -g vercel
```

### 2. Vercel에 배포

#### 방법 1: Vercel CLI 사용

```bash
vercel
```

처음 배포 시 프로젝트 설정을 진행합니다.

#### 방법 2: GitHub 연동

1. [Vercel 대시보드](https://vercel.com/dashboard)에 접속
2. "New Project" 클릭
3. GitHub 저장소 연결
4. 프로젝트 import

### 3. 환경 변수 설정

Vercel 대시보드에서:

1. 프로젝트 선택
2. Settings > Environment Variables 이동
3. `ANTHROPIC_API_KEY` 추가
4. Production, Preview, Development 환경에 모두 적용

### 4. 배포 완료

자동으로 빌드 및 배포가 진행되며, 고유한 URL이 생성됩니다.

## 프로젝트 구조

```
threeline/
├── api/
│   └── generate.js          # Serverless function (Claude API 호출)
├── public/
├── index.html               # 메인 HTML 파일
├── package.json             # 프로젝트 설정
├── vercel.json              # Vercel 배포 설정
├── .env.example             # 환경 변수 예시
├── .gitignore               # Git 제외 파일
├── prompt.md                # 프로젝트 요구사항
└── README.md                # 프로젝트 문서
```

## API 엔드포인트

### POST /api/generate

삼행시를 생성합니다.

**Request Body:**
```json
{
  "word": "사랑"
}
```

**Response:**
```json
{
  "poem": "사: 사랑스러운 마음이 당신에게 닿기를\n랑: 랑랑한 웃음소리가 가득하길\n: 함께하는 모든 순간이 행복하길",
  "word": "사랑"
}
```

## 사용 방법

1. 웹 페이지에 접속합니다
2. 3글자 단어를 입력합니다 (예: 사랑, 행복, 꿈)
3. "삼행시 생성" 버튼을 클릭하거나 Enter 키를 누릅니다
4. AI가 생성한 삼행시를 확인합니다

## 주의사항

- API 키는 절대 공개 저장소에 커밋하지 마세요
- `.env` 파일은 `.gitignore`에 포함되어 있습니다
- Vercel 환경 변수로 안전하게 API 키를 관리합니다

## 라이선스

MIT License
