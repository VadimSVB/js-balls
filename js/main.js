
window.addEventListener('load', function (event) {
	respondCanvas();
	initCanvas();

});

//изменение размеров
function respondCanvas() {

	var canv = document.getElementById('balls_canvas'),
		scrollHeight = Math.max(
			document.body.scrollHeight, document.documentElement.scrollHeight,
			document.body.offsetHeight, document.documentElement.offsetHeight,
			document.body.clientHeight, document.documentElement.clientHeight
		);
	//максимальная ширина
	canv.setAttribute("width", document.documentElement.offsetWidth);
	//максимальная высота
	canv.setAttribute("height", scrollHeight - 7);

}


function initCanvas() {
	var ctx = document.getElementById('balls_canvas').getContext('2d'),
		canvasWidth = ctx.canvas.width,
		canvasHeight = ctx.canvas.height,
		//высота ячейки с шариками
		container_height = 100;
		//картинка
//			pic = new Image();
//			pic.src = 'img/m&m.jpg';
		//переменные
		var mouseX = 0,
				mouseY = 0,

				speedX = 0,
				speedY = 0,


				ball_id = '';






	// Движение шарика
	function moveBall(ball) {

		// шарик в контейнере
		if (ball.conteiner) {
			if (ball.centerX + ball.radius > canvasWidth) {
				if (ball.ball_move) {
					ball.speedX = 0;
				} else {
					speedX = -speedX * 0.7;
					speedX *= 0.99;
				}
				ball.centerX = canvasWidth - ball.radius;
			}

			if (ball.centerX - ball.radius < 0) {
				if (ball.ball_move) {
					ball.speedX = 0;
				} else {
					ball.speedX = -ball.speedX * 0.7;
					//падает вниз
					ball.speedY *= 0.99;
				}
				ball.speedX = 0;
			}
			//  
			if (ball.centerY + ball.radius > container_height) {
				if (ball.ball_move) {
					ball.speedY = 0;
				} else {
					ball.speedX *= 0.99;
					ball.speedY = -ball.speedY * 0.7;
				}
				ball.centerY = container_height - ball.radius;
			}
			//  
			if (ball.centerY < 0) {
				if (ball.ball_move) {
					ball.speedY = 0;
				} else {
					ball.speedX *= 0.99;
					ball.speedY = -ball.speedY * 0.7;
				}
				ball.speedY = 0;
			}


			if (ball.ball_move) {



				ball.speedX = (mouseX - ball.centerX) / 2,
					ball.speedY = (mouseY - ball.centerY) / 2;
			}
			ball.speedY += 0.9;
			ball.speedX *= 0.99;
			ball.speedY *= 0.99;
			ball.centerX += ball.speedX;
			ball.centerY += ball.speedY;





		} else {
			// шарик на поле
			if (ball.centerX - ball.radius <= 0) {
				ball.centerX = ball.radius
				ball.speedX *= -1
			}
			if (ball.centerX + ball.radius >= canvasWidth) {
				ball.centerX = canvasWidth - ball.radius
				ball.speedX *= -1
			}
			if (ball.centerY - ball.radius <= container_height) {
				ball.centerY = ball.radius + container_height
				ball.speedY *= -1
			}
			if (ball.centerY + ball.radius >= canvasHeight) {
				ball.centerY = canvasHeight - ball.radius
				ball.speedY *= -1
			}
			if (ball.ball_move) {
				ball.speedX = (mouseX - ball.centerX) / 2,
					ball.speedY = (mouseY - ball.centerY) / 2;
			}

			ball.centerX += ball.speedX, ball.centerY += ball.speedY;
		}
	};


	// проверка ударений	
	function checkCollision(balls) {
		for (var i = 0; i < balls.length; i++) {
			for (var j = i + 1; j < balls.length; j++) {
				var ball1 = balls[i],
					ball2 = balls[j],
					dist = Math.pow((ball1.centerX - ball2.centerX), 2) + Math.pow((ball1.centerY - ball2.centerY), 2);
				if (ball1.radius + ball2.radius >= Math.sqrt(dist)) {
					collision(balls[i], balls[j])
				}
			}
		}
	};



	//расчёт удара
	function collision(ball1, ball2) {
		var dx = ball2.centerX - ball1.centerX,
			dy = ball2.centerY - ball1.centerY,
			rotation = Math.atan2(dy, dx),
			sin = Math.sin(rotation),
			cos = Math.cos(rotation);

		var x1 = 0,
			y1 = 0
		var vx1 = ball1.speedX * cos + ball1.speedY * sin,
			vy1 = ball1.speedY * cos - ball1.speedX * sin

		var x2 = dx * cos + dy * sin,
			y2 = dy * cos - dx * sin
		var vx2 = ball2.speedX * cos + ball2.speedY * sin,
			vy2 = ball2.speedY * cos - ball2.speedX * sin,

			vxTotal = vx1 - vx2;

		vx1 = ((ball1.weight - ball2.weight) * vx1 + 2 * ball2.weight * vx2) / (ball1.weight + ball2.weight);

		vx2 = vx1 + vxTotal;

		var absV = Math.abs(vx1) + Math.abs(vx2),
			overlap = (ball1.radius + ball2.radius) - Math.abs(x1 - x2);
		x1 += vx1 / absV * overlap;
		x2 += vx2 / absV * overlap;
		//


		ball1.speedX = ball1.speedX + x1 * cos - y1 * sin
		ball1.speedY = ball1.speedY + y1 * cos + x1 * sin
		ball2.speedX = ball1.speedX + x2 * cos - y2 * sin
		ball2.speedY = ball1.speedY + y2 * cos + x2 * sin

		ball1.speedX = vx1 * cos - vy1 * sin
		ball1.speedY = vy1 * cos + vx1 * sin
		ball2.speedX = vx2 * cos - vy2 * sin
		ball2.speedY = vy2 * cos + vx2 * sin
	};



	//Добавить / удалить шарики
	function addBalls() {
			var b = {
			"id": +(Date.now().toString().slice(-4)),
			"centerX": 90,
			"centerY": -130,
			"radius": 20,
			"start_angle": 0,
			"end_angle": Math.PI * 2,
			"clockwise": false,
			"color": "#"+(Date.now().toString().slice(-6)),
			"speedX": 0,
			"speedY": 0,
			"weight": 1,
			"ball_move": false,
			"conteiner": true
		},
		container_balls = [],
		cash_balls;
balls.forEach(function(b){
	if(b.conteiner){
		container_balls.push(b.id)
		if(container_balls.length > 6){
		balls.shift(container_balls[0]);
		container_balls.shift();
	}
	}
				})
if(container_balls.length == 0 ){
	
	balls.push(b);
	
}
		
		
	
		

	};



	//стартовый набор шариков	
	var balls = sessionStorage['balls'] ? JSON.parse(sessionStorage['balls']) : [
		{
			"id": 0,
			"centerX": 30,
			"centerY": -30,
			"radius": 20,
			"start_angle": 0,
			"end_angle": Math.PI * 2,
			"clockwise": false,
			"color": "magenta",
			"speedX": 0,
			"speedY": 0,
			"weight": 2,
			"ball_move": false,

			"conteiner": true
		},
		{
			"id": 1,
			"centerX": 60,
			"centerY": -60,
			"radius": 20,
			"start_angle": 0,
			"end_angle": Math.PI * 2,
			"clockwise": false,
			"color": "green",
			"speedX": 0,
			"speedY": 0,
			"weight": 2,
			"ball_move": false,

			"conteiner": true
		},
		{
			"id": 2,
			"centerX": 150,
			"centerY": -110,
			"radius": 20,
			"start_angle": 0,
			"end_angle": Math.PI * 2,
			"clockwise": false,
			"color": "orange",
			"speedX": 0,
			"speedY": 0,
			"weight": 2,
			"ball_move": false,

			"conteiner": true
		},{
			"id": 3,
			"centerX": 190,
			"centerY": -150,
			"radius": 20,
			"start_angle": 0,
			"end_angle": Math.PI * 2,
			"clockwise": false,
			"color": "dodgerblue",
			"speedX": 0,
			"speedY": 0,
			"weight": 2,
			"ball_move": false,

			"conteiner": true
		},{
			"id": 4,
			"centerX": 318,
			"centerY": -240,
			"radius": 20,
			"start_angle": 0,
			"end_angle": Math.PI * 2,
			"clockwise": false,
			"color": "crimson",
			"speedX": 0,
			"speedY": 0,
			"weight": 2,
			"ball_move": false,

			"conteiner": true
		}
    								];


				

	//сохранение шариков	
	function saveBalls() {
		draw = null;
		sessionStorage.removeItem('balls')
		sessionStorage['balls'] = JSON.stringify(balls);
	};





	//рендер шариков		
	function draw() {
		var animate = requestAnimationFrame(draw);
		
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
//		ctx.drawImage(pic, 0,container_height, canvasWidth,canvasHeight );
		balls.forEach(function (b) {
			ctx.beginPath();
			//двигаем шарик мышкой
			//если шарик не двигали
			if (!b.ball_move) {
				ctx.arc(b.centerX, b.centerY, b.radius, b.start_angle, b.end_angle, b.clockwise);
				
			} else {
				//если двигают
				ctx.arc(mouseX, mouseY, b.radius, b.start_angle, b.end_angle, b.clockwise);
				//если двигают на поле
				if (mouseY - b.radius >= container_height) {
					b.speedX = speedX;
					b.speedY = speedY;
					
					b.conteiner = false;

				} else {
					//если двигают в контейнер
					b.speedX = 0;
					b.speedY = 0;
					
					b.conteiner = true;

				}
			}
			ctx.fillStyle = b.color;
			ctx.fill();
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#111';
			ctx.stroke();
			//линия разделения
			ctx.beginPath();
			ctx.lineTo(0, container_height)
			ctx.lineTo(canvasWidth, container_height)
			ctx.stroke();

			//функции
			checkCollision(balls)
			moveBall(b)
			addBalls();
		})









	}
	draw()
	ctx.canvas.addEventListener('mousedown', function (event) {
		mouseX = event.clientX - ctx.canvas.offsetLeft;
		mouseY = event.clientY - ctx.canvas.offsetTop;
		balls.forEach(function (b) {
			if (mouseX >= b.centerX - b.radius && mouseX < (b.centerX + b.radius) && mouseY >= b.centerY - b.radius && mouseY < (b.centerY + b.radius)) {
				// начинаем перетаскивать шарик
				ball_id = b.id;
				b.ball_move = true;
				console.log(b + ' ' + b.id)
			}
		});
	});
	ctx.canvas.addEventListener('mousemove', function (event) {
		event.preventDefault();
		if (typeof ball_id === "number") {
			mouseX = event.clientX - ctx.canvas.offsetLeft;
			mouseY = event.clientY - ctx.canvas.offsetTop;
		}
	});
	ctx.canvas.addEventListener('touchmove', function (event) {
		event.preventDefault();

		if (typeof ball_id === "number") {
			mouseX = event.changedTouches[0].clientX - ctx.canvas.offsetLeft;
			mouseY = event.changedTouches[0].clientY - ctx.canvas.offsetTop;
		}


	});
	ctx.canvas.addEventListener('mouseup', function (event) {
				event.preventDefault();
			
				if (typeof ball_id === "number") {
					balls.forEach(function (b) {
						if (b.id === ball_id) {
							b.centerX = mouseX;
							b.centerY = mouseY;
							b.ball_move = false;
							ball_id = undefined;
							
						}
					});
				};
	});
				ctx.canvas.addEventListener('touchend', function (event) {
					event.preventDefault();
					
					if (typeof ball_id === "number") {
						balls.forEach(function (b) {
								if (b.id === ball_id) {
									b.centerX = mouseX;
									b.centerY = mouseY;
									b.ball_move = false;
									ball_id = undefined;
									
								}
							})
						}
				});
				
				window.addEventListener('beforeunload', saveBalls, false);
				window.addEventListener('resize', function () {
					saveBalls();
					location.reload();
				});
			}