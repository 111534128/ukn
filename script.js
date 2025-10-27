const colors = ['green', 'red', 'yellow', 'blue'];
const quadrants = document.querySelectorAll('.quadrant');
const startButton = document.getElementById('start-button');
const levelDisplay = document.getElementById('level');
const messageDisplay = document.getElementById('message');

let gameSequence = []; // 電腦生成的序列
let playerSequence = []; // 玩家點擊的序列
let level = 1;
let canClick = false; // 控制玩家是否能點擊
let timeOut = 600; // 閃爍時間

// -------------------
// 核心功能
// -------------------

// 1. 閃爍單一顏色
function flashColor(color) {
    const element = document.getElementById(color);
    // 增加 active class 觸發 CSS 效果
    element.classList.add('active'); 
    
    // 延遲後移除 active class
    setTimeout(() => {
        element.classList.remove('active');
    }, timeOut - 100);
}

// 2. 電腦播放整個序列
function playSequence() {
    canClick = false; // 播放時禁止玩家點擊
    let delay = 0;

    gameSequence.forEach((color, index) => {
        // 確保每個閃爍間有足夠間隔
        setTimeout(() => {
            flashColor(color);
        }, delay);
        // 延遲時間 = (閃爍時間 + 間隔時間) * 序列長度
        delay += timeOut + 50; 
    });

    // 序列播放完畢後，允許玩家點擊
    setTimeout(() => {
        messageDisplay.textContent = '請重複序列...';
        canClick = true;
    }, delay);
}

// 3. 推進到下一關
function nextRound() {
    playerSequence = [];
    levelDisplay.textContent = level;
    messageDisplay.textContent = '電腦正在思考...';
    
    // 隨機新增一個顏色到序列末尾
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    gameSequence.push(randomColor);
    
    // 開始播放序列
    setTimeout(playSequence, 1000);
}

// 4. 檢查玩家點擊
function checkPlayerInput(color) {
    if (!canClick) return;

    // 玩家點擊的顏色
    playerSequence.push(color);
    flashColor(color); // 玩家點擊時也閃爍
    
    const currentInputIndex = playerSequence.length - 1;

    // 檢查點擊是否正確
    if (playerSequence[currentInputIndex] !== gameSequence[currentInputIndex]) {
        // 錯誤：遊戲結束
        gameOver();
        return;
    }

    // 檢查是否完成當前關卡
    if (playerSequence.length === gameSequence.length) {
        // 完成：進入下一關
        level++;
        messageDisplay.textContent = '✅ 正確！進入下一關...';
        setTimeout(nextRound, 1500);
    }
}

// 5. 遊戲結束
function gameOver() {
    canClick = false;
    messageDisplay.textContent = `❌ 錯誤！遊戲結束。你在第 ${level} 關失敗了。`;
    startButton.textContent = '再玩一次';
    startButton.disabled = false;
}

// 6. 初始化遊戲
function startGame() {
    startButton.disabled = true;
    messageDisplay.textContent = '';
    gameSequence = [];
    level = 1;
    nextRound();
}

// -------------------
// 事件監聽
// -------------------

// 啟動按鈕
startButton.addEventListener('click', startGame);

// 顏色按鈕點擊
quadrants.forEach(quadrant => {
    quadrant.addEventListener('click', (e) => {
        if (canClick) {
            // 點擊音效 (可選，CodePen 不易加)
            checkPlayerInput(e.target.dataset.color);
        }
    });
});