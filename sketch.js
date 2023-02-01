var PLAY = 1;
var END = 0;
var gameState = PLAY;

var character, character_running, character_collided;
var ground, invisibleGround, groundImage;

var birdGroup, birdImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;
var backgroundImg;
var score = 0;

var canjump = true;

var gameOver, restart;

function preload(){

    backgroundImg = loadImage("Background.png");

    character_running = loadAnimation("run1.png","run2.png","run3.png","run4.png","run5.png","run6.png","run7.png","run8.png");
    character_collided = loadAnimation("dead1.png", "dead2.png", "dead3.png", "dead4.png", "dead5.png", "dead6.png", "dead7.png", "dead8.png");

    groundImage = loadImage("woodGround1.png");

    birdImage = loadAnimation("bird1.png", "bird2.png", "bird3.png", "bird4.png");

    obstacle1 = loadImage("spikeA.png");
    obstacle2 = loadImage("spikeC.png");
    obstacle3 = loadImage("spikeD.png");

    gameOverImg = loadImage("GameOver.png");
    restartImg = loadImage("restartButton.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    character = createSprite(50,180, 20, 50);
    character.addAnimation("running", character_running);
    character.addAnimation("collided", character_collided);
    character.setCollider('rectangle', 0, 0, 55, 55);
    character.debug = true;
    character.scale = 2;

    invisibleGround = createSprite(width/2, height-10, width, 125);
    invisibleGround.shapeColor = "#f4cbaa";

    ground = createSprite(width/2, height, width, 2);
    ground.addImage("ground", groundImage);
    ground.x = width/2; 
    ground.velocityX = -(4 + 3*score/100);

    restart = createSprite(windowWidth/2, windowHeight/2);

    restart.addImage(restartImg);

    gameOver = createSprite(width/2 + 20,height/2 - 100);
    gameOver.addImage(gameOverImg);

    gameOver.scale = 0.5;
    restart.scale = 0.1;

    gameOver.visible = false;
    restart.visible = false;

    obstaclesGroup = new Group();
    birdGroup = new Group();

    score = 0;
}

function draw() {

    background(backgroundImg);
    textSize(20);
    fill("black");
    text("Score: " + score, 30, 50);

    if (gameState === PLAY) {
        score = score + Math.round(getFrameRate()/60);
        ground.velocityX = -(4 + 3*score/100);

        if(keyDown("space") && canjump && character.isTouching(ground)) {
            character.velocityY = -20 ;
            canjump = true ;
        }

        character.velocityY = character.velocityY + 0.8  

        if (ground.x < 700){
            ground.x = ground.width/2;
        }

        character.collide(invisibleGround);

        spawnBird();
        spawnObstacles();

        if(obstaclesGroup.isTouching(character) || birdGroup.isTouching(character)){
            gameState = END;
        }
        


    }
    else if (gameState === END) {
        gameOver.visible = true;
        restart.visible = true;

        ground.velocityX = 0;
        character.velocityY = 0;
        obstaclesGroup.setVelocityXEach(0);
        birdGroup.setVelocityXEach(0);

        character.changeAnimation("collided", character_collided);

        obstaclesGroup.setLifetimeEach(-1);
        birdGroup.setLifetimeEach(-1);

        if(mousePressedOver(restart)){
            reset();
        }
    }

    character.collide(invisibleGround);

    drawSprites();
}

function spawnObstacles(){
    if(frameCount % 120 === 0) {
        var obstacle = createSprite(600, height - 95, 20, 30);
        obstacle.setCollider('circle',0,0,45);
        obstacle.velocityX = -(4 + 3*score/100);

        var rand = Math.round(random(1,3));
        switch(rand) {
            case 1: obstacle.addImage(obstacle1);
                    break;
            case 2: obstacle.addImage(obstacle2);
                    break;
            case 3: obstacle.addImage(obstacle3);
                    break;
            default: break;
        }

        obstacle.scale = 0.4;
        obstacle.lifetime = 300;
        obstacle.depth = character.depth;
        obstacle.depth = ground.depth;
        character.depth += 1;

        obstaclesGroup.add(obstacle);
    }
}

function spawnBird(){

    if(frameCount % 144 === 0){
        var bird = createSprite(600, 120,40,10);
        bird.y = Math.round(random(100, 320));
        bird.addAnimation("fly", birdImage);
        bird.scale = 3;
        bird.velocityX = Math.round(random(-8,-20));

        bird.lifetime = 300;

        bird.depth = character.depth;
        character.depth += 1;

        birdGroup.add(bird);
    }
}

function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;

    obstaclesGroup.destroyEach();
    birdGroup.destroyEach();

    character.changeAnimation("running", character_running);

    score = 0;
}