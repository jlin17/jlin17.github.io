BALL_IMAGE = new Image();
BALL_IMAGE.src = "ball.png";
BALL_SIZE = 20;

RAMP_IMAGE = new Image();
RAMP_IMAGE.src = "ramp.png";
RAMP_SIZE = 32;

Simulation = {
  context: {},
  startTime: 0,
  task: -1,
  time: 0,
  elapsed: function() {
    return new Date().getTime() - this.startTime;
  },
  secondsElapsed: function() {
    return this.time - this.seconds;
  },
  tick: function() {
    this.time = Simulation.elapsed() / 1000;
    var elapsed = Simulation.secondsElapsed();

    if(Scene.balls.length > 0 || Scene.ramps.length > 0) this.context.clearRect(0, 0, 640, 320);

    if(Scene.balls.length > 0) {
      for(var i = 0; i < Scene.balls.length; i++) {
        var ball = Scene.balls[i];
        this.context.drawImage(BALL_IMAGE, ball.x, ball.y, BALL_SIZE, BALL_SIZE);
        for(var j = 0; j < Scene.ramps.length; j++) {
          if(Scene.ramps[j].intersects(ball)) {
             ball.stop();
          }
        }
      }
    }

    if(Scene.ramps.length > 0) {
      for(var i = 0; i < Scene.ramps.length; i++) {
        var ramp = Scene.ramps[i];
        this.context.drawImage(RAMP_IMAGE, ramp.x, ramp.y, RAMP_SIZE, RAMP_SIZE);
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
  add: function(obj) {
    if(obj.ball) this.balls.push(obj);
    else if(obj.ramp) this.ramps.push(obj);
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
  this.ball = true;
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
  stop: function() {
    this.dX = 0; this.dY = 0; this.aX = 0; this.aY = 0;
  },
  updateTime: function() {
    this._t = Simulation.time;
  },
  get bottom() {
    return {
      x: (this.center.x),
      y: (this.y + BALL_SIZE)
    };
  },
  get center() {
    return {
      x: (this.x + BALL_SIZE) / 2,
      y: (this.y + BALL_SIZE) / 2
    };
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
    this._dX = this.dX;
    this._aX = val;
    this.updateTime();
  },
  set aY(val) {
    this._y = this.y;
    this._dY = this.dY;
    this._aY = val;
    this.updateTime();
  }
}

Ramp = function(x, y) {
  this.x = x;
  this.y = y;
  this.flipped = false;
  this.ramp = true;
}

Ramp.prototype = {
  setFlipped: function(flipped) {
    this.flipped = flipped;
  },
  get back() {
    return {
      x: this.x + ((this.flipped) ? RAMP_SIZE : 0),
      y: this.y
    };
  },
  get point() {
    return {
      x: this.x + ((!this.flipped) ? RAMP_SIZE : 0),
      y: this.y + RAMP_SIZE
    }
  },
  boundingBox: function(ball) {
    if(ball.bottom.y >= this.back.y && ball.bottom.y <= this.point.y) {
      if(!this.flipped && ball.bottom.x <= this.point.x && ball.bottom.x >= this.back.x) return true;
      if(this.flipped && ball.bottom.x >= this.point.x && ball.bottom.x <= this.back.x) return true;
    }
    return false;
  },
  intersects: function(ball) {
    if(this.boundingBox(ball)) {
      console.log("Bounded.");
      return false;
    }
  },
  impulse: function(ball) {

  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
