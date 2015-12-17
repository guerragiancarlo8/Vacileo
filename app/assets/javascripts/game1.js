var canvasTest = document.getElementById("canvasTest");
var canvasDead = document.getElementById("canvasDead");
var canvasScore = document.getElementById("canvasScore");
var ctxScore = canvasScore.getContext("2d");
var canvasSeconds = document.getElementById("canvasSeconds");
var ctxSeconds = canvasSeconds.getContext("2d");
var ctxDead = canvasDead.getContext("2d");
var ctxTest = canvasTest.getContext("2d");
var canvasEntities = document.getElementById("canvasEntities2");
var ctxEntities = canvasEntities.getContext("2d");
var saveButton = document.getElementById("savebutton");
var reloadButton = document.getElementById('reloadbutton');
var requestAnimFrame =  window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.oRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        function(callback) {
                            window.setTimeout(callback, 1000 / 60);
                        };
var back = new Image(),
    score = new Image(),
    spritesheetgolemleft,
    spritesheetgolemright,
    spritesheet_zombie_walk_left,
    spritesheet_zombie_walk_right,
    spritesheet_zombie_rise,
    spritesheet_zombie_die,
    spritesheetgolemattack,
    canvasWidth = canvasTest.width,
    canvasHeight = canvasTest.height,
    fps = 60,
    i = 0,
    score = 0,
    count;

if(document.getElementById("saved-session")){
    var session = document.getElementById("saved-session").innerText;
}

var oldUrl = document.referrer
window.onbeforeunload = function(){
    return "Si estás utilizando el botón 'back' del navegador, tu partida no se reflejará en la página de usuario" +
    "si estás utilizando el botón de atrás, ignora este mensaje";
}

document.getElementById("backbutton").addEventListener("click",function(){
    window.location.replace(oldUrl);

})

if(document.getElementById("saved-score")){
    console.log('eje')
    var scoreTag = document.getElementById("saved-score").innerText;
    console.log(scoreTag)
    if(parseInt(scoreTag) != 0){
        score = parseInt(scoreTag)
    }
    else{
        score = 0;
    }
}

function loadSpriteSheets(){
    spritesheetgolemleft = new SpriteSheet('/assets/golem_walkleft.png',470,360,1500,6,ctxEntities,false);
    spritesheetgolemright = new SpriteSheet('/assets/golem_walkright.png',470,360,1500,6,ctxEntities,false);
    spritesheetgolemattack = new SpriteSheet('/assets/golem_attack.png',538,372,1500,6,ctxEntities,false);
    spritesheetgolemdie = new SpriteSheet('/assets/golem_die.png',470,504,10,6,ctxDead,true);
    spritesheet_zombie_walk_left = new SpriteSheet('/assets/zombie_walkleft.png',210,322,1500,10,ctxEntities,false);
    spritesheet_zombie_walk_right = new SpriteSheet('/assets/zombie_walkright.png',210,322,1500,10,ctxEntities,false);
    spritesheet_zombie_rise = new SpriteSheet('/assets/zombie_rise.png',220,322,7,9,ctxEntities,false);
    spritesheet_zombie_die = new SpriteSheet('/assets/zombie_die.png',200,300,7,8,ctxEntities,false);
}

if(saveButton){
    saveButton.addEventListener("click",function(){
        if(golem.isDead){
            if(!document.getElementById("saved-score")){
                $.ajax({
                    type:'POST',
                    url:"/games/1/game_sessions",
                    dataType: "json",
                    data: {score_obtained: score},
                    success: function(response){
                        console.log('success')
                    },
                    error: function(response){
                        console.log(response)
                    }
                })
                $(".alert-success").css("visibility","visible")
            }
            else if(document.getElementById("saved-score")){
                $.ajax({
                    type: 'PUT',
                    url:"/games/1/game_sessions/"+session,
                    dataType: "json",
                    data: {score_obtained: score},
                    success: function(response){
                        console.log('success');
                    },
                    error: function(response){
                        console.log(response);
                    }
                })
                $(".alert-success").css("visibility","visible")
            }
            golem.isDead = false;
            //muestra y esconde luego de 2 segundos
            setTimeout(function(){$(".alert-success").css("visibility","hidden");},2000);
        }
    })

}

function getScore(){
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/"
    })
} 

var seconds = 0
var isPlaying = true;
var eje = new Image();
eje.src = '/assets/hero.png'
setInterval(setTime, 1000);
loadSpriteSheets();
var zombies = []
golem = new Golem();
bala = new Bullet();
zombie = new Zombie(0,spritesheet_zombie_walk_left);
back.src = '/assets/back.png';
back.addEventListener("load",init,false);

function randomRange(min,max){
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function setTime(){
    ++seconds;
    clearCtx(ctxSeconds);
    ctxSeconds.font = "bold 28px Arial";
    ctxSeconds.fillText("Seconds "+seconds,80, 40);
}

function init(){
    document.addEventListener("keydown",function(e){checkKey(e,true);},false);
    document.addEventListener("keyup",function(e){checkKey(e,false);},false);
    initZombies(5);
    begin();
}

function initZombies(howmany){
    for(var pf = 0; pf<howmany; pf++){
        a = randomRange(0,canvasEntities.width)
        if(a > canvasEntities.width/2){
            a = canvasEntities.width - 150;
            zombies[pf] = new Zombie(a,spritesheet_zombie_walk_left);
            if(collision(golem,zombies[pf])){
                console.log('colision')
            }
        }
        else{
            a = 0 + randomRange(0,200);
            zombies[pf] = new Zombie(a,spritesheet_zombie_walk_right);
            if(collision(golem,zombies[pf])){
                console.log('colision')
            }
        }       
    }
    console.log(zombies);
}
function begin(){
    golem.isDead = false;
    ctxTest.drawImage(back,0,200,canvasTest.width,canvasTest.height,0,0,canvasTest.width,canvasTest.height);
    isPlaying = true;
    requestAnimFrame(loop);
}

function exit(){

    var soundEffect = new Audio('/assets/scream.wav')
        soundEffect.play();
    var ex = requestAnimFrame(exit)
    
    clearCtx(ctxEntities);
    clearCtx(ctxDead);
    if(i == 50){
        soundEffect.play();
        clearCtx(ctxDead);
        cancelAnimationFrame(ex);
        return;
    }
    spritesheetgolemdie.update();
    spritesheetgolemdie.draw(golem.drawX,canvasDead.height/8);
    i++;
    golem.isDead = true;
    
}
//enable reload button if it exists
if(reloadButton){
    reloadButton.addEventListener("click",function(){
            //reset golem to start position
        location.reload();
    });
}


function update(){
    for(var z = 0; z<zombies.length; z++){
        if(collision(golem,zombies[z])){
            isPlaying = false;
        }
    }
    clearCtx(ctxEntities);
    golem.update();
    for(var z = 0; z<zombies.length; z++){
        zombies[z].update();
    }

    if(score % 5 == 0 && score != 0 && arePlaying()){
        initZombies(5);
    }
    
}

function arePlaying(){
    for(var z=0; z<zombies.length; z++){
        if(zombies[z].drawX >= 0){
            return false;
        }
    }
    return true;
}

function checkAllDead(){
    for(var i=0;i<zombies.length;i++){
        if(zombies[i].drawX < 0){
            count++;
        }
    }  
}

function draw(){
    golem.draw();
    for(var z = 0; z<zombies.length; z++){
        zombies[z].draw();
    }
}

function loop(){
    setTimeout(function(){
        if(isPlaying){
            update();
            draw();
            requestAnimFrame(loop)
        }
        else{
            requestAnimFrame(exit)

        }
    },2000/fps);
}

function clearCtx(ctx){
    ctx.clearRect(0,0,canvasWidth, canvasHeight);
}

function SpriteSheet(path, frameWidth, frameHeight, frameSpeed, endFrame,ctx,once){
    var image = new Image();
    var framesPerRow,
            currentFrame = 0,
            counter = 0;
    //# of frames after image loads
    var self = this;

    image.onload = function(){
        framesPerRow = Math.floor(image.width/frameWidth);
    };
    image.src = path;
    this.update = function(){
        if(counter == (frameSpeed - 1))
            currentFrame = (currentFrame + 1) % endFrame;
        counter = (counter + 1) % frameSpeed;
        if(once == true){
            if(counter === endFrame){
                console.log('se supone q deveulva')
                return true;
            }
        }
    }
    this.draw = function(x,y){
        var row = Math.floor(currentFrame / framesPerRow);
        var col = Math.floor(currentFrame % framesPerRow);
        ctx.drawImage(
            image,
            col * frameWidth, row*frameHeight,
            frameWidth, frameHeight,
            x,y,
            frameWidth, frameHeight);
    };
};

function Golem(){
    var self = this;
    this.width = 470;
    this.height = 360;
    this.drawX = canvasEntities.width/3;
    this.drawY = canvasEntities.height/3;
    this.speed = 30;
    this.isLeftKey = false;
    this.isRightKey = false;
    this.isSpacebar = false;
    this.isShooting = false;
    this.isDead = false;
    this.spritesheet = spritesheetgolemleft;
    this.animate = function(){
        //console.log('sigue animando golem')
        if(isPlaying){
            requestAnimFrame(self.animate);
        }
        //requestAnimFrame(self.animate);
        self.spritesheet.update();
        self.spritesheet.draw(self.drawX,self.drawY);
    }
    var numBullets = 10;
    this.bullets = [];
    this.currentBullet = 0;
    for(var i = 0; i<numBullets; i++){
        this.bullets[this.bullets.length] = new Bullet();
    }
}

Golem.prototype.checkShooting = function(){
    if(this.isSpacebar && !this.isShooting){
        this.isShooting = true;
        if(this.spritesheet == spritesheetgolemright)
            this.bullets[this.currentBullet].fire(this.drawX+this.width,this.drawY*2);
        else
            this.bullets[this.currentBullet].fire(this.drawX,this.drawY*2);
        this.currentBullet++;
        if(this.currentBullet >= this.bullets.length){
            this.currentBullet = 0;
        }
    }
    else if(!this.isSpacebar){
        this.isShooting = false;
    }
}
Golem.prototype.updateAllBullets = function(){
    for(var i=0;i<this.bullets.length;i++){
        if(this.bullets[i].isFlying){
            this.bullets[i].update();
        }
    }
}

Golem.prototype.drawAllBullets = function(){
    for(var i=0;i<this.bullets.length;i++){
        if(this.bullets[i].isFlying){
            this.bullets[i].draw();
        }
    }
}

Golem.prototype.update = function(){
    //check if a key has been pressed.
    this.checkMovement();
    this.checkShooting();
    this.updateAllBullets();
}

Golem.prototype.draw = function(){
    this.animate();
    this.drawAllBullets();
};

Golem.prototype.checkMovement = function(){
    if(this.isLeftKey){
        this.drawX -= this.speed;
    }
    else if(this.isRightKey){
        this.drawX += this.speed;
    }
}

function collision(a, b){
    return ((b.drawX - b.width) - a.drawX) <= 210 &&
            ((b.drawX + b.width) - a.drawX) >= 30;
}

function Zombie(drawX, spritesheet){
    var self = this;
    this.width = 200;
    this.height = 312;
    this.drawX = drawX;
    this.drawY = canvasEntities.height/3
    this.speed = randomRange(1,3);
    this.spritesheet = spritesheet;
    this.isDead = false;
    this.animate = function(){
        if(isPlaying){
            requestAnimFrame(self.animate);
        }
        //requestAnimFrame(self.animate);
        self.spritesheet.update();
        self.spritesheet.draw(self.drawX,self.drawY);
    }
}

Zombie.prototype.death = function(){
    var soundEffect = new Audio("/assets/dying.wav");
    soundEffect.play();
    this.isDead = true;
    console.log('should erase');
}

Zombie.prototype.update = function(){
    //check if a key has been pressed.
    if(this.spritesheet == spritesheet_zombie_walk_right){
        this.drawX += this.speed;
    }
    else if(this.spritesheet == spritesheet_zombie_walk_left){
        this.drawX -= this.speed;
    }
    if(this.isDead){
        this.drawX = -1000

        clearCtx(ctxEntities);
    }
}

Zombie.prototype.draw = function(){
    this.animate();
};

function Bullet(){
    this.radius = 10;
    this.width = this.radius *2;
    this.height = this.radius * 2;
    this.drawX = 0;
    this.drawY = 0;
    this.isFlying = false;
    this.xVel = 0;
    this.yVel = 0;
    this.speed = 60;
}

Bullet.prototype.update = function(){
    this.drawX += this.xVel;
    this.checkHitEnemy()
}

Bullet.prototype.draw = function(){
    ctxEntities.fillStyle = "white";
    ctxEntities.beginPath();
    ctxEntities.arc(this.drawX, this.drawY, this.radius, 0, Math.PI*2, false);
    ctxEntities.closePath();
    ctxEntities.fill();
}

Bullet.prototype.fire = function(StartX,StartY){
    var soundEffect = new Audio("/assets/superLaser.wav");
    soundEffect.volume = 0.3;
    soundEffect.play();
    this.drawX = StartX;
    this.drawY = StartY;
    if(golem.spritesheet == spritesheetgolemright){
        this.xVel = this.speed;
    }
    else if(golem.spritesheet == spritesheetgolemleft){
        this.xVel = -this.speed;
    }
    this.isFlying = true;
}

Bullet.prototype.recycle = function(){
    this.isFlying = false;
}

Bullet.prototype.checkHitEnemy = function(){
    for(var i = 0; i<zombies.length;i++){
        if(collision(this,zombies[i])){
            this.recycle();
            
            zombies[i].death();
            score+=10;
            scoreDisplay();
            console.log(score);
        }
    }
}

function scoreDisplay(){
    ctxScore.font = "bold 28px Arial";
    clearCtx(ctxScore);
    ctxScore.fillText("Score: "+score,80,20);
}

function checkKey(e,value){
    var keyId = e.keyCode || e.which;
    if(keyId == 39){ //right arrow
        golem.spritesheet = spritesheetgolemright
        golem.isRightKey = value;
        e.preventDefault();
    }
    if(keyId == 37){
        golem.spritesheet = spritesheetgolemleft
        golem.isLeftKey = value;
        e.preventDefault();
    }
    if(keyId == 32){
        //golem.spritesheet = spritesheetgolemattack
        golem.isSpacebar = value;
        e.preventDefault()
    }
}