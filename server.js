const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const pointInPolygon = require('point-in-polygon');  // 다각형 내 위치 확인용

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

// 기본 경로 라우트 추가
app.get('/', (req, res) => {
    res.send('GPS Notification System Server is Running');
});

// 포트 설정 (기본값을 5000으로 변경)
const port = process.env.PORT || 5000;

// 출입 금지 구역 좌표 설정
const restrictedArea = [
    { lat: 35.9470822, lng: 126.6853641 }, // 좌표 1
    { lat: 35.9467586, lng: 126.6854137 }, // 좌표 2
    { lat: 35.9467934, lng: 126.6856927 }, // 좌표 3
    { lat: 35.9471093, lng: 126.6856364 }, // 좌표 4
    { lat: 35.9470822, lng: 126.6853641 }  // 좌표 5 (다시 시작점으로 닫음)
];

// 클라이언트에서 위치 정보를 POST로 받아 처리
app.post('/send-location', (req, res) => {
    const { lat, lon } = req.body;

    // 좌표가 출입 금지 구역 내에 있는지 확인
    const isInRestrictedArea = pointInPolygon([lat, lon], restrictedArea.map(p => [p.lat, p.lng]));

    if (isInRestrictedArea) {
        // 출입 금지 구역에 있을 경우 알림
        io.emit('notification', '출입 금지 구역에 진입했습니다!');
        return res.status(200).send('Entered restricted area');
    } else {
        return res.status(200).send('Location received');
    }
});

// 서버가 지정된 포트에서 실행
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
