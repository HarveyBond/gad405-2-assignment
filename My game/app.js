const mainState = {
  addmainasteroid: function () {

    const mainasteroid = this.asteroids.create(480, game.rnd.integerInRange(-5, 340), 'asteroid');
    game.physics.arcade.enable(mainasteroid);
    mainasteroid.body.velocity.x = -this.playerSpeed;
    mainasteroid.events.onOutOfBounds.add((asteroid) => {
      asteroid.destroy();
    });

    mainasteroid.body.setSize(30, 30, 30, 30)
    this.playerJustCrossedasteroids = false;
  },


  create: function () {
    game.add.tileSprite(0, 0, 350, 490, 'background');
    game.stage.disableVisibilityChange = true;


    this.player = game.add.sprite(80, 240,'player');
    this.player.scale.setTo(0.4, 0.4);
    this.player.anchor.set(0.5);
    this.playerSpeed = 125;
    this.playerenginePower = 300;
    this.playerJustCrossedasteroids = false;
    game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 800;
    this.player.body.collideWorldBounds = true;
    this.explosionSound = game.add.audio('explosionsound');
    this.engineSound = game.add.audio('engine');
    this.player.body.setSize(40, 40, 40, 40);


    this.asteroids = game.add.group();
    this.addmainasteroid();
    this.asteroids.scale.setTo(1.3, 1.3);

  

    this.score = 0;
    this.scoreText = game.add.text(175, 20, '0', { font: '30px Arial', fill: '#ffffff' });

    game.input.onDown.add(this.engine, this);
    game.time.events.loop(400, this.addmainasteroid, this);
  },


  die: function () {
    game.add.tileSprite(this.player.x, this.player.y, 64, 64, 'explosion');
    this.explosionSound.play();
    game.state.start('main');
  },

  engine: function () {
    this.engineSound.play();
    this.player.body.velocity.y = -this.playerenginePower;
  },

  preload: function () {
    game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.load.image('player', 'assets/player.png');
    game.load.image('asteroid', 'assets/asteroid.png');
    game.load.image('background', 'assets/background.png');
    game.load.image('explosion', 'assets/explosion.png')
    game.load.audio('engine', 'assets/jump.mp3');
    game.load.audio('explosionsound', 'assets/explosion.wav');
  },

  update: function () {
    game.physics.arcade.overlap(this.player, this.asteroids, this.die, null, this);

    this.asteroids.forEach((asteroid) => {
      if (this.playerJustCrossedasteroids === false && asteroid.alive && asteroid.x + asteroid.width < this.player.x) {
        this.playerJustCrossedasteroids = true;
        this.updateScore();
      }
    });
  },

  updateScore: function () {
    this.score = this.score + 1;
    this.scoreText.text = `${this.score}`;
  }
};

const game = new Phaser.Game(350, 490,);
game.state.add('main', mainState);
game.state.start('main');
