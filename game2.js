// Configuration for the game
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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



function preload() {
    // Load assets (images and sprites)
    this.load.image('player', 'assets/anim/kalle/reload.png');
    this.load.image('enemy', 'assets/enemy.png');
}

function create() {
    // Set background color to blue
    this.cameras.main.setBackgroundColor('#964B00');

    // Create player at the center of the screen
    player = this.physics.add.sprite(400, 300, 'player').setScale(0.2);

    // Enable physics for the player
    this.physics.world.enable(player);

    // Set up the camera to follow the player
    this.cameras.main.startFollow(player);
    // Enable cursor keys for player movement
    cursors = this.input.keyboard.createCursorKeys();

  // Create a group for enemies
  enemies = this.physics.add.group();

  // Spawn a couple of enemies


  enemySpawnTimer = this.time.addEvent({
    delay: 1000, // Spawn every 1000 milliseconds (1 second)
    callback: spawnEnemy.bind(this),
    callbackScope: this,
    loop: true, // Set to true for continuous spawning
  });
}

function update(time, delta) {
    playerSpeed = 200
    handleInput.bind(this)(delta, playerSpeed);
    lookAtCursor.bind(this)();
    updateEnemyRotation.bind(this)();

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
    const enemy = this.physics.add.sprite(spawnX, spawnY, 'enemy').setScale(0.2);
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

function updateEnemyRotation() {
    // Update enemy rotation to face the player
    enemies.getChildren().forEach(function (enemy) {
      const angleToPlayer = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
      enemy.rotation = angleToPlayer;

      const speed = 100; // Adjust the speed as needed
    enemy.setVelocity(speed * Math.cos(angleToPlayer), speed * Math.sin(angleToPlayer));s
    });
    
}
  
  
  