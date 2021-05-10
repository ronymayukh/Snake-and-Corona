



function init(){
	canvas = document.getElementById('mycanvas');
	W = H = canvas.width = canvas.height = 1000;
	pen = canvas.getContext('2d');
	cs = 66;
	activeVaccine = false;
	game_over = false;
	score = 0;
	vaccineCount = 0;
	numVirus = 10;


	//Create a Image Object for food
	food_img = new Image();
	food_img.src = "Assets/apple.png";

	trophy = new Image();
	trophy.src = "Assets/trophy.png";

	vial = new Image();
	vial.src = "Assets/vials.png";

	vaccine_img = new Image();
	vaccine_img.src = "Assets/vaccine.png";

	corona_img = new Image();
	corona_img.src = "Assets/corona.png";

	food = getRandomFood();
	corona = getRandomCorona();
	vaccine = getRandomVaccine();

	snake = {
		init_len:5,
		color:"blue",
		headColor:"red",
		cells:[],
		direction:"right",


		createSnake:function(){
			for(var i=this.init_len;i>0;i--){
				this.cells.push({x:i,y:0});
			}
		},
		drawSnake:function(){

			for(var i=0;i<this.cells.length;i++){
				if(i == 0){
					pen.fillStyle = this.headColor;
					pen.fillRect(this.cells[i].x*cs-2,this.cells[i].y*cs-2,cs,cs);
				}else{
					pen.fillStyle = this.color;
					pen.fillRect(this.cells[i].x*cs,this.cells[i].y*cs,cs-4,cs-4);
				}
				
				
			}
		},

		updateSnake:function(){

			var headX = this.cells[0].x;
			var headY = this.cells[0].y;

			for(var i=1;i<this.cells.length;i++){
				if(this.cells[i].x == headX && this.cells[i].y == headY){
					game_over = true;
					break;
				}
			}

			for(var i=0;i<numVirus;i++){

				if((corona.x[i] == food.x && corona.y[i] == food.y) || (activeVaccine && corona.x[i] == vaccine.x && corona.y[i] == vaccine.y)){
					continue;
				}

				if(headX == corona.x[i] && headY == corona.y[i]){
					
					if(vaccineCount == 0){
						game_over = true
					}
					corona = getRandomCorona();
					vaccineCount--;
					break;


				}
			}

			if(activeVaccine && headX==vaccine.x && headY==vaccine.y){
				console.log("Vaccinated");
				activeVaccine = false;
				vaccineCount++;
			}
			

			if(headX==food.x && headY==food.y){
				console.log("Food eaten");
				food = getRandomFood();
				score++;

			}
			else
			{
				this.cells.pop();
			}

			var nextX,nextY;

			if(this.direction=="right"){
				nextX = headX + 1;
				nextY = headY;
			}
			else if(this.direction=="left"){
				nextX = headX - 1;
				nextY = headY;
			}
			else if(this.direction=="down"){
				nextX = headX;
				nextY = headY + 1;
			}
			else{
				nextX = headX;
				nextY = headY - 1;
			}

			this.cells.unshift({x: nextX,y:nextY});

			/*Write a Logic that prevents snake from going out*/
			var last_x = Math.round(W/cs);
			var last_y = Math.round(H/cs);

			if(this.cells[0].y<0 || this.cells[0].x < 0 || this.cells[0].x > last_x || this.cells[0].y > last_y){
				game_over = true;
			}

		}

	};

	snake.createSnake();
	//Add a Event Listener on the Document Object
	function keyPressed(e){
		//Conditional Statments
		if(e.key=="ArrowRight"){
			snake.direction = "right";
		}
		else if(e.key=="ArrowLeft"){
			snake.direction = "left";
		}
		else if(e.key=="ArrowDown"){
			snake.direction = "down";
		}
		else{
			snake.direction = "up";
		}
		console.log(snake.direction);
	}


	document.addEventListener('keydown',keyPressed) ;
	
}


function draw(){

	pen.clearRect(0,0,W,H);

		
	pen.drawImage(food_img,food.x*cs,food.y*cs,cs,cs);

	if(activeVaccine){
		pen.drawImage(vaccine_img,vaccine.x*cs,vaccine.y*cs,cs,cs);
	}

	for(var i=0;i<numVirus;i++){
		if(corona.x[i] == food.x && corona.y[i] == food.y){
			continue;
		}
			

		if(activeVaccine && corona.x[i] == vaccine.x && corona.y[i] == vaccine.y){
			continue;
		}
		pen.drawImage(corona_img,corona.x[i]*cs,corona.y[i]*cs,cs,cs);
	}
	

	snake.drawSnake();

	

	pen.drawImage(trophy,18,20,60,60);
	pen.font = "40px Roboto"
	pen.fillText(score,39,55);

	pen.drawImage(vial,10,80,80,80);
	pen.font = "40px Roboto"
	pen.fillText(vaccineCount,39,135);

	
}

function update(){

	snake.updateSnake(); 
}

function getRandomFood(){

	var foodX = Math.round(Math.random()*(W-cs)/cs);
	var foodY = Math.round(Math.random()*(H-cs)/cs);

	var food = {
		x:foodX,
		y:foodY
	}

	numVirus += 1

	return food

}

function getRandomVaccine(){

	var vaccineX = Math.round(Math.random()*(W-cs)/cs);
	var vaccineY = Math.round(Math.random()*(H-cs)/cs);

	var vaccine = {
		x:vaccineX,
		y:vaccineY,
	}
	return vaccine

}

function getRandomCorona(){
	var coronaX = [];
	var coronaY = [];

	for(var i=0; i<numVirus; i++){
		coronaX.push(Math.round(Math.random()*(W-cs)/cs));
		coronaY.push(Math.round(Math.random()*(H-cs)/cs));
	}

	var corona = {
		x:coronaX,
		y:coronaY,

	}
	return corona
}

function gameloop(){
	if(game_over==true){
		clearInterval(f);


		alert("Game Over");
		return;
	}
	draw();
	update();
}



function changeCorona(){
	corona = getRandomCorona();
}

function changeVaccine(){
	vaccine = getRandomVaccine();
	activeVaccine = true;
	setTimeout(deactivateVaccine,5000);
	
}

function deactivateVaccine(){
	activeVaccine = false
	console.log("Vaccine Deactivated")
}



init();

var f = setInterval(gameloop,500);
var coronaPositionChange = setInterval(changeCorona, 10000);
var vaccinePositionChange = setInterval(changeVaccine,15000);











