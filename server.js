import { createServer } from 'http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;

const server = createServer(async (req, res) => {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONS 요청 처리
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API 엔드포인트
    if (req.url === '/api/generate' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { word } = JSON.parse(body);

                // 입력 검증
                if (!word || word.length !== 3) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: '정확히 3글자를 입력해주세요.' }));
                    return;
                }

                // API 키 확인
                const apiKey = process.env.ANTHROPIC_API_KEY;
                if (!apiKey) {
                    console.error('ANTHROPIC_API_KEY is not set');
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'API 키가 설정되지 않았습니다.' }));
                    return;
                }

                console.log(`삼행시 생성 요청: "${word}"`);

                // Anthropic 클라이언트 생성
                const client = new Anthropic({
                    apiKey: apiKey,
                });

                // 삼행시 생성
                const message = await client.messages.create({
                    model: "claude-opus-4-1-20250805",
                    max_tokens: 20000,
                    temperature: 1,
                    system: `당신은 삼행시 작가입니다.
사용자가 입력한 3글자로 삼행시를 작성하세요.

규칙:
1. 각 글자로 시작하는 문장을 작성합니다.
2. 긍정적이고, 마음의 위안을 주는 톤을 유지합니다.
3. 각 줄은 자연스럽게 이어져야 합니다.

출력 형식 (반드시 이 형식만 출력):
[첫번째글자]: [문장]
[두번째글자]: [문장]
[세번째글자]: [문장]

주의
: 음식 단어 지양.
: 삼행시 3줄만 출력하세요. 인사말, 설명, 부연설명 등 다른 텍스트는 절대 포함하지 마세요.`,
                    messages: [
                        {
                            role: "user",
                            content: word
                        }
                    ]
                });

                // 응답에서 텍스트 추출
                const poemText = message.content[0].text;

                console.log('삼행시 생성 완료:', poemText);

                // 성공 응답
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    poem: poemText,
                    word: word
                }));

            } catch (error) {
                console.error('Error generating poem:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    error: '삼행시 생성 중 오류가 발생했습니다.',
                    details: error.message
                }));
            }
        });
        return;
    }

    // 정적 파일 제공
    if (req.url === '/' || req.url === '/index.html') {
        try {
            const html = readFileSync(join(__dirname, 'index.html'), 'utf-8');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(html);
        } catch (error) {
            res.writeHead(500);
            res.end('Error loading page');
        }
        return;
    }

    // 404
    res.writeHead(404);
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`\n🚀 삼행시 생성기 서버가 실행되었습니다!`);
    console.log(`📡 http://localhost:${PORT}\n`);
    console.log(`Ctrl+C를 눌러 서버를 종료할 수 있습니다.\n`);
});
