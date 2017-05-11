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
      for(var i = 0; i < Scene.balls.length; i++) {
        Scene.balls[i].motion(elapsed);
      }
    }
  },
  setCanvas: function(context) {
    this.context = context;
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
  this.x = x;
  this.y = y;
  this.dX = 0;
  this.dY = 0;
  this.aX = 0;
  this.aY = 0;
}

Ball.prototype = {
  motion: function(factor) {
    this.dX += (this.aX * factor);
    this.dY += (this.aY * factor);
    this.x += (this.dX * factor);
    this.y += (this.dY * factor);
  },
  randomPos: function() {
    this.x = getRandomInt(0, 590);
    this.y = getRandomInt(0, 270);
  },
  setPos: function(x, y) {
    this.x = x;
    this.y = y;
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
