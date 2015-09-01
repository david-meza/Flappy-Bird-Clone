var tic = function () {
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  this.velocity.y += this.gravity;
}

var player = new Bird();

var pipesModel = {

  init: function () {

  },

  step: 1500,

  timeCounter: 0,

  pipes: [],

  generatePipe: function(dt) {
    // if enough time has elapsed
    this.timeCounter += dt;
    if (this.timeCounter > this.step){
      this.timeCounter -= this.step;
      this.step -= 2;
      var topPipeBottom = Math.floor(Math.random() * 300 + 100)
      console.log(topPipeBottom)
      this.pipes.push(new Pipe(0, topPipeBottom));
      this.pipes.push(new Pipe(topPipeBottom + 100, view.canvas.height()));
    }
  },

  ticPipes: function(){
    pipesModel.pipes.forEach(function(pipe, index, arr){
      pipe.tic();
      if (pipe.position.x < -40) {
        arr.splice(index, 1)
        console.log(pipesModel.pipes.length + " pipes left")
      }
    })
  }
}

var view = {

  init: function () {
    this.setCanvas();
    this.setListeners();
  },

  setCanvas: function () {
    this.canvas = $("#canvas");
  },

  redraw: function(bird, pipes){
    this.canvas.clearCanvas();
    this.drawBird(bird);
    this.drawPipes(pipes);
  },

  drawPipes: function(pipes){
    pipes.forEach(function(pipe){
      view.drawPipe(pipe);
    })
  },

  drawPipe: function(pipe){
    this.canvas.drawRect({
      fillStyle: "black",
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
    });
  },

  setListeners: function () {
    document.addEventListener("mousedown", function(){
      player.jump.call(player);
    })
  }

}

var controller = {

  init: function () {
    pipesModel.init();
    view.init();
  },

  currentTime: Date.now(),

  play: function(){
    setInterval(function(){
      controller.generatePipes(Date.now() - controller.currentTime);
      view.redraw.call(view, player, pipesModel.pipes);
      player.tic();
      pipesModel.ticPipes();
      player.dead.call(player);
    }, 15);
  },

  generatePipes: function(dt){
    controller.currentTime = Date.now();
    pipesModel.generatePipe(dt);
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
  this.gravity = .2;
  this.tic = tic;
  this.jump = function () {
    this.velocity.y = -4;
    console.log(this);
  };

  this.dead = function(){
    pipesModel.pipes.forEach(function(pipe){
      // console.log("Check collision");
      // console.log(player);
      // console.log(pipe);
      if (player.collides(pipe)){
        alert("Dead");
      }
    })
  }

  this.collides = function(other){
    // get the rightmost x value of the left sides
    // get the leftmost x value of the right sides
    // get the highest y value of the bottom sides
    // get the lowest y value of the top sides

    // We intersect if the rightmost is more than the leftmost and our lowest is greater than our highest.
    var rightmost = Math.max(this.position.x + this.bounding.x, other.position.x + 40),
        leftmost  = Math.min(this.position.x, other.position.x),
        topmost   = Math.max(this.position.y, other.endHeight - other.startHeight),
        bottommost= Math.min(this.position.y + this.bounding.y, other.startHeight + (other.endHeight - other.startHeight));

    // console.log(rightmost, leftmost, topmost, bottommost);
    console.log(((leftmost > rightmost) && (bottommost > topmost)));
    return ((leftmost > rightmost) && (bottommost > topmost));
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
  this.width = 40;
}

$(document).ready(function(){
  controller.init();
  controller.play();
});
