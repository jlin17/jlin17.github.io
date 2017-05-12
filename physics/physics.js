var BALL_IMAGE = new Image();
BALL_IMAGE.src = "ball.png";

var RAMP_IMAGE = new Image();
RAMP_IMAGE.src = "ramp.png";

Simulation = {
  context: {},
  scene: {},
  startTime: 0,
  task: -1,
  time: 0,
  seconds: 0,
  elapsed: function() {
    return new Date().getTime() - this.startTime;
  },
  secondsElapsed: function() {
    return this.time - this.seconds;
  },
  tick: function() {
    this.time = Simulation.elapsed() / 1000;
    var elapsed = Simulation.secondsElapsed();
    if(elapsed >= 1) {
      console.log("Another second gone by...");
      this.seconds++;
    }

    if(Scene.balls.length > 0) {
      this.context.clearRect(0, 0, 640, 320);
      for(var i = 0; i < Scene.balls.length; i++) {
        var ball = Scene.balls[i];
        this.context.drawImage(BALL_IMAGE, ball.x, ball.y, 20, 20);
      }
    }
  },
  setCanvas: function(context) {
    this.context = context;
    this.context.imageSmoothingEnabled = false;
  },
  start: function() {
    this.startTime = new Date().getTime();
    this.task = setInterval(function() {
      Simulation.tick();
    }, 10);
  },
  stop: function() {
    window.clearInterval(this.task);
  }
}

Scene = {
  balls: [],
  ramps: [],
  addBall: function(ball) {
    this.balls.push(ball);
  },
  addRamp: function(ramp) {
    this.ramps.push(ramp);
  }
}

Ball = function(x, y) {
  this._aX = 0;
  this._aY = 0;
  this._x = x;
  this._y = y;
  this._dX = 0;
  this._dY = 0;
  this._t = Simulation.time;
}

Ball.prototype = {
  randomPos: function() {
    this.x = getRandomInt(0, 590);
    this.y = getRandomInt(0, 270);
  },
  setPos: function(x, y) {
    this.x = x;
    this.y = y;
  },
  updateTime: function() {
    this._t = Simulation.time;
  },
  get aX() {
    return this._aX;
  },
  get aY() {
    return this._aY;
  },
  get dX() {
    return this._dX + (this.aX * this.t);
  },
  get dY() {
    return this._dY + (this.aY * this.t);
  },
  get x() {
    return this._x + (this.dX * this.t);
  },
  get y() {
    return this._y + (this.dY * this.t);
  },
  get t() {
    return Simulation.time - this._t;
  },
  set x(val) {
    this._x = val;
    this.updateTime();
  },
  set y(val) {
    this._y = val;
    this.updateTime();
  },
  set dX(val) {
    this._x = this.x;
    this._dX = val;
    this.updateTime();
  },
  set dY(val) {
    this._y = this.y;
    this._dY = val;
    this.updateTime();
  },
  set aX(val) {
    this._x = this.x;
    this._aX = val;
    this.updateTime();
  },
  set aY(val) {
    this._y = this.y;
    this._aY = val;
    this.updateTime();
  }
}

Ramp = function(x, y) {
  this.x = x;
  this.y = y;
  this.rotation = 0;
}

Ramp.prototype = {
  setRotation: function(rotation) {
    this.rotation = rotation;
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
