var tic = function () {
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  this.velocity.y += this.gravity;
}

var player = new Bird();

var pipesModel = {

  init: function () {
    this.score = 0;
    this.step = 1500;
    this.timeCounter = 0;
    this.pipes = [];
  },

  score: 0,

  step: 1500,

  timeCounter: 0,

  pipes: [],

  generatePipe: function(dt) {
    // if enough time has elapsed
    this.timeCounter += dt;
    if (this.timeCounter > this.step){
      this.timeCounter -= this.step;
      if (this.step > 500) this.step -= 20;
      var topPipeBottom = Math.floor(Math.random() * 200 + 50)
      console.log(topPipeBottom)
      this.pipes.push(new Pipe(0, topPipeBottom));
      this.pipes.push(new Pipe(topPipeBottom + 80, view.canvas.height() - 200));
    }
  },

  ticPipes: function(){
    pipesModel.pipes.forEach(function(pipe, index, arr){
      pipe.tic();
      if (pipe.position.x < -pipe.width) {
        arr.splice(index, 1)
        pipesModel.score += 1;
        console.log(pipesModel.pipes.length + " pipes left")
      }
    })
  }
}

var view = {

  frames: 0,

  init: function () {
    this.setCanvas();
  },

  setCanvas: function () {
    this.canvas = $("#canvas");
  },

  redraw: function(bird, pipes, score){
    this.frames += 1.38;
    this.canvas.clearCanvas();
    this.drawFloor();
    this.drawBackground();
    this.drawBird(bird);
    this.drawPipes(pipes);
    this.drawScore(score);
  },

  drawBackground: function(){

    this.canvas.drawImage({
      source: 'res/sheet.png',
      repeat: 'repeat',
      x: 0,
      y: 0,
      sWidth: 138,
      sHeight: 114,
      sx: 0,
      sy: 0,
      cropFromCenter: false,
      width: this.canvas.width()/2,
      height: this.canvas.height() - 200,
      fromCenter: false,
    })
    this.canvas.drawImage({
      source: 'res/sheet.png',
      repeat: 'repeat',
      x: this.canvas.width()/2,
      y: 0,
      sWidth: 138,
      sHeight: 114,
      sx: 0,
      sy: 0,
      cropFromCenter: false,
      width: this.canvas.width()/2,
      height: this.canvas.height() - 200,
      fromCenter: false,
    })
  },

  drawScore: function(score){
    this.canvas.drawText({
      strokeStyle: 'black',
      strokeWidth: 2,
      x: 50,
      y: this.canvas.height() - 100,
      fontSize: 48,
      fontFamily: 'Verdana, sans-serif',
      text: Math.floor(score/2),
    });
  },

  drawPipes: function(pipes){
    pipes.forEach(function(pipe){
      view.drawPipe(pipe);
    })
  },

  drawFloor: function(){
    this.canvas.drawImage({
      source: 'res/sheet.png',
      repeat: 'repeat',
      x: 0,
      y: this.canvas.height() - 200,
      sWidth: 112,
      sHeight: 56,
      sx: 338 + this.frames % 40,
      sy: 0,
      cropFromCenter: false,
      width: this.canvas.width()/2,
      height: 200,
      fromCenter: false,
    })
    this.canvas.drawImage({
      source: 'res/sheet.png',
      repeat: 'repeat',
      x: this.canvas.width()/2,
      y: this.canvas.height() - 200,
      sWidth: 112,
      sHeight: 56,
      sx: 338 + this.frames % 40,
      sy: 0,
      cropFromCenter: false,
      width: this.canvas.width()/2,
      height: 200,
      fromCenter: false,
    })
  },

  drawPipe: function(pipe){
    this.canvas.drawRect({
      fillStyle: "green",
      x: pipe.position.x,
      y: pipe.startHeight,
      width: pipe.width,
      height: pipe.endHeight - pipe.startHeight,
      fromCenter: false,
    });
  },

  drawBird: function (bird) {
    this.canvas.drawRect({
      fillStyle: "black",
      x: bird.position.x,
      y: bird.position.y,
      width: 20,
      height: 20,
      fromCenter: false,
    });
  },

  setListeners: function () {
    $(window).on("mousedown", function(){
      player.jump.call(player);
    })
    $("#gameover").on("click", controller.restartGame);
  },

  toggleGameOver: function() {
    $("#gameover").toggleClass("hidden");
  }

}

var controller = {

  init: function () {
    pipesModel.init();
    view.init();
  },

  currentTime: Date.now(),

  play: function(){
    this.playLoop = setInterval(function(){
        controller.generatePipes(Math.min(Date.now() - controller.currentTime, 100));
        player.tic();
        pipesModel.ticPipes();
        view.redraw.call(view, player, pipesModel.pipes, pipesModel.score);
        player.dead.call(player);
    controller.currentTime = Date.now();
    }, 1000 / 60);
  },

  generatePipes: function(dt){
    pipesModel.generatePipe(dt);
  },

  gameOver: function() {
    console.log(this.playLoop)
    clearInterval(this.playLoop);
    this.playLoop = null;
    console.log(this.playLoop)
    view.toggleGameOver();
  },

  restartGame: function() {
    player = new Bird();
    view.toggleGameOver();
    controller.init();
    controller.play();
  }

}


function Bird () {
  this.bounding = {
    x: 20,
    y: 20,
  }
  this.velocity = {
    x: 0,
    y: 0,
  };
  this.position = {
    x: 100,
    y: 100
  };
  this.gravity = .25;
  this.tic = tic;
  this.jump = function () {
    this.velocity.y = -5;
    console.log(this);
  };

  this.dead = function(){
    var dead = false;
    if (player.outOfBounds()) {
      dead = true;
    } else {
      pipesModel.pipes.forEach(function(pipe){
        // console.log("Check collision");
        // console.log(player);
        // console.log(pipe);
        if (player.collides(pipe)){
          dead = true;
        }
      })
    };
    if (dead) {
      controller.gameOver();
      console.log("Dead");
    }
  }

  this.collides = function(pipe){
    // get the rightmost x value of the left sides
    // get the leftmost x value of the right sides
    // get the highest y value of the bottom sides
    // get the lowest y value of the top sides

    // We intersect if the rightmost is more than the leftmost and our lowest is greater than our highest.
    var rightmost = Math.max(this.position.x + this.bounding.x, pipe.position.x + 40),
        leftmost  = Math.min(this.position.x, pipe.position.x),
        topmost   = Math.max(this.position.y, pipe.endHeight - pipe.startHeight),
        bottommost= Math.min(this.position.y + this.bounding.y, pipe.startHeight + (pipe.endHeight - pipe.startHeight));

    return  !((this.position.x + this.bounding.x <= pipe.position.x) ||
                (pipe.position.x + pipe.width <= this.position.x) ||
                (this.position.y + this.bounding.y <= pipe.startHeight) ||
                (pipe.endHeight <= this.position.y)
    )

  }

  this.outOfBounds = function() {
    return (this.position.y + this.bounding.y > view.canvas.height() - 200 || this.position.y + this.bounding.y < 0 )
  }
}

function Pipe (top, bottom) {
  this.velocity = {
    x: -5,
    y: 0
  };
  this.position = {
    x: view.canvas.width(),
    y: 0
  };
  this.gravity = 0;
  this.tic = tic;
  this.startHeight = top;
  this.endHeight = bottom;
  this.width = 70;
}

$(document).ready(function(){
  controller.init();
  view.setListeners();
  controller.play();
});
