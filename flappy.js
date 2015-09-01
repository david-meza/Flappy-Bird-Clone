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
      this.pipes.push(new Pipe());
    }
  },
  ticPipes: function(){
    pipesModel.pipes.forEach(function(pipe){
      pipe.tic();
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
      y: pipe.position.y,
      width: 40,
      height: 30,
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
      console.log("Clicked!");
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
      console.log(pipesModel.pipes.length);
      controller.generatePipes(Date.now() - controller.currentTime);
      view.redraw.call(view, player, pipesModel.pipes);
      player.tic();
      pipesModel.ticPipes();
    }, 15);
  },

  generatePipes: function(dt){
    controller.currentTime = Date.now();
    pipesModel.generatePipe(dt);
  }

}


function Bird () {
  this.velocity = {
    x: 0,
    y: 0,
  };
  this.position = {
    x: 100,
    y: 100
  };
  this.gravity = .1;
  this.tic = tic;
  this.jump = function () {
    this.velocity.y = -5;
    console.log(this);
  };
}

function Pipe () {
  this.hanging = false;
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
}

$(document).ready(function(){
  controller.init();
  controller.play();
});
