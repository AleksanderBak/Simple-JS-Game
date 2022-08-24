function startGame() {
    let msgBox =  document.querySelector("#displayText");
    msgBox.style.display = 'flex';
    let button = document.createElement("button");
    button.innerHTML = "Start the game"
    button.onclick = function() { 
        gameStop = false;
        msgBox.style.display = 'none';
        animate();
        decreaseTimer();
    }
    button.classList.add("restart-btn");
    msgBox.innerHTML = "Welcome to the cheap Mortal Kombat clone";
    msgBox.appendChild(button);
    let instruction = document.createElement("img");
    instruction.src = '../assets/instruction.png'
    instruction.width = "400";
    instruction.style.marginTop = "30px";
    msgBox.appendChild(instruction);
}


function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x < rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId);
    let msgBox =  document.querySelector("#displayText");
    msgBox.style.display = 'flex';

    let button = document.createElement("button");
    button.innerHTML = "Restart"
    button.classList.add("restart-btn");
    button.onclick = function() { window.location.reload() }

    if(player.health === enemy.health) {
        setTimeout(function () { gameStop = true }, 1000);
        msgBox.innerHTML = "Tie";
        msgBox.appendChild(button);
    } else if (player.health > enemy.health) {
        setTimeout(function () { gameStop = true }, 1000);
        msgBox.innerHTML = "Player 1 Wins";
        msgBox.appendChild(button);
    } else if (player.health < enemy.health) {
        setTimeout(function () { gameStop = true }, 1000);
        msgBox.innerHTML = "Player 2 Wins";
        msgBox.appendChild(button);
    }
}


let timer = 60;
let timerId

function decreaseTimer() {
    if (timer > 0 && !gameStop) {
        timerId = setTimeout(decreaseTimer, 1000) 
        timer--;
        document.querySelector("#timer").innerHTML = timer;
    } 

    if (timer === 0) {
        determineWinner({player, enemy, timerId})
    }
}