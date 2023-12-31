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
let bullets;
let cursors;
let debugText;
let lastKnownRotation = 0;

function preload() {
  // Load assets (images and sprites)
  this.load.image('player', 'assets/anim/kalle/reload.png');
  this.load.image('bullet', 'assets/bullet.png');
}

function create() {
  // Set background color to brown
  this.cameras.main.setBackgroundColor('#8B4513');

  // Enable physics in the scene
  this.physics.world.setBounds(0, 0, 800, 600); // Adjust bounds as needed

  // Create player with a scale of 0.3
  player = this.physics.add.sprite(400, 300, 'player').setScale(0.3);

  // Enable input on the player sprite
  player.setInteractive();

  // Enable player controls
  cursors = this.input.keyboard.createCursorKeys();

  // Create a group for bullets
  bullets = this.physics.add.group();

  // Enable collisions between bullets and the player
  this.physics.add.overlap(bullets, player, bulletHitPlayer);

  // Enable physics for the player
  this.physics.world.enable(player);

  // Set up the camera to follow the player
  this.cameras.main.startFollow(player);

  // Create debug text
  debugText = this.add.text(10, 10, '', { fontFamily: 'Arial', fontSize: 16, color: '#ffffff' }).setOrigin(0);

  // Input event for the "U" key
  this.input.keyboard.on('keydown-U', function () {
    toggleDebugMenu();
  });
}

function update() {
  // Call functions to handle player movement and rotation
  updatePlayerMovement.bind(this)();
  updatePlayerRotation.bind(this)();

  // Check if the player is outside the screen boundaries


}

// Function to handle player movement
function updatePlayerMovement() {
  const deltaTime = this.time.deltaTime / 1000; // Convert milliseconds to seconds

  const maxSpeed = 300; // Adjust the maximum speed as needed

  // Player movement
  const moveX = (cursors.up.isDown || this.input.keyboard.addKey('W').isDown) - (cursors.down.isDown || this.input.keyboard.addKey('S').isDown);
  const moveY = (cursors.up.isDown || this.input.keyboard.addKey('W').isDown) - (cursors.down.isDown || this.input.keyboard.addKey('S').isDown);

  // Strafing left/right
  const strafeX = (this.input.keyboard.addKey('D').isDown ? -1 : 0) + (this.input.keyboard.addKey('A').isDown ? 1 : 0);

  // Calculate velocity components
  const velocityX = moveX * Math.cos(player.rotation) + strafeX * Math.cos(player.rotation - Math.PI / 2);
  const velocityY = moveY * Math.sin(player.rotation) + strafeX * Math.sin(player.rotation - Math.PI / 2);

  // Set the player velocity
  player.setVelocity(maxSpeed * velocityX, maxSpeed * velocityY);
}

// Function to handle player rotation
function updatePlayerRotation() {
  // Mouse rotation
  const angleToPointer = Phaser.Math.Angle.Between(player.x, player.y, this.input.x, this.input.y);
  player.rotation = angleToPointer;

  // Player shooting
  if (this.input.keyboard.checkDown(this.input.keyboard.addKey('SPACE'), 500)) {
    shootBullet();
  }

  // Update debug text if the debug menu is active
  if (debugText.visible) {
    debugText.setText(`Player Location: (${player.x.toFixed(2)}, ${player.y.toFixed(2)})\nPlayer Rotation: ${player.angle.toFixed(2)}`);
  }
}

function shootBullet() {
  const bullet = bullets.create(player.x, player.y, 'bullet');
  bullet.setVelocity(Phaser.Math.GetSpeed(player.body.velocity.x, player.body.velocity.y, 400));
}

function bulletHitPlayer(player, bullet) {
  // You can add additional logic when the player is hit by a bullet
  bullet.destroy();
}

function handlePlayerDeath() {
  player.setVelocity(0, 0);
  lastKnownRotation = player.rotation;
  player.setRotation(lastKnownRotation);

  // Add code to handle player death, for example, showing a death screen
  // You can display a game over message, reset the player's position, or transition to another scene
  // For simplicity, let's just log a message to the console
  console.log("Player died! Show death screen or perform other actions.");
}
