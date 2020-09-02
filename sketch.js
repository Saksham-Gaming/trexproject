var trex, trex_running, edges;
var groundImage;
var ground;
var invisibleGround;
var score = 0;
//Cloud Despaqwn Logic
var i = -1;
var ilife = 0;
var cloud = [i];
var gameState = "Play";
//Groups
var cloudGroup;
var cactiGroup;
//Sounds and Other
var restartSprite;
var sndBenchMark;
var sndDie;
var sndJump;
var trexLose;
var trexJump;
var top;
function preload() {
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png")
  trex1 = loadImage("trex1.png");  
  cloudsSprite = loadImage("cloud.png");
  cacti1 = loadImage("obstacle1.png");
  cacti2 = loadImage("obstacle2.png");
  cacti3 = loadImage("obstacle3.png");
  cacti4 = loadImage("obstacle4.png");
  cacti5 = loadImage("obstacle5.png");
  cacti6 = loadImage("obstacle6.png");
  restart = loadImage("restart.png");
  sndBenchMark = loadSound("benchMark.mp3");
  sndDie = loadSound("die.mp3");
  sndJump = loadSound("jump.mp3");
  trexLose = loadAnimation("trex_collided.png");
  trexJump = loadAnimation("trex1.png");
}
 

function setup(){
  createCanvas(600,200);
  top = createSprite(300,-20,800,20);
  restartSprite = createSprite(300,50,20,20);
  restartSprite.addImage("Restart Image",restart);
  restartSprite.scale = 0.5;
  restartSprite.visible = false;
  trex = createSprite(50,160,20,50);
  trex.addAnimation("jump",trexJump);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("lose",trexLose);
  edges = createEdgeSprites();
  //Create Ground Sprite
  ground = createSprite(300,180,600,20);
  ground.addImage("ground",groundImage); 
  ground.x = ground.width/2;
  //adding scale and position to trex
  trex.scale = 0.5;
  trex.x = 50
  ground.velocityX = -10;
  invisibleGround = createSprite(0,188,1200,10);
  invisibleGround.visible = false;
  cloudGroup = createGroup();
  cactiGroup = createGroup();
}


function draw() {
  background("white"); 
  if (gameState === "Play") {
    score += Math.round(getFrameRate()/60);
    //set background color 
    
    if (score % 100 == 0 && score != 0) {
      sndBenchMark.play();
    }
    
    if (ground.x<0) {
    
      ground.x = ground.width/2;   
    }
    ground.velocityX =  ground.velocityX - 0.01;
  
    // trex.velocityX = 2;
    //jump when space key is pressed
    if((keyDown("space")||mouseDown("left"))&&trex.y>158){
     sndJump.play(); 
    trex.velocityY = -10;
    }
    if (trex.y>159) {
    trex.changeAnimation("running",trex_running);
    } else {
      trex.changeAnimation("jump",trexJump);
    }
    spawnClouds();
    background("white");

    spawnCacti();


    trex.velocityY = trex.velocityY + 0.5;
    
    //stop trex from falling down
    trex.collide(invisibleGround);
    text("Score: " + score,"20","20");
    if (cactiGroup.isTouching(trex)) {
      trex.changeAnimation("running",trex_running);
      restartSprite.y = -20;
      sndDie.play();
      gameState = "End";
    }
  }
      if (cloud.length-1 > ilife) {
    if (cloud[ilife].x<-100||cloud[ilife].y<-10) {
      cloud[ilife].life = 0;
      ilife += 1
    }
  }
    if (gameState === "End") {
      if (trex.x >= 300) {
        trex.velocityX = 0;
        trex.changeAnimation("lose",trexLose);
      } else {
        trex.velocityX = 2; 
      }
      if (trex.y >= 159.75) {
        trex.velocityY = 0;
      } else {
        trex.velocityY = 2; 
      }
      restartSprite.visible = true;
      if (restartSprite.y >= 50) {
        restartSprite.velocityY = 0;
      } else {
        restartSprite.velocityY = 2; 
      }
      if (mousePressedOver(restartSprite)) {
        gameState = "Reset";
      }
      ground.velocityX = 0;
      if (ground.y >=210) {
      ground.velocityY = 0;
      } else {
        ground.velocityY = 0.4;  
      }
      cloudGroup.setVelocityYEach(-1);
      cactiGroup.setVelocityYEach(0.8);
        cloudGroup.setVelocityXEach(0);
      cactiGroup.setVelocityXEach(0);
      text("Game Over Your Score Was: " + score,220,100);
    }
  if (gameState === "Reset") {
    if (trex.x <= 50) {
        trex.velocityX = 0;
        
      } else {
        trex.velocityX = -2;
        trex.changeAnimation("running",trex_running);
      }
    if (ground.y<=180) { 
      ground.velocityY = 0;
    } else {
      ground.velocityY = -0.4;  
    }
    if (trex.x <= 50 && ground.y<=180) {
      gameState = "Reset Finishing Touches";
    }
    restartSprite.velocityY = 4;
  }
  if (gameState === "Reset Finishing Touches") {
    score = 0;
    ground.velocityX = -10;
    gameState = "Play";
  }
  drawSprites();
  }

function spawnClouds() {
  //write code here to spawn the clouds
  if ((frameCount % Math.round(random(40,45)) === 0)&&gameState=="Play") {
    i++;
    cloud.push(cloud[i] = createSprite(600,320,40,10));
    cloudGroup.add(cloud[i]);
    cloud[i].addImage(cloudsSprite);
    cloud[i].y = Math.round(random(10,60))
    cloud[i].scale = 0.9;
    cloud[i].velocityX = ground.velocityX + Math.round(random(-5,5));
    
    
    //assigning lifetime to the variable
   
    
    //adjust the depth
    cloud[i].depth = trex.depth
    trex.depth = trex.depth + 1;
    }
}

function spawnCacti() {
  if (frameCount % 70 === 0) {
    cacti = createSprite(600,ground.y-18,20,20);
    cactiGroup.add(cacti);
    cacti.velocityX = ground.velocityX;
    let randomNum = Math.round(random(1,6));
    cacti.scale = 0.7;
    switch (randomNum) {
      case 1: cacti.addImage(cacti1);
              break;
      case 2: cacti.addImage(cacti2);
              break;
      case 3: cacti.addImage(cacti3);
              break;
      case 4: cacti.addImage(cacti4);
              break;
      case 5: cacti.addImage(cacti5);
              break;
      case 6: cacti.addImage(cacti6);
              break;
      default: break;
    }
  }
}