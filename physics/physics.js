CLANG = new Howl({
  src: ['clang.mp3']
});

BALL_IMAGE = new Image();
BALL_IMAGE.src = "ball.png";
BALL_SIZE = 20;

RAMP_IMAGE = new Image();
RAMP_IMAGE.src = "ramp.png";
RAMP_SIZE = 32;
RAMP_SLOPE = 2;

Simulation = {
  context: {},
  floor: false,
  gravity: 60,
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
        if(ball.collide) {
          for(var j = 0; j < Scene.ramps.length; j++) {
            var ramp = Scene.ramps[j];

            if(ramp.intersects(ball)) {
              CLANG.play();
              ramp.impulse(ball);
            }

            if(ramp.justRolled(ball)) {
              ball.rolling = false;
              var _y = ball.y;
              ball.aX = 0;
              ball.y = _y - ball.dY;
            }
          }

          if(Simulation.floor) {
            if(ball.y > 130) {
              CLANG.play();
              ball.aX = -10 * ((ball.dX < 0) ? -1 : 1);
              ball.y = 130;
              ball.dY = 0;
              ball.aY = 0;
              ball.stopAtRest = true;
            }
          }

          if(ball.stopAtRest && Math.abs(ball.dX) - (2 * Math.abs(ball.aX)) <= 0) {
            ball.aX = 0;
            ball.dX = 0;
            ball.stopAtRest = false;
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
    if(arguments.length == 0) return;
    for(var i = 0; i < arguments.length; i++) {
      if(arguments[i].ball) this.balls.push(arguments[i]);
      else if(arguments[i].ramp) this.ramps.push(arguments[i]);
    }
  }
}

Ball = function(x, y) {
  this._aX = 0;
  this._aY = Simulation.gravity;
  this._x = x;
  this._y = y;
  this._dX = 0;
  this._dY = 0;
  this._t = Simulation.time;
  this.ball = true;
  this.collide = false;
  this.rolling = false;
  this.stopAtRest = false;
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
    this._y = this.y;
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
      x: (2 * this.x + BALL_SIZE) / 2,
      y: (2 * this.y + BALL_SIZE) / 2
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
    this._y = this.y;
    this._x = val;
    this.updateTime();
  },
  set y(val) {
    this._x = this.x;
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
      var relCoords = this.relCoords(ball);
      if(relCoords.y <= this.slopeY(relCoords.x)) return true;
    }

    return false;
  },
  impulse: function(ball) {
    var relX = this.relCoords(ball).x;
    ball.rolling = true;
    ball.stop();
    ball.y = this.point.y - this.slopeY(relX) - 1 - (BALL_SIZE);
    ball.aX = Simulation.gravity * ((this.flipped) ? -1 : 1);
    ball.aY = Simulation.gravity * ((this.flipped) ? -1 : 1);
  },
  relCoords: function(ball) {
    return {
      x: (this.flipped) ? this.back.x - ball.bottom.x : ball.bottom.x - this.back.x,
      y: this.point.y - ball.bottom.y
    };
  },
  justRolled: function(ball) {
    var relCoords = this.relCoords(ball);
    return ball.rolling && relCoords.y <= 2 && ((!this.flipped && (ball.x <= this.point.x)) || (this.flipped && (ball.x >= this.point.x)));
  },
  slopeY: function(relX) {
    return -1 * relX + 37;
    // return -0.8692360633 * relX + 30.94012388; // <-- old ramp slope equation (roughly 40-degree model)
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
