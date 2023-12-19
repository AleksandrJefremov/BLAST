// Configuration for the game
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
  };
  
  // Create a Phaser game with the configuration
  const game = new Phaser.Game(config);
  
  // Global variables
  let player;
  let bullets;
  let cursors;
  
  function preload() {
    // Load assets (images and sprites)
    this.load.image('player', 'assets/anim/kalle/reload.png');
    this.load.image('bullet', 'assets/bullet.png');
  }
  
  function create() {
    // Set background color to brown
    this.cameras.main.setBackgroundColor('#8B4513');
  
    // Create player with a scale of 0.3
    player = this.physics.add.sprite(400, 300, 'player').setScale(0.3);
    
    // Enable input on the player sprite
    player.setInteractive();
  
    // Make the player "look" at the mouse cursor
    this.input.on('pointermove', function (pointer) {
      const angle = Phaser.Math.Angle.Between(player.x, player.y, pointer.x, pointer.y);
      player.setAngle(Phaser.Math.RadToDeg(angle));
    });
  
    // Create a group for bullets
    bullets = this.physics.add.group();
  
    // Enable collisions between bullets and the world bounds
    this.physics.world.setBoundsCollision(true, true, true, true);
  
    // Enable collisions between bullets and the player
    this.physics.add.collider(bullets, player, bulletHitPlayer);
    
    // Enable player controls
    cursors = this.input.keyboard.createCursorKeys();
  }
  
  function update() {
    // Player movement
    if (cursors.left.isDown) {
      player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
      player.setVelocityX(200);
    } else {
      player.setVelocityX(0);
    }
  
    if (cursors.up.isDown) {
      player.setVelocityY(-200);
    } else if (cursors.down.isDown) {
      player.setVelocityY(200);
    } else {
      player.setVelocityY(0);
    }
  
    // Player shooting
    if (this.input.keyboard.checkDown(cursors.space, 500)) {
      shootBullet();
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
  