var player = new Bird();

var pipesModel = {

  init: function () {

  },

  pipes: [];

  generatePipe: function() {
    this.pipes.push(new Pipe);
  }
}

var view = {

  init: function () {
    this.setCanvas();
    this.setListeners();
  },

  setCanvas: function () {
    this.canvas = $("#canvas");
  }

  drawBird: function (bird) {
    this.canvas.drawRect()
  },

  setListeners: function () {
    document.addEventListener("mousedown", player.jump)
  }

}

var controller = {

  init: function () {
    pipesModel.init();
    view.init();
  }

}


function Bird () {
  this.velocity = {
    x: 0,
    y: 0
  };
  this.position = {
    x: 0,
    y: 0
  };
  this.gravity = -1;
  this.tic = tic;
  this.jump = function () {
    this.velocity.y = 5;
  };
}

var tic = function () {
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  this.velocity.y += this.gravity;
}

function Pipe () {
  this.hanging = false;
  this.velocity = {
    x: -5,
    y: 0
  };
  this.position = {
    x: 0,
    y: 0
  };
  this.gravity = 0;
}