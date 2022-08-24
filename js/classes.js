class Sprite {
    constructor({position, imageSrc, scale = 1, frames = 1, offset = {x: 0, y: 0}}) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.frames = frames;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 20;
        this.offset = offset;
    }

    draw() {
        c.drawImage(
            this.image, 
            this.framesCurrent * (this.image.width / this.frames),
            0,
            this.image.width / this.frames,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y,
            (this.image.width / this.frames) * this.scale, 
            this.image.height * this.scale);
    }

    animateFrames() {
        this.framesElapsed++;

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.frames - 1) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrames();
    }
}

class Fighter extends Sprite {
    constructor({
        position, 
        velocity, 
        color = 'red', 
        imageSrc, 
        scale = 1, 
        frames = 1,
        offset = {x: 0, y: 0}, 
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined },
    }) {
        super({
            position,
            imageSrc,
            scale,
            frames,
            offset,
        })
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height, 
        }
        this.color = color;
        this.isAttacking;
        this.health = 100;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 12;
        this.sprites = sprites;
        this.dead = false

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;          
        }
    }

    update() {
        this.draw()
        if (!this.dead) this.animateFrames();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
        
        //Hitboxes
        /*
        c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);

        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        */
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        //gravity 
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 95) {
            this.velocity.y = 0;
            this.position.y = 331;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.switchSprite('attack1');
        this.isAttacking = true;
    }

    takeHit() {
        this.health -= 25;

        if (this.health <= 0) {
            this.switchSprite('death')
        } else {
            this.switchSprite('takeHit');
        }
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.frames - 1) this.dead = true;
            return;
        }
        if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.frames -1) return

        if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.frames -1) return

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image){
                    this.frames = this.sprites.idle.frames;
                    this.image = this.sprites.idle.image;
                    this.framesCurrent = 0;
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image){
                    this.frames = this.sprites.run.frames;
                    this.image = this.sprites.run.image;
                    this.framesCurrent = 0;
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.frames = this.sprites.jump.frames;
                    this.framesCurrent = 0;
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.frames = this.sprites.fall.frames;
                    this.framesCurrent = 0;
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.frames = this.sprites.attack1.frames;
                    this.framesCurrent = 0;
                }
                break;
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.frames = this.sprites.takeHit.frames;
                    this.framesCurrent = 0;
                }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.frames = this.sprites.death.frames;
                    this.framesCurrent = 0;
                }
                break;

        }
    }
}