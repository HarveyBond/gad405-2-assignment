const mainState = {
  addmainasteroid: function () {
//creates the asteroid funtion to add asteroids
    const mainasteroid = this.asteroids.create(480, game.rnd.integerInRange(-5, 340), 'asteroid');
    game.physics.arcade.enable(mainasteroid);
    //creates asteroids at the x position of 480 but with a random y position and aslo gives the asteroids arcade physics
    mainasteroid.body.velocity.x = -this.playerSpeed;
    // makes the asteroids move towards the player
    mainasteroid.events.onOutOfBounds.add((asteroid) => {
      asteroid.destroy();
      //when asteroids leave the screen they are destroy to make the game run smoothly
    });

    mainasteroid.body.setSize(30, 30, 30, 30)
    //this sets the size of the asteroids hit box and the hit box position
    this.playerJustCrossedasteroids = false;
    // so player cant cross asteroids
  },


  create: function () {
    game.add.tileSprite(0, 0, 350, 490, 'background');
    game.stage.disableVisibilityChange = true;
// adds the background art to the game

    this.player = game.add.sprite(80, 240,'player');
    this.player.scale.setTo(0.4, 0.4);
    this.player.anchor.set(0.5);
    // sets the sprite attributes
    this.playerSpeed = 125;
    this.playerenginePower = 300;
    // sets the speed and movement attributes
    this.playerJustCrossedasteroids = false;
    game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 800;
    this.player.body.collideWorldBounds = true;
    //sets the physics attributes
    this.explosionSound = game.add.audio('explosionsound');
    this.engineSound = game.add.audio('engine');
    //adds the sound to the game
    this.player.body.setSize(40, 40, 40, 40);
// sets the player hitbox size and position of hitbox

    this.asteroids = game.add.group();
    this.addmainasteroid();
    this.asteroids.scale.setTo(1.3, 1.3);
// add the asteroids to a group and sets the scale of them


    this.score = 0;
    this.scoreText = game.add.text(175, 20, '0', { font: '30px Arial', fill: '#ffffff' });
// adds the score text
    game.input.onDown.add(this.engine, this);
    // binds the movement to mouse click
    game.time.events.loop(300, this.addmainasteroid, this);
    // spawns the the asteroids every 400ms
  },


  die: function () {
    game.add.tileSprite(this.player.x, this.player.y, 64, 64, 'explosion');
    //places an explosion  over the ship when its hit
    this.explosionSound.play();
    // plays explosion sound effect
    game.state.start('gameover', true, false, this.score);
    // starts the game over screen state
  },

  engine: function () {
    this.engineSound.play();
    //plays the sound with the engine activation
    this.player.body.velocity.y = -this.playerenginePower;
    //movement for player
  },

  preload: function () {
    game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.load.image('player', 'assets/player.png');
    game.load.image('asteroid', 'assets/asteroid.png');
    game.load.image('background', 'assets/background.png');
    game.load.image('explosion', 'assets/explosion.png')
    game.load.audio('engine', 'assets/engine.wav');
    game.load.audio('explosionsound', 'assets/explosion.wav');
    // preloads all the assests
  },

  update: function () {
    game.physics.arcade.overlap(this.player, this.asteroids, this.die, null, this);
 //kills player on asteroid overlap
    this.asteroids.forEach((asteroid) => {
      if (this.playerJustCrossedasteroids === false && asteroid.alive && asteroid.x + asteroid.width < this.player.x) {
        this.playerJustCrossedasteroids = true;
        this.updateScore();
        // updates the score when passing a asteroid
      }
    });
  },

  updateScore: function () {
    this.score = this.score + 1;
    this.scoreText.text = `${this.score}`;
    //adds score text
  }
};
const gameoverState = {

  create: function () {

    game.add.tileSprite(0, 0, 350, 490, 'background');
    game.stage.disableVisibilityChange = true;
// adds the backgorund to game over state
    game.add.sprite(80, 240,'player');
// adds the player sprite to game over state
    this.asteroid = game.add.tileSprite(140, 263, 64, 64, 'asteroid');
    this.asteroid.scale.setTo(1.3, 1.3);
    // adds the asteroid to game over state
    game.add.tileSprite(120, 270, 64, 64, 'explosion');
    // adds the explosion to show the crash to game over state

    game.add.text(50, 120, "You dodged "+ (this.score) + " asteroids", { font: '25px Arial', fill: '#ffffff' });
    game.add.text(25, 40, "GAME OVER", { font: '50px Arial', fill: '#ffffff' });
    game.add.text(70,150, "Click to play again", { font: '25px Arial', fill: '#ffffff' });
    // adds the end screen text to the state
    game.input.onDown.add(() => { game.state.start('main'); });
    //allows you to restart game
  },
  init: function(score)  {

   this.score = score;
// allows this.score to be called
  }
};



const game = new Phaser.Game(350, 490,);
game.state.add('main', mainState);
game.state.add('gameover', gameoverState);
game.state.start('main');
// sets up the game states
