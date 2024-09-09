const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const pointInPolygon = require('point-in-polygon');  // 다각형 내 위치 확인용
const fs = require('fs');
const path = require('path');

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

// 포트 설정 (기본값을 5000으로 설정)
const port = process.env.PORT || 5000;

// 출입 금지 구역 좌표 설정 (여러 다각형으로 구역 나누기)
const restrictedAreas = [
    // 첫 번째 출입금지구역
    [
        { lat: 35.9448619, lng: 126.6862836 },
        { lat: 35.944699, lng: 126.686297 },
        { lat: 35.9447207, lng: 126.6867879 },
        { lat: 35.9448803, lng: 126.6867731 },
        { lat: 35.9448619, lng: 126.6862836 }
    ],
    // 두 번째 출입금지구역
    [
        { lat: 35.9440196, lng: 126.6788968 },
        { lat: 35.9438024, lng: 126.6787171 },
        { lat: 35.9434354, lng: 126.6795084 },
        { lat: 35.9436786, lng: 126.6796693 },
        { lat: 35.9440196, lng: 126.6788968 }
    ],
    // 세 번째 출입금지구역
    [
        { lat: 35.9470822, lng: 126.6853641 },
        { lat: 35.9467586, lng: 126.6854137 },
        { lat: 35.9467934, lng: 126.6856927 },
        { lat: 35.9471093, lng: 126.6856364 },
        { lat: 35.9470822, lng: 126.6853641 }
    ]
];

// 클라이언트에서 위치 정보를 POST로 받아 처리
app.post('/send-location', (req, res) => {
    const { lat, lon } = req.body;
    
    let isInRestrictedArea = false;

    // 모든 출입 금지 구역을 순차적으로 검사
    for (const area of restrictedAreas) {
        if (pointInPolygon([lat, lon], area.map(p => [p.lat, p.lng]))) {
            isInRestrictedArea = true;
            break;  // 하나의 구역이라도 포함되면 더 이상 검사하지 않음
        }
    }

    if (isInRestrictedArea) {
        // 출입 금지 구역에 있을 경우 알림
        io.emit('notification', '출입 금지 구역에 진입했습니다!');
        return res.status(200).send('Entered restricted area');
    } else {
        return res.status(200).send('Location received');
    }
});

// 구역 데이터를 저장할 파일 경로
const dataFilePath = path.join(__dirname, 'zonesData.json');

// 구역 데이터 저장 함수
function saveZonesToFile(zones) {
    fs.writeFileSync(dataFilePath, JSON.stringify(zones, null, 2));
}

// 구역 데이터 불러오기 함수
function loadZonesFromFile() {
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data);
    }
    return [];
}

// 구역 데이터를 저장하는 API
app.post('/save-zone', (req, res) => {
    const newZone = req.body;

    // 기존 데이터를 불러온 후 새로운 데이터를 추가
    const zones = loadZonesFromFile();
    zones.push(newZone);
    
    // 데이터를 파일에 저장
    saveZonesToFile(zones);

    res.status(200).send('Zone data saved successfully');
});

// 구역 데이터를 불러오는 API
app.get('/load-zones', (req, res) => {
    const zones = loadZonesFromFile();
    res.status(200).json(zones);
});

// 서버가 지정된 포트에서 실행
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
