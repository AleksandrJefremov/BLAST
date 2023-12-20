// Configuration for the game
const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 800,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
        debug: false,
        },
    },
    scene: {
        create: create,
        update: update,
        preload: preload
    },
};
  
// Create a Phaser game with the configuration
const game = new Phaser.Game(config);

// Global variables
let player;
let cursors;
let enemies;
let enemySpawnTimer;
let line;
let bullets;
let score = 0;
let dead = 0;






function preload() {
  // Load assets (images and sprites)
  this.load.image('player', 'assets/anim/kalle/reload.png');
  //sthis.load.image('enemy', 'assets/enemy.png');
  this.load.image('bullet', 'assets/bullet3.png');
  this.load.spritesheet('enemy', 'assets/anim/knife/spritesheet.png', { frameWidth: 329, frameHeight: 300 }); // Adjust frame sizeww
}

function create() {
  // Set background color to blue
  this.cameras.main.setBackgroundColor('#5C4033');

  // Create player at the center of the screen
  player = this.physics.add.sprite(400, 300, 'player').setScale(0.22);

  // Enable physics for the player
  this.physics.world.enable(player);

  // Set up the camera to follow the player
  this.cameras.main.startFollow(player);
  // Enable cursor keys for player movement
  cursors = this.input.keyboard.createCursorKeys();

  bullets = this.physics.add.group();

  // Create a group for enemies
  enemies = this.physics.add.group();

  // Spawn a couple of enemies

  this.physics.add.collider(bullets, enemies, bulletHitEnemy);


  
  createHUD.bind(this)();


  enemySpawnTimer = this.time.addEvent({
    delay: 1000, // Spawn every 1000 milliseconds (1 second)
    callback: spawnEnemy.bind(this),
    callbackScope: this,
    loop: true, // Set to true for continuous spawning
  });

  this.anims.create({
    key: 'enemyAnimation',
    frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 14 }), // Adjust frame numbers
    frameRate: 32, // Adjust frame rate
    repeat: -1, // Set to -1 for looping
  });

  const enemy = this.physics.add.sprite(0, 0, 'enemy').setScale(0.17);
    this.physics.world.enable(enemy);
    enemies.add(enemy);
}

function update(time, delta) {
    playerSpeed = 100

    if (dead == 0){
    handleInput.bind(this)(delta, playerSpeed);
    lookAtCursor.bind(this)();
    } 


    enemiesControl.bind(this)();
    if (this.input.keyboard.checkDown(this.input.keyboard.addKey('SPACE'), 200)) {
      shootBullet.bind(this)();
  }


}

function death(){
  dead = 1;
}

function createHUD() {
  // Create a text element for the score
  hudText = this.add.text(16, 16, 'Kills: 0', {
      fontFamily: 'Arial',
      fontSize: '24px',
      fill: '#fff'
  }).setScrollFactor(0); // Make it fixed on the camera

  // You can add more HUD elements as needed
}

function shootBullet() {
  const bulletSpeed = 2000; // Adjust the bullet speed as needed
  const bulletSpawnOffset = 30; // Adjust the offset distance from the player's center
  const bulletOffsetRight = -9; // Adjust the offset to the right

  // Calculate the position of the bullet spawn point
  const spawnX = player.x + bulletSpawnOffset * Math.cos(player.rotation) + bulletOffsetRight * Math.cos(player.rotation - Math.PI / 2);
  const spawnY = player.y + bulletSpawnOffset * Math.sin(player.rotation) + bulletOffsetRight * Math.sin(player.rotation - Math.PI / 2);

  // Calculate the velocity components based on player's rotation
  const velocityX = bulletSpeed * Math.cos(player.rotation);
  const velocityY = bulletSpeed * Math.sin(player.rotation);

  // Create a bullet at the calculated spawn position with the calculated velocity
  const bullet = bullets.create(spawnX, spawnY, 'bullet').setScale(0.1); // Adjust the scale as needed
  bullet.setVelocity(velocityX, velocityY);

  // Set the origin to the center of the bullet sprite
  bullet.setOrigin(0.5, 0.5);

  // Set the bullet's rotation to face its moving direction
  bullet.setRotation(player.rotation + Math.PI); // Adjust the rotation as needed
}


function bulletHitEnemy(bullet, enemy) {
  // Destroy both the bullet and the enemy when they collide
  bullet.destroy();
  enemy.destroy();
 
  score += 1;

    // Update the HUD text
    hudText.setText('Kills: ' + score);


  // You can add additional logic or scoring here if needed
}

function handleInput(delta, speed) {
    // Player movement
    player.setVelocity(0);
  
    if (this.input.keyboard.addKey('A').isDown) {
      player.setVelocityX(-speed);
    } else if (this.input.keyboard.addKey('D').isDown) {
      player.setVelocityX(speed);
    }
  
    if (this.input.keyboard.addKey('W').isDown) {
      player.setVelocityY(-speed);
    } else if (this.input.keyboard.addKey('S').isDown) {
      player.setVelocityY(speed);
    }
  }
  

  function spawnEnemy() {
    const spawnDistance = 600;
    const angle = Math.random() * Math.PI * 2;
    const spawnX = player.x + spawnDistance * Math.cos(angle);
    const spawnY = player.y + spawnDistance * Math.sin(angle);
  
    // Create and add an enemy at the calculated position
    const enemy = this.physics.add.sprite(spawnX, spawnY, 'enemy').setScale(0.17);
    this.physics.world.enable(enemy);
    enemies.add(enemy);
  }
a  

function lookAtCursor() {
    const worldX = this.input.x + this.cameras.main.scrollX;
    const worldY = this.input.y + this.cameras.main.scrollY;
  
    const angleToPointer = Phaser.Math.Angle.Between(player.x, player.y, worldX, worldY);
    player.rotation = angleToPointer;
}

function enemiesControl() {
  // Update enemy rotation to face the player
  enemies.getChildren().forEach(function (enemy) {
      const angleToPlayer = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
      enemy.rotation = angleToPlayer;

      const distanceToPlayer = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);
      const speed = 200; // Adjust the speed as needed

      if (distanceToPlayer < 10) { // Adjust the distance threshold as needed
        enemy.setVelocity(0, 0); // Stop moving
        enemy.anims.play('enemyAnimation', true); // Play animation
        dead = 1;
        fs.writeFile('Output.txt', score, (err) => {
 
          // In case of a error throw err.
          if (err) throw err;
      })
        setTimeout(() => {
          // Change 'your-page.html' to the actual HTML page you want to redirect to
          window.location.href = 'your-page.html';
      }, 2000);


    } else if(distanceToPlayer < 100){
      enemy.setVelocity(speed * Math.cos(angleToPlayer), speed * Math.sin(angleToPlayer));
      enemy.anims.play('enemyAnimation', true); // Play animation
        
    } else {
      enemy.anims.stop('enemyAnimation'); // Stop animation
      enemy.setVelocity(speed * Math.cos(angleToPlayer), speed * Math.sin(angleToPlayer));
    }
  });
}
  
  
  