CLANG = new Howl({
  src: ['clang.mp3']
});

BG = new Image();
BG.src = "lab.png";
BG.addEventListener("load", function(e) {
  Simulation.background();
});

BALL_IMAGE = new Image();
BALL_IMAGE.src = "ball.png";
BALL_SIZE = 40;

RAMP_IMAGE = new Image();
RAMP_IMAGE.src = "ramp.png";
RAMP_FLIPPED_IMAGE = new Image();
RAMP_FLIPPED_IMAGE.src = "ramp_flipped.png";
RAMP_SIZE = 64;

Simulation = {
  context: {},
  exportGif: false,
  gifRange: [0, 0],
  floor: false,
  gravity: 200,
  seconds: 0,
  startTime: 0,
  task: -1,
  time: 0,
  walls: false,
  get sound() {
    return CLANG.volume() == 1;
  },
  set sound(val) {
    if(val) CLANG.volume(1);
    else CLANG.volume(0);
  },
  background: function() {
    this.context.drawImage(BG, 0, 0, Simulation.context.canvas.width, Simulation.context.canvas.height);
  },
  elapsed: function() {
    return new Date().getTime() - this.startTime;
  },
  secondsElapsed: function() {
    return this.time - this.seconds;
  },
  saveImage: function() {
    if(this._a == null) this._a = document.createElement("a");
    this._a.download = "sec_" + this.time + ".png";
    this._a.href = this.context.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    this._a.click();
  },
  tick: function() {
    this.time = Simulation.elapsed() / 1000;
    var elapsed = Simulation.secondsElapsed();

    if(elapsed >= 1) {
      this.seconds++;
      if(this.exportGif && (this.seconds >= this.gifRange[0] && this.seconds <= this.gifRange[1])) this.saveImage();
    }

    if(Scene.balls.length > 0 || Scene.ramps.length > 0) this.context.clearRect(0, 0, 640, 320);

    Simulation.background();

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

            if(ramp.justRolledDown(ball)) {
              ball.rollingDown = false;
              var _y = ball.y;
              ball.aX = 0;
              ball.y = _y - ball.dY;
            }

            if(ramp.justRolledUp(ball)) {
              ball.rollingUp = false;
              ball.aX = 0;
              ball.aY = Simulation.gravity;
            }
          }

          if(Simulation.floor) {
            if(ball.bottom.y > Simulation.context.canvas.height) {
              CLANG.play();
              ball.aX = -10 * ((ball.dX < 0) ? -1 : 1);
              ball.y = Simulation.context.canvas.height - BALL_SIZE;
              ball.dY = 0;
              ball.aY = 0;
              ball.stopAtRest = true;
            }
          }

          if(Simulation.walls) {
            if(ball.x < 0) {
              CLANG.play();
              ball.x = 0;
              ball.dX = 20;
              ball.aX = -5;
              if(ball.dY < 0) ball.dY *= -1;
              if(ball.aY < 0) ball.aY *= -1;
            } else if(ball.right.x > Simulation.context.canvas.width) {
              CLANG.play();
              ball.x = Simulation.context.canvas.width - BALL_SIZE;
              ball.dX = -20;
              ball.aX = 5;
              if(ball.dY < 0) ball.dY *= -1;
              if(ball.aY < 0) ball.aY *= -1;
            }
          }

          if(ball.stopAtRest && Math.abs(ball.dX) - (3 * Math.abs(ball.aX)) <= 0) {
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
        if(ramp.flipped) this.context.drawImage(RAMP_FLIPPED_IMAGE, ramp.x, ramp.y, RAMP_SIZE, RAMP_SIZE);
        else this.context.drawImage(RAMP_IMAGE, ramp.x, ramp.y, RAMP_SIZE, RAMP_SIZE);
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
  this.rollingDown = false;
  this.rollingUp = false;
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
  updatePos: function() {
    this._x = this.x;
    this._y = this.y;
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
  get left() {
    return {
      x: this.x,
      y: this.center.y
    };
  },
  get right() {
    return {
      x: this.x + BALL_SIZE,
      y: this.center.y
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
      if(!this.flipped && ball.right.x >= this.back.x && ball.right.x <= this.point.x) return true;
      if(this.flipped && ball.left.x <= this.back.x && ball.left.x >= this.point.x) return true;
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
    var rollUp = this.rollUp(ball);
    var _dX = ball.dX;

    ball.stop();
    ball.aY = Simulation.gravity;

    var rel = this.relCoords(ball);
    ball.y = this.point.y - this.slopeY(rel.x) - 2 - (BALL_SIZE);

    if(!rollUp) {
      if((!this.flipped && ball.bottom.x >= this.back.x) || (this.flipped && ball.right.x <= this.back.x)) {
        ball.aX = Simulation.gravity * ((this.flipped) ? -1 : 1);
        ball.rollingDown = true;
      } else {
        if(!this.flipped) {
          ball.aX = -10;
          ball.dY = -25;
          ball.dX = -25;
        } else {
          ball.aX = 10;
          ball.dX = 25;
          ball.dY = -25;
        }
      }
    } else {
      ball.dX = _dX;
      ball.dY = -1 * Math.abs(_dX);
      ball.aX = Simulation.gravity * ((this.flipped) ? -1 : 1);
      ball.rollingUp = true;
    }
  },
  relCoords: function(ball) {
    return {
      x: (this.flipped) ? this.back.x - ball.bottom.x : ball.bottom.x - this.back.x,
      y: this.point.y - ball.bottom.y
    };
  },
  rollUp: function(ball) {
    if(this.flipped && (ball.dX > 0 || ball.aX > 0)) return true;
    if(!this.flipped && (ball.dX < 0 || ball.aX < 0)) return true;
    return false;
  },
  justRolledDown: function(ball) {
    var relCoords = this.relCoords(ball);
    return ball.rollingDown && relCoords.y <= 2 && ((!this.flipped && (ball.x <= this.point.x)) || (this.flipped && (ball.right.x >= this.point.x)));
  },
  justRolledUp: function(ball) {
    return ball.rollingUp && ball.bottom.y < this.back.y && ((this.flipped && ball.right.x > this.back.x) || (!this.flipped && ball.left.x > this.back.x));
  },
  slopeY: function(relX) {
    return -1 * relX + 73;
    // return -1 * relX + 37;
    // return -0.8692360633 * relX + 30.94012388; // <-- old ramp slope equation (roughly 40-degree model)
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
