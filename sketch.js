let wedgeAngle = 18;
let layerRadius = 375;
let layer1Angle;
let layerPos;
let dialAngle = 90;
let screenAngle = 0;
let revealScreen = false;
let angleIncrement = wedgeAngle / 6;
let gameStatus;
let spectrum;
let rand;
let randSpectrum1;
let randSpectrum2;

function preload() {
  spectrum = loadTable('spectrum.csv', 'csv', 'header');
}

function setup() {
  createCanvas(800, 600);
  angleMode(DEGREES);
  layerPos = createVector(width / 2, height / 2 + 175);
  generateNewGame();
  gameStatus = false;
}

function draw() {
  background(0);
  showScreenButton();
  showNewGameButton();
  createLayer1();
  createLayer2();
  showDial();
  if (revealScreen) {
    screenAngle -= 2;
  }
  if (screenAngle <= 0) {
    revealScreen = false;
    if (gameStatus) checkWin();
  }
  showSpectrum();
  text("T<3M", width - 50, 20);
}

function createPolarShape(pos, startAngle, endAngle, color) {
  stroke(0);
  strokeWeight(1);
  fill(color);
  beginShape();
  vertex(pos.x, pos.y);
  for (let i = startAngle; i < endAngle; i += 0.01) {
    let x = pos.x - layerRadius * cos(i);
    let y = pos.y - layerRadius * sin(i);
    vertex(x, y);
  }
  endShape(CLOSE);
}

function createLayer1() {
  createPolarShape(layerPos, 0, layer1Angle, color(200));
  createPolarShape(layerPos, layer1Angle, layer1Angle + angleIncrement, color(234, 255, 48));
  createPolarShape(layerPos, layer1Angle + angleIncrement, layer1Angle + 2 * angleIncrement, color(249, 142, 2));
  createPolarShape(layerPos, layer1Angle + 2 * angleIncrement, layer1Angle + 4 * angleIncrement, color(237, 52, 42));
  createPolarShape(layerPos, layer1Angle + 4 * angleIncrement, layer1Angle + 5 * angleIncrement, color(249, 142, 2));
  createPolarShape(layerPos, layer1Angle + 5 * angleIncrement, layer1Angle + 6 * angleIncrement, color(234, 255, 48));
  createPolarShape(layerPos, layer1Angle + 6 * angleIncrement, 180, color(200));
}

function createLayer2() {
  createPolarShape(layerPos, 0, screenAngle, color(83, 159, 252));
}

function showScreenButton() {
  let buttonStr;
  if (screenAngle > 0) {
    fill(83, 159, 252);
    buttonStr = "Show";
  } else {
    fill(200);
    buttonStr = "Hide";
  }
  noStroke();
  rectMode(CENTER);
  rect(75, 50, 100, 50);
  textAlign(CENTER, CENTER);
  textSize(36);
  fill(0);
  text(buttonStr, 75, 50);
}

function showNewGameButton() {
  noStroke();
  fill(200);
  rect(200, 50, 100, 50);
  textSize(20);
  fill(0);
  text("New Game", 200, 50);
}

function showDial() {
  let x = layerPos.x - layerRadius * cos(dialAngle);
  let y = layerPos.y - layerRadius * sin(dialAngle);
  let rValue = map(x, layerPos.x - layerRadius / 2, layerPos.x + layerRadius / 2, 255, 155);
  let gValue = map(x, layerPos.x - layerRadius / 2, layerPos.x + layerRadius / 2, 155, 255);
  stroke(rValue, gValue, 50);
  strokeWeight(12);
  line(layerPos.x, layerPos.y, x, y);
  ellipse(layerPos.x, layerPos.y, 25);
}

function mouseClicked() {
  if (mouseX >= 25 && mouseX <= 125 && mouseY >= 25 && mouseY <= 75 && !revealScreen) {
    if (screenAngle <= 0) {
      screenAngle = 180;
      gameStatus = true;
    } else {
      revealScreen = true;
    }
  }

  if (mouseX >= 150 && mouseX <= 250 && mouseY >= 25 && mouseY <= 75 && !revealScreen && screenAngle <= 0) {
    generateNewGame();
  }
}

function mouseDragged() {
  if (dist(mouseX, mouseY, layerPos.x, layerPos.y) <= layerRadius && mouseY <= layerPos.y && screenAngle > 0) {
    if (mouseX < layerPos.x) {
      dialAngle = constrain(atan((mouseY - layerPos.y) / (mouseX - layerPos.x)), 0, 89);
    } else if (mouseX > layerPos.x) {
      dialAngle = constrain(180 - atan((mouseY - layerPos.y) / (layerPos.x - mouseX)), 91, 180);
    }
  }
}

function checkWin() {
  let result;
  if ((dialAngle >= layer1Angle && dialAngle < layer1Angle + angleIncrement) || (dialAngle <= layer1Angle + 6 * angleIncrement && dialAngle > layer1Angle + 5 * angleIncrement)) {
    result = "You won 1 point!";

  } else if ((dialAngle >= layer1Angle + angleIncrement && dialAngle < layer1Angle + 2 * angleIncrement) || (dialAngle <= layer1Angle + 5 * angleIncrement && dialAngle > layer1Angle + 4 * angleIncrement)) {
    result = "You won 2 points!";

  } else if (dialAngle >= layer1Angle + 2 * angleIncrement && dialAngle <= layer1Angle + 4 * angleIncrement) {
    result = "Congratulations! You won 3 points!";
  } else {
    result = "Sorry, you missed it!";
  }
  strokeWeight(1);
  fill(200);
  textSize(32);
  text(result, layerPos.x, layerPos.y + 75);
}

function generateNewGame() {
  layer1Angle = random(0, 180 - wedgeAngle + 1);
  rand = floor(random(0, spectrum.getRowCount()));
  randSpectrum1 = spectrum.get(rand, 0);
  randSpectrum2 = spectrum.get(rand, 1);
  gameStatus = false;
  dialAngle = 90;
}

function showSpectrum() {
  noStroke();
  textSize(36);
  text(randSpectrum1, layerPos.x - 250, layerPos.y + 30);
  text(randSpectrum2, layerPos.x + 250, layerPos.y + 30);
}