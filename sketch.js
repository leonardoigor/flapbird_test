var spriteUrl = 'assets/sprite.png'
var backgroundUrl = 'assets/background.png';
var backgroundImage;
var spriteImage;
var saveitems = []
const Total = 50
var gene = 0

let floor
let pipe
let birds = [];
let load = false

var slide = 1
async function setup () {
  createCanvas(CANVAS_WIDTH, 650);
  spriteImage = loadImage(spriteUrl)
  backgroundImage = loadImage(backgroundUrl)
  tf.setBackend('cpu');
  floor = new Floor(spriteImage);

  pipe = new Pipe(spriteImage);
  pipe.generateFirst();
  await tf.loadLayersModel('./brain/bird-0.json').then(brain => {

    for (let i = 0; i < Total; i++) {
      birds[i] = new Bird()
      birds[i].brain.model = brain
    }
    load = true
  })
}

function draw () {
  if (load) {

    image(backgroundImage, 0, 0);
    for (let z = 0; z < slide; z++) {
      if (birds.length === 0) {
        nextGeneration()
      }

      pipe.move();
      pipe.draw();

      // bird.update();
      // bird.draw();

      floor.update();
      floor.draw();
      birds.forEach((bird, i) => {
        bird.draw()
        bird.update(pipe.pipesPosition);
        gameOver = pipe.checkCrash(bird) || bird.isDead();

        if (gameOver) saveitems.push(birds.splice(i, 1));

      })
    }

    text('Vivos: ' + birds.length, 30, 30)
    text('geraçao: ' + gene, 30, 60)
  }
}
keyPressed = (e) => {
  if (e.key === ' ') {
    bird.jump();
  }
}