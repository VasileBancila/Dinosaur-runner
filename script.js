const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let oxDino = 100, oyDino = 200, sizeObj = 50;
let boardCol = 16;
let cactus = [], startingCactus = 2;
let intrvalTime = 0, time = 0; 
let jumpSpeed = 0, gravity = 0.1;
let spacePressed = false;
let activePlayer = true;

function drawLine() {
	ctx.beginPath();
	ctx.moveTo(0, 255);
	ctx.lineTo(800, 255);
	ctx.stroke();
	ctx.closePath();
}

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

function jump() {
	if (oyDino == 200 && spacePressed) { 
		jumpSpeed = -5;
		spacePressed = false;
  	}
  	oyDino += jumpSpeed;
  	jumpSpeed += gravity;
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

function drawCactus() {
	let imgCactus = new Image();
	imgCactus.src = "photo/cactus.png";
	ctx.beginPath();
	for (let i = 0; i < cactus.length; ++i) {
		ctx.clearRect(cactus[i].x, cactus[i].y, sizeObj, sizeObj);
		ctx.drawImage(imgCactus, cactus[i].x, cactus[i].y, sizeObj, sizeObj);
		if (cactus[i].x === -50) {
			generateOrReplaceCactus(i);
		}
		cactus[i].x -= 2;
		if (checkCollision(cactus[i].x, cactus[i].y, oxDino, oyDino)) {
			gameOver();
		}
	}
	ctx.closePath();
}

function generateOrReplaceCactus(position = -1) {
	let random = () => Math.floor(Math.random() * boardCol);
	let x, y, overlap;
	do {
		x = random() + boardCol; y = 200;
		x *= sizeObj; //multiply to get the real position on the canvas
		overlap = false;
		for (let i = 0; i < cactus.length; ++i) {
			if (checkCollision(x, y, cactus[i].x, cactus[i].y)) {
				overlap = true; //found an overlap
				break;
			}
		}
	} while (overlap); //repeat until there is no overlap
	if (position === -1) { // if no position is specified, a new missile is generated
		cactus.push({ x, y });
	} else { //replace the cactus at the given position
		cactus[position] = { x, y };
	}
}

function animation() {
	drawCactus();
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
	cactus = [];
	clearInterval(gameTime);
	activePlayer = false;
}

function reload() { //new game
	location.reload();
}

function startGame() {
	drawLine();
	document.addEventListener("keydown", function (ability) {
		if (activePlayer) {
			dinoJump(ability);
		}
	});
	for (let i = 0; i < startingCactus; ++i) {
		generateOrReplaceCactus();
	}
	animation();
	gameTime = setInterval(function () {
		updateStats();
	}, 1000);
	document.getElementById("startGame").disabled = true;
}