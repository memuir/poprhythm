canvas = document.getElementById('myCanvas');
context = canvas.getContext('2d');
var colorS = ["#90C3D4","#BE90D4","#90D4B8","#D49C90","#D98F99", "#58F575"];
var colorBlind = ['#5265E3', '#52E1E3','#F59700', '#F5F558', '#BDBFC7', '#A86E0F' ];

var timer = 0;
var keysPressed = {};
var particles = [];
var rad= 30;
var colorB = false;
var wait =  100;
var start = new Date().getTime();  
var time = 0;  
var elapsed = '0.0';  
var clickable = false;
var endTime = 0;
var cueColor = 0;
var isin = false;
var matchColor = colorS[2];
var midSize = 70;
var midB = 90;
var midCirc =  new circ(canvas.width/2, canvas.height/2,colorS[3], midSize );
var cueCirc =  new onCue(canvas.width/2, canvas.height/2,colorS[3], midB );//color not working 
var beat = 0.0;
var beats = [];//1,2,.5
var beatIter = 0;   
var numbeats = 0;
var someB = 0;
var radB;
var hotstreak = 0; 

function currentBeat(){
	var fi = .5;
	var def = 1;
	var tw = 2;
	//console.log("this is someB:" + someB);
	//console.log(beats.length);

			if(elapsed == mybeats && mybeats%1 == 0 && mybeats != 0){
			
				if(beats[someB] == 2){
				someB++;
				return fi;		
				}
				else if(beats[someB] == 1){
				someB++;
				return def;		
				}
				else if(beats[someB] == .5){
				someB++;
				return tw;		
				}
				else if ( someB === beats.length) {
					//console.log("checking");
					someB = 0;
					return def;
				}
	
			}
			else{
				return fi;
			}
	
}
   
function instance(){
			if(elapsed == beat && elapsed != 0){
				numbeats++;
				//radB = currentBeat();
		//console.log(numbeats);
		//console.log(elapsed);
	}
	//console.log(hotstreak);
	//console.log(beat);
    time += 100;  
    elapsed = Math.floor(time / 100) / 10;  
    if(Math.round(elapsed) == elapsed) { 
    	elapsed += '.0'; 
    }  
    var diff = (new Date().getTime() - start) - time;  
    window.setTimeout(instance, (100 - diff));  
}
window.setTimeout(instance, 100); 

//variables used to determine number of beats a player clicks without skipping
var mybeats = 0.0;
var add = true;
var tempscore1 = 0;
var tempscore2 = 0;
var tempbeats = 0;
var beatadd = true;
var hotadd = true;
var best = 0;


//makes small circles clickable only on the beats using the beats array, tracks number of beats for scoring/levelng up
function timerstuff(){
	//console.log(beat);
	if(elapsed == beat-0.2){
		tempscore1 = score;
	}
	if(elapsed == beat+0.2){
		tempscore2 = score;
		if(tempscore1 == tempscore2 && add == true){
			//console.log('skipped beat');
			if(beatadd){
				//console.log('skip');
				hotstreak = 0;
				beatadd = false
			} else {
				beatadd = true;
			};
		} else {
			//console.log('hit');
			if(hotadd){
				hotstreak++;
				if(best < hotstreak){
				best = hotstreak;
				}
				hotadd = false;
			} else {
				hotadd = true;
			}
			
		}
	}
	//console.log(best);
	if(elapsed == beat && elapsed != 0){
		if(add){
			mybeats += 1;
			add = false;
		} else {
			add = true;
		}
		//console.log(mybeats);
		if(mybeats%1==0 && mybeats!= 0){
			radB = currentBeat();
		}
	}
	if(elapsed > beat-0.2 && elapsed < beat+0.2){
  		clickable = true;
  	} else {
  		clickable = false;
  	};
  	if(elapsed == beat+0.3){
  		beat += beats[beatIter];
  		if(beatIter == beats.length-1){
  			beatIter = 0;
  		} else {
  			beatIter++;
  		};
  	};
}



document.addEventListener( "keydown", doKeyDown);

function onCue(x,y,color, radius){

	this.x = x;
  	this.y = y;
  	this.radius = radius;
  	this.color = color;

	this.drawCue = function(){
		context.fillStyle = matchColor; // did this to try to figure out why
		context.beginPath();
		context.arc(this.x, this.y, this.radius,0 , Math.PI * 2);
		//context.stroke();
		context.fill();
	}
	
	this.update = function(){
		if( elapsed == beat){
			this.radius = 90;
		} else {
			this.radius -=radB;
		}
    }
    
}



function doKeyDown(e) {
	if ( e.keyCode == 83 ) {
		click = true;
		colorB = true;
	}

	if(e.keyCode == 75){
		click = true;
		colorB = false;
	}
}


canvas.addEventListener("click", circlicks);
var isout = false;
function circlicks(e){
  	var x = e.clientX;
  	var y = e.clientY
  	isin = false;
  	if(checkIn(x,y)){
  		isin = true
  	} else {
  		isout = true;
  	}; 
}

function inSmall(x,y){
	for(i in particles){            //trying out the in ( instead of the usual)
    	if((x >= particles[i].x-particles[i].radius ) && x <= (particles[i].x + particles[i].radius) &&
        (y >= particles[i].y-particles[i].radius) && y <= (particles[i].y + particles[i].radius )){
      		return  particles[i].col;
    	}
  	}
}

function isMid(){
	var isMid = midCirc.col;
  	return isMid;
}




function circ(x,y,color, radius){
  
	this.x = x;
  	this.y = y;
  	this.radius = radius;
  	this.color = color

  	this.drawcircle = function(){
    	context.fillStyle = this.col;
    	context.beginPath();
    	context.arc(this.x, this.y, this.radius,0 , Math.PI * 2);
    	context.stroke();
    	context.fill();
  	}
  
    this.updateM = function(){
    	this.randNum = Math.floor(Math.random() *5 );
    	if (colorB){
    		matchColor = colorBlind[this.randNum];
    	} else {
    		matchColor = colorS[this.randNum];
    	};
    	this.col = matchColor;
    	cueCirc.color = matchColor;
    }
  
  
	this.update = function(){
  	//console.log(clickable);
    	this.randNum = Math.floor(Math.random() *5 );  
    	this.col = setColor;
		
    }
    
}


function smallCircles(numParticles) {
	var angle= (Math.PI/numParticles);
	var radOfB  = 100
	var s = Math.sin(angle);
	var rDelta = ( Math.PI / 180); 
	var r = radOfB * s / (1 - s);
	var centY = canvas.height/2;
	var centX = canvas.width/2;
    
    for (var i = 0; i < numParticles; i++){
    	var phi = Math.PI * radOfB / 180 + angle *i *2;
    	
    	if(level == 1){
    		var x = level1pos[0].x;
    		var y = level1pos[0].y;
    		beats = [1,1,1];
    	};
    	if(level == 2){
    		var x = level2pos[i].x;
    		var y = level2pos[i].y;
    		beats = [1,2,2];
    	};
    	if(level == 3){
    		var x = level3pos[i].x;
    		var y = level3pos[i].y;
    		beats = [.5,1,2];
    	};
    	if(level == 4){
    		var x = level4pos[i].x;
    		var y = level4pos[i].y;
    		beats= [1,2,.5];    		
    	}
    	if(level >=5){
    		var x = centX + (radOfB + r ) *Math.cos(phi);
    		var y = centY + (radOfB + r )*Math.sin(phi);
    		//get a random tempo
    	}
    	//console.log(x);
    	//console.log(y);
    	particles.push(new circ( x,y , colorS[3] , rad ));
    }
}


function checkIn(x,y){
	var smallCirI = inSmall(x,y);
 	var bigCircle = isMid();
 	for (var i = 0; i < particles.length; i++) {
  		if(smallCirI == bigCircle && clickable){ // Now make it change when clicked on the right color.
			return true;
   		};
  	}
	return false;
}

var score = 0;
var click = false;
var setColor = 'white';
var highscore = 0;


function update() {
	console.log('score ' + score);
	console.log('best ' + best);
	if((score == 10 && level < 7) || (hotstreak > 3)){
		highscore += score;
		console.log(highscore);
		score = 0;
		level++;
		reset();
		particles = [];
		smallCircles(level);
		updateColors();
		draw();
	} else {
		if(isout){
			misses++;
			isout = false;
		}
	if(isin || click){
		if(isin){
			score++;	
		};
		centerCol = 'yellow';
		setTimeout(function(){centerCol = 'black';}, 100);
		updateColors();
  	}
	cueCirc.update();
	click = false;
	}
}
var misses = 0;
function updateColors(){
	var position = Math.floor((Math.random() * (level)) + 0);
		//console.log(position);
    	midCirc.updateM();
    	if(colorB == false){
    	var tempset = colorS[Math.floor(Math.random() *5 )];
    			while(tempset == matchColor){
    				tempset = colorS[Math.floor(Math.random() *5 )];
    			};
    	};
    	if(colorB){
    		    	var tempset = colorBlind[Math.floor(Math.random() *5 )];
    			while(tempset == matchColor){
    				tempset = colorBlind[Math.floor(Math.random() *5 )];
    			};
    	}
    	for(p in particles){
    		if(p == position || level == 1){
    			//console.log('pos');
    			setColor = matchColor;
    		} else {
    			setColor = tempset;
    		};
    		particles[p].update();
   		}

}

function reset(){
hotstreak = 0;
matchColor = colorS[2];

midCirc =  new circ(canvas.width/2, canvas.height/2,colorS[3], midSize );
cueCirc =  new onCue(canvas.width/2, canvas.height/2,colorS[3], midB );//color not working 

}

function draw() {
	canvas.width = canvas.width;
	context.fillStyle = 'black';
	context.fillRect(0, 0, canvas.width, canvas.height); 
	context.fill();
	cueCirc.drawCue();
	for (var i = 0; i < particles.length; i++) {
		particles[i].drawcircle();
	}
	for(p in particles){
		particles[p].drawcircle();
	}
	context.fillStyle = centerCol;//'hsl(' + cueColor++ +', 70%, 20%)';
    context.beginPath();
    context.arc(canvas.width/2, canvas.height/2, 70,0 , Math.PI * 2);
    //context.stroke();
    context.fill();
	//midCirc.drawcircle();
}
var centerCol = 'black';


function size(){
	if(elapsed == beat){
		for(p in particles){
			particles[p].radius = 30;		
		};
  	} else {
  		for(p in particles){
			particles[p].radius = 25;		
		}
  	};
}


function game_loop() {
	timerstuff();
	size();
    update();
    isin = false;
    draw(); 
}

function xypos(y, x){
	this.x = x;
	this.y = y;
}

//var numcircs = 6;
var level = 1;
var level1pos = [new xypos(canvas.height/2-170, canvas.width/2)];
var a = new xypos(canvas.height/2, midCirc.x-70 - 100);
var b =  new xypos(canvas.height/2, midCirc.x+70+100);
var level2pos = [a, b];
var level3pos = [new xypos(canvas.height/2, midCirc.x+70+100), new xypos(canvas.height/2, midCirc.x-70 - 100), new xypos(canvas.height/2-170, canvas.width/2)];
var level4pos = [new xypos(canvas.height/2, midCirc.x+70+100), new xypos(canvas.height/2, midCirc.x-70 - 100), new xypos(canvas.height/2-170, canvas.width/2), new xypos(canvas.height/2+170, canvas.width/2)];
var level5pos = [];
var level6pos = [];

smallCircles(level);
updateColors();
setInterval(game_loop, 50);