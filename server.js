const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "https://songjintest.netlify.app", // Netlify에서 배포한 클라이언트 URL
        methods: ["GET", "POST"],
        credentials: true
    }
});

// CORS 설정
app.use(cors({
    origin: 'https://songjintest.netlify.app',
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());  // JSON 요청을 처리하기 위해 추가

// 포트 설정 (환경 변수에서 가져오거나 기본 3000번 사용)
const port = process.env.PORT || 3000;

// 출입 금지 구역 좌표 저장을 위한 API 경로
app.post('/save-restricted-area', (req, res) => {
    const coordinates = req.body.coordinates;

    if (coordinates && Array.isArray(coordinates)) {
        console.log('Received coordinates:', coordinates);
        // 좌표를 처리하는 로직 (예: 데이터베이스에 저장 가능)
        res.status(200).json({ message: 'Coordinates saved successfully' });
    } else {
        res.status(400).json({ message: 'Invalid coordinates' });
    }
});

// 기본 경로 라우트 (테스트 용도)
app.get('/', (req, res) => {
    res.send('GPS Notification System Server is Running');
});

// 서버 실행
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
