const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let oxDino = 100, oyDino = 200, sizeObj = 50;
let tableCol = 16;
let obstacles = [], startingObstacles = 2;
let gameTime = 0, time = 0;
let jumpSpeed = 0, gravity = 0.1;
let spacePressed = false;
let activePlayer = true;

function drawDinosaur() {
	let dinosaur = new Image();
	dinosaur.src = "photo/dinosaur.png";
	ctx.beginPath();
	dinosaur.addEventListener("load", function () {
		ctx.clearRect(100, 0, sizeObj, sizeObj + 200);
		ctx.drawImage(dinosaur, oxDino, oyDino, sizeObj, sizeObj);
	}, false);
	ctx.closePath();
}

function jump() { //dinosaur jump function
	if (oyDino == 200 && spacePressed) { 
		jumpSpeed = -6; //
		spacePressed = false;
  	}
  	oyDino += jumpSpeed; //oyDino is updated with jump speed
  	jumpSpeed += gravity; //jump speed is updated with gravitational acceleration
  	if (oyDino > 200) {
    	oyDino = 200;
    	jumpSpeed = 0;
  	}
}

function dinoJump(ability) {
	if (ability.code == "Space") {
		spacePressed = true;				
	}
}

function drawObstacles() {
	let imgObstacle = new Image();
	imgObstacle.src = "photo/obstacle.png";
	ctx.beginPath();
	for (let i = 0; i < obstacles.length; ++i) {
		ctx.clearRect(obstacles[i].x, obstacles[i].y, sizeObj, sizeObj);
		ctx.drawImage(imgObstacle, obstacles[i].x, obstacles[i].y, sizeObj, sizeObj);
		if (obstacles[i].x <= -50) {
			generateOrReplaceObstacles(i);
		}
		obstacles[i].x -= 2;
		if (checkCollision(obstacles[i].x, obstacles[i].y, oxDino, oyDino)) {
			gameOver();
		}
	}
	ctx.closePath();
}

function generateOrReplaceObstacles(position = -1) {
	let random = () => Math.floor(Math.random() * tableCol);
	let x, y, overlap;
	do {
		x = random() + tableCol; y = 200;
		x *= sizeObj; //multiply to get the real position on the canvas
		overlap = false;
		for (let i = 0; i < obstacles.length; ++i) {
			if (checkCollision(x, y, obstacles[i].x, obstacles[i].y)) {
				overlap = true; //found an overlap
				break;
			}
		}
	} while (overlap); //repeat until there is no overlap
	if (position === -1) { // if no position is specified, a new obstacle is generated
		obstacles.push({ x, y });
	} else { //replace the obstacle at the given position
		obstacles[position] = { x, y };
	}
}

function drawLine() {
	ctx.beginPath();
	ctx.moveTo(0, 255);
	ctx.lineTo(800, 255);
	ctx.stroke();
	ctx.closePath();
}

function animation() {
	drawObstacles();
	drawDinosaur();
	jump();
	window.requestAnimationFrame(animation);
}

function checkCollision(ox1, oy1, ox2, oy2) {
	let overlapX = (ox1 < ox2 + sizeObj) && (ox1 + sizeObj > ox2);
	let overlapY = (oy1 < oy2 + sizeObj) && (oy1 + sizeObj > oy2);
	return overlapX && overlapY;
}

function updateStats() {
	++time;
	document.getElementById("time").innerHTML = time;
}

function gameOver() {
	document.getElementById("gameOver").innerText = "Game over / ";
	obstacles = [];
	clearInterval(gameTime);
	activePlayer = false;
}

function reload() { //new game
	location.reload();
}

window.onload = function generatedGameTable () {
	drawLine();
	drawDinosaur();
	document.addEventListener("keydown", function (ability) {
		if (activePlayer) {
			dinoJump(ability);
		}
	});
}

function startGame() {
	for (let i = 0; i < startingObstacles; ++i) {
		generateOrReplaceObstacles();
	}
	animation();
	gameTime = setInterval(function () {
		updateStats();
	}, 1000);
	document.getElementById("startGame").disabled = true;
}