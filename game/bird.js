class Bird {
    constructor(brain) {
        this.spriteImage = spriteImage;
        this.birdPosition = {
            y: (CANVAS_HEIGHT / 2) - (BIRDSIZE.Width / 2), x: (CANVAS_WIDTH / 8) - (BIRDSIZE.Height / 2)
        }
        this.birdRotate = { angle: 0, xOffset: 0, yOffset: 0 };
        this.frame = 0;
        this.velocity = 0;
        this.gravity = 0.5;
        this.lift = -8;
        this.dead = false;
        this.score = 0
        this.topPipe = {
            x: 0, y: 0
        }
        this.bottomPipe = {
            x: 0, y: 0
        }


        this.fitness = 0
        if (brain) {
            this.brain = brain.copy();
        } else {
            this.brain = new NeuralNetWorks(7, 16, 2);
        }
    }

    draw () {
        if (this.dead === false)
            this.frame++;
        let animationFrame = (Math.floor(this.frame / 8)) % 4;
        push()
        translate(this.birdPosition.x + this.birdRotate.xOffset, this.birdPosition.y + this.birdRotate.yOffset);
        rotate(Math.PI / 180 * this.birdRotate.angle);

        image(
            this.spriteImage, 0, 0
            , BIRDSIZE.Width,
            BIRDSIZE.Height,
            BIRDANIMATIONFRAME[animationFrame],
            0,
            BIRDSIZE.Width,
            BIRDSIZE.Height
        );
        pop()
    }
    jump () {
        this.velocity = this.lift;
        this.birdRotate = { angle: -25, xOffset: -10, yOffset: 15 };
    }

    isDead () {
        return this.birdPosition.y >= CANVAS_HEIGHT - BIRDSIZE.Height - FLOOROFFSET || this.birdPosition.y < 0 ? true : false;
    }

    update (pipe) {
        this.score++
        this.think()
        this.velocity += this.gravity;
        this.birdPosition.y += this.velocity;

        if (this.velocity > 8)
            this.birdRotate = { angle: 0, xOffset: 0, yOffset: 0 };
        if (this.velocity > 9)
            this.birdRotate = { angle: 22.5, xOffset: 12, yOffset: -10 };

        if (this.velocity > 10)
            this.birdRotate = { angle: 45, xOffset: 30, yOffset: -15 };

        if (this.velocity > 11)
            this.birdRotate = { angle: 67.5, xOffset: 45, yOffset: -10 };

        if (this.velocity > 12)
            this.birdRotate = { angle: 90, xOffset: 60, yOffset: -10 };

        if (this.isDead()) {
            this.birdPosition.y = CANVAS_HEIGHT - BIRDSIZE.Height - FLOOROFFSET;
            this.velocity = 0;
            this.dead = true;
        }

        if (this.velocity > 15)
            this.velocity = 15;



        let pp = []
        let less = Infinity
        pipe.forEach(p => {
            // console.log(p);
            const pipeStartX = CANVAS_WIDTH - p.offset;
            const bottomPipeStartY = p.height + p.gap;
            const topPipeEndY = p.height;


            if (((pipeStartX * 2) + 70) - this.birdPosition.x > 0 && ((pipeStartX * 2) + 70) - this.birdPosition.x < less) {
                pp.push({ pipeStartX, topPipeEndY, bottomPipeStartY })
            }

        });

        let pi = pp.sort((a, b) => a - b)[0]

        this.topPipe.x = (pi.pipeStartX * 2) + 70;
        this.topPipe.y = pi.topPipeEndY;
        this.bottomPipe.x = (pi.pipeStartX * 2) + 70;
        this.bottomPipe.y = pi.bottomPipeStartY;
        // console.log(pi);
        stroke('red');
        line(this.birdPosition.x + 50, this.birdPosition.y, pi.pipeStartX, pi.bottomPipeStartY);
        stroke('blue')
        line(this.birdPosition.x + 50, this.birdPosition.y, pi.pipeStartX, pi.topPipeEndY);
        stroke('black')
    }


    mutate () {
        this.brain.mutate(0.1)
    }
    dispose () {
        this.brain.model.dispose();

    }
    think () {
        // let fuitPos = this.getNearFruit()
        // console.log(fuitPos);
        // this.nearFruit = fuitPos
        let inputs = []
        inputs[0] = this.birdPosition.y / height;
        inputs[1] = this.birdPosition.x / width;
        inputs[2] = this.velocity / 15;
        inputs[3] = (this.topPipe.x) / width
        inputs[4] = (this.bottomPipe.x) / width
        inputs[5] = (this.bottomPipe.y) / height
        inputs[6] = (this.topPipe.y) / height
        // inputs[3] = fuitPos ? fuitPos.x / width : 0;
        // inputs[4] = fuitPos ? fuitPos.y / height : 0;
        // inputs[5] = this.speed
        // console.log(inputs);
        let ouput = this.brain.predict(inputs)
        // console.log(ouput);
        if (ouput[0] < ouput[1]) {
            this.jump()
        }

    }
}