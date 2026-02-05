// Game state
let gameState = {
    players: [
        { total: 0, current: 0, name: 'שחקן 1' },
        { total: 0, current: 0, name: 'שחקן 2' }
    ],
    currentPlayer: 0,
    gameActive: true,
    gameMode: 'pvp', // 'pvp' or 'pvc'
    rolling: false
};

// Dice faces configuration
const diceFaces = {
    1: [{ x: 50, y: 50 }],
    2: [{ x: 25, y: 25 }, { x: 75, y: 75 }],
    3: [{ x: 25, y: 25 }, { x: 50, y: 50 }, { x: 75, y: 75 }],
    4: [{ x: 25, y: 25 }, { x: 75, y: 25 }, { x: 25, y: 75 }, { x: 75, y: 75 }],
    5: [{ x: 25, y: 25 }, { x: 75, y: 25 }, { x: 50, y: 50 }, { x: 25, y: 75 }, { x: 75, y: 75 }],
    6: [{ x: 25, y: 25 }, { x: 75, y: 25 }, { x: 25, y: 50 }, { x: 75, y: 50 }, { x: 25, y: 75 }, { x: 75, y: 75 }]
};

// Update display
function updateDisplay() {
    document.getElementById('player1Total').textContent = gameState.players[0].total;
    document.getElementById('player1Current').textContent = gameState.players[0].current;
    document.getElementById('player2Total').textContent = gameState.players[1].total;
    document.getElementById('player2Current').textContent = gameState.players[1].current;
    
    // Update active player
    const player1Card = document.getElementById('player1Card');
    const player2Card = document.getElementById('player2Card');
    
    if (gameState.currentPlayer === 0) {
        player1Card.classList.add('active');
        player2Card.classList.remove('active');
        player1Card.querySelector('.current-turn').textContent = 'תורך!';
        player2Card.querySelector('.current-turn').textContent = 'המתן...';
    } else {
        player1Card.classList.remove('active');
        player2Card.classList.add('active');
        player1Card.querySelector('.current-turn').textContent = 'המתן...';
        player2Card.querySelector('.current-turn').textContent = gameState.gameMode === 'pvc' ? 'תור המחשב...' : 'תורך!';
    }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function dd(){
//     const x = document.getElementById("dice2").textContent = 
//  } 
const random = document.querySelector('#dani').textContent=randomInt(20,30)




// Draw dice
function drawDice1(number) {
    const dice = document.getElementById('dice');
    const face = dice.querySelector('.dice-face');

    face.innerHTML = '';
    
    const dots = diceFaces[number];
    dots.forEach(dot => {
        const dotEl = document.createElement('span');
        dotEl.className = 'dot';
        dotEl.style.left = `${dot.x}%`;
        dotEl.style.top = `${dot.y}%`;
        face.appendChild(dotEl);
    });
}

function drawDice2(number) {
    const dice = document.getElementById('dice2');
    const face = dice.querySelector('.dice-face');

    face.innerHTML = '';
    
    const dots = diceFaces[number];
    dots.forEach(dot => {
        const dotEl = document.createElement('span');
        dotEl.className = 'dot';
        dotEl.style.left = `${dot.x}%`;
        dotEl.style.top = `${dot.y}%`;
        face.appendChild(dotEl);
    });
}


// Roll dice with animation
async function rollDice() {
    if (!gameState.gameActive || gameState.rolling) return;
    
    gameState.rolling = true;
    const dice = document.getElementById('dice');
    dice.classList.add('rolling');
    
    // Animate random numbers
    for (let i = 0; i < 10; i++) {
        drawDice1(Math.floor(Math.random() * 6) + 1);
        drawDice2(Math.floor(Math.random() * 6) + 1)
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Final roll
    const result1 = Math.floor(Math.random() * 6) + 1;
    const result2 = Math.floor(Math.random() * 6) + 1;

    drawDice1(result1);
    drawDice2(result2)
    
    dice.classList.remove('rolling');
    gameState.rolling = false;
    
    return [result1 , result2];
}

// // Roll button
document.getElementById('rollBtn').addEventListener('click', async () => {
    if (!gameState.gameActive || gameState.rolling) return;
    
    document.getElementById('resultMessage').textContent = '';
    
    const roll1 = await rollDice();
    const roll = roll1[0]+roll1[1] 
    
    if (roll1[0] === roll1[1]) {
        // Lost turn
        gameState.players[gameState.currentPlayer].current = 0;
        showMessage(`💥 הטלת 1! איבדת את כל ניקוד התור!`, 'error');
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        switchPlayer();
    } else {
        // Add to current
        gameState.players[gameState.currentPlayer].current += roll;
        updateDisplay();
        showMessage(`🎲 הטלת ${roll}!`, 'info');
    }
});

// Hold button
document.getElementById('holdBtn').addEventListener('click', () => {
    if (!gameState.gameActive || gameState.rolling) return;
    
    const player = gameState.players[gameState.currentPlayer];
    
    if (player.current === 0) {
        showMessage('אין מה לשמור! הטל קובייה תחילה.', 'error');
        return;
    }
    
    player.total += player.current;
    player.current = 0;
    
    updateDisplay();
    
    // Check for win
    if (player.total >= random) {
        endGame();
    } else {
        showMessage(`✅ נשמר! ${player.total} נקודות סה"כ.`, 'success');
        setTimeout(() => {
            switchPlayer();
        }, 1000);
    }
});

// Switch player
async function switchPlayer() {
    gameState.currentPlayer = gameState.currentPlayer === 0 ? 1 : 0;
    updateDisplay();
    document.getElementById('resultMessage').textContent = '';
    
    // Computer turn
    if (gameState.gameMode === 'pvc' && gameState.currentPlayer === 1) {
        await computerTurn();
    }
}

 
// // End game
function endGame() {
    gameState.gameActive = false;
    
    const winner = gameState.players[gameState.currentPlayer];
    const winnerName = gameState.currentPlayer === 0 ? 
        'שחקן 1' : 
        (gameState.gameMode === 'pvc' ? 'המחשב' : 'שחקן 2');
    
    showMessage(`🎉 ${winnerName} ניצח עם ${winner.total} נקודות!`, 'success');
    
    // Celebrate
    celebrate();
}

// // New game
document.getElementById('newGameBtn').addEventListener('click', newGame);

function newGame() {
    gameState.players = [
        { total: 0, current: 0, name: 'שחקן 1' },
        { total: 0, current: 0, name: 'שחקן 2' }
    ];
    gameState.currentPlayer = 0;
    gameState.gameActive = true;
    gameState.rolling = false;
    
    updateDisplay();
    drawDice(1);
    document.getElementById('resultMessage').textContent = '';
}

// Game mode buttons
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (gameState.rolling) return;
        
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        gameState.gameMode = btn.dataset.mode;
        
        // Update player 2 name
        if (gameState.gameMode === 'pvc') {
            document.querySelector('#player2Card h3').textContent = '🤖 מחשב';
        } else {
            document.querySelector('#player2Card h3').textContent = '👤 שחקן 2';
        }
        
        newGame();
    });
});

// Show message
function showMessage(text, type = 'info') {
    const messageEl = document.getElementById('resultMessage');
    messageEl.textContent = text;
    messageEl.className = `result-message ${type}`;
    messageEl.style.display = 'block';
}

// Celebration
function celebrate() {
    const card = document.getElementById(`player${gameState.currentPlayer + 1}Card`);
    card.classList.add('winner');
    
    // Confetti
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createConfetti();
        }, i * 30);
    }
}

// Create confetti
function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
    confetti.style.background = ['#FFD700', '#FF6347', '#4169E1', '#32CD32', '#FF69B4'][Math.floor(Math.random() * 5)];
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 3000);
}



// Initialize
updateDisplay();
drawDice(1);
