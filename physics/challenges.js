// Challenge One

var one_ball = new Requirement();
one_ball.properties.x = 0;
one_ball.properties.y = 0;

var one_ramp = new Requirement();
one_ramp.properties.x = 0;
one_ramp.properties.y = 100;

var one = new Challenge([one_ball], [one_ramp]);

// Challenge Two

var two_ball = new Requirement();
two_ball.properties.x = 30;
two_ball.properties.y = 0;

var two_ramp = new Requirement();
two_ramp.properties.x = 30;
two_ramp.properties.y = 100;
two_ramp.properties.flipped = true;

var two = new Challenge([two_ball], [two_ramp]);

// Challenge Three

var three_ball = new Requirement();
three_ball.properties.x = 10;
three_ball.properties.y = 0;

var three_ramp = new Requirement();
three_ramp.properties.x = 15;
three_ramp.properties.y = 50;

var three_ramp_2 = new Requirement();
three_ramp_2.properties.x = 160;
three_ramp_2.properties.y = 140;
three_ramp_2.properties.flipped = true;

var three = new Challenge([three_ball], [three_ramp, three_ramp_2]);

// Challenge Four

var four_ball = new Requirement();
four_ball.properties.x = 50;
four_ball.properties.y = 0;

var four_ramp = new Requirement();
four_ramp.properties.x = 50;
four_ramp.properties.y = 256;

var four_ramp_2 = new Requirement();
four_ramp_2.properties.flipped = true;
four_ramp_2.properties.x = 114;
four_ramp_2.properties.y = 256;

var four = new Challenge([four_ball], [four_ramp, four_ramp_2]);

// Define some variables

CURRENT_CHALLENGE = 1;
CHALLENGES = [null, one, two, three, four];
CHALLENGE_STARTED = false;

// Play with some cookies

function currentChallenge() {
  if(document.cookie != "") {
    CURRENT_CHALLENGE = parseInt(document.cookie.split("=")[1]);
  }
  CURRENT_CHALLENGE = 1;
}

function setChallenge(index) {
  document.cookie = "current=" + index;
}
