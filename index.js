const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const gravity = 0.4;
const keys = {
    a : {
        pressed: false
    },
    d : {
        pressed: false
    },
    ArrowRight : {
        pressed: false
    },
    ArrowLeft : {
        pressed: false
    }
}

canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);

const backgound = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/background.png'
})

const shop = new Sprite({
    position: {
        x: 650,
        y: 225
    },
    imageSrc: './assets/shop.png',
    scale: 2,
    frames: 6,
})


const player = new Fighter({
    position: {
        x: 50,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 0,
        y: 0,
    },
    imageSrc: './assets/samurai/Idle.png',
    frames: 8,
    scale: 2,
    offset: {
        x: 180,
        y: 95,
    },
    sprites: {
        idle: {
            imageSrc: './assets/samurai/Idle.png',
            frames: 8
        },
        run: {
            imageSrc: './assets/samurai/Run.png',
            frames: 8
        },
        jump: {
            imageSrc: './assets/samurai/Jump.png',
            frames: 2
        },
        fall: {
            imageSrc: './assets/samurai/Fall.png',
            frames: 2
        },
        attack1: {
            imageSrc: './assets/samurai/Attack1.png',
            frames: 6
        },
        takeHit: {
            imageSrc: './assets/samurai/Take Hit.png',
            frames: 4
        },
        death: {
            imageSrc: './assets/samurai/Death.png',
            frames: 6
        }
    },
    attackBox: {
        offset: {
            x: 70,
            y: 60
        },
        width: 145,
        height: 50,
    }
})


const enemy = new Fighter({
    position: {
        x: 940,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: -50,
        y: 0,
    },
    imageSrc: './assets/kenji/Idle.png',
    frames: 4,
    scale: 2,
    offset: {
        x: 180,
        y: 105,
    },
    sprites: {
        idle: {
            imageSrc: './assets/kenji/Idle.png',
            frames: 4
        },
        run: {
            imageSrc: './assets/kenji/Run.png',
            frames: 8
        },
        jump: {
            imageSrc: './assets/kenji/Jump.png',
            frames: 2
        },
        fall: {
            imageSrc: './assets/kenji/Fall.png',
            frames: 2
        },
        attack1: {
            imageSrc: './assets/kenji/Attack1.png',
            frames: 4
        },
        takeHit: {
            imageSrc: './assets/kenji/Take hit.png',
            frames: 3
        },
        death: {
            imageSrc: './assets/kenji/Death.png',
            frames: 7
        }
    },
    attackBox: {
        offset: {
            x: -125,
            y: 60
        },
        width: 140,
        height: 50,
    }
}) 


let gameStop = true;
decreaseTimer();


function animate() {
    if (!gameStop) {
        window.requestAnimationFrame(animate);
        backgound.update();
        shop.update();
        c.fillStyle = 'rgba(255,255,255, 0.07)';
        c.fillRect(0, 0, canvas.width, canvas.height);
        player.update();
        enemy.update();
    
        player.velocity.x = 0;
        enemy.velocity.x = 0;
    
        //player movement
        
        if(keys.d.pressed && player.lastKey === 'd') {
            player.velocity.x = 4;
            player.switchSprite('run');
        } else if(keys.a.pressed && player.lastKey === 'a'){
            player.velocity.x = -4;
            player.switchSprite('run');
        } else {
            player.switchSprite('idle');
        }
    
        if (player.velocity.y < 0) {
            player.switchSprite('jump');
        } else if (player.velocity.y > 0) {
            player.switchSprite('fall');
        }
    
        //enemy movement
        if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
            enemy.velocity.x = 4;
            enemy.switchSprite('run');
        } else if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
            enemy.velocity.x = -4;
            enemy.switchSprite('run');
        } else {
            enemy.switchSprite('idle');
        }
    
        if (enemy.velocity.y < 0) {
            enemy.switchSprite('jump');
        } else if (enemy.velocity.y > 0) {
            enemy.switchSprite('fall');
        }
    
        //detect collision
        if (rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking &&
            player.framesCurrent === 4) {
            player.isAttacking = false;
            enemy.takeHit();
            gsap.to('#enemy-health', {
                width: enemy.health + "%",
            })
        } 
    
        //if player missed
        if (player.isAttacking && player.framesCurrent === 4) {
            player.isAttacking = false; 
        }
    
        if (rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking &&
        enemy.framesCurrent === 2) {
            enemy.isAttacking = false;
            player.takeHit();
            gsap.to('#player-health', {
                width: player.health + "%",
            })
        }
    
        if (enemy.isAttacking && enemy.framesCurrent === 2) {
            enemy.isAttacking = false; 
        }
    
        //end game based on health
        if (enemy.health <= 0 || player.health <= 0) {
            determineWinner({player, enemy, timerId})
        }
    }
}

animate()
startGame();

window.addEventListener('keydown', (event) => {
    if (player.image !== player.sprites.death.image) {
        switch(event.key) {
            //player keys
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'w':
                player.velocity.y = -15;
                break;
            case ' ':
                player.attack();
                break;
        }
    }
    
    if (enemy.image !== enemy.sprites.death.image) {
        switch(event.key) {
            //enemy keys
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                enemy.velocity.y = -15;
                break;
            case 'ArrowDown':
                enemy.attack();
                break;
        }
    }
    
})

window.addEventListener('keyup', (event) => {
    //player keys
    switch(event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
    }

    //enemy keys
    switch(event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
})