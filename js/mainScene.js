class mainScene extends Phaser.Scene {
  constructor() {
    super('mainScene');
  }
  preload() {

    this.load.image('ab', 'assets/images/ab.jpg');
    this.load.image('man', 'assets/images/sneeze.png');
    this.load.image('alien', 'assets/images/alien.png');
    this.load.image('bullet', 'assets/images/bullet .png');
    this.load.spritesheet('bomb',
      'assets/images/exp.png',
      { frameWidth: 256, frameHeight: 256 }
    );
    this.load.audio('bombSound', 'assets/audio/boom.wav');
    this.load.audio('shootSound', 'assets/audio/shoot.wav');
  }
  create() {

    //background
    let bg = this.add.image(0,0,'ab');
    bg.displayHeight = this.sys.game.config.height;
    bg.scaleX = bg.scaleY; 
    bg.y = game.config.height/2;
    bg.x = game.config.width/2;

    this.score = 0;

    //add physic
    this.manGroup = this.physics.add.group();
    this.alienGroup = this.physics.add.group();
    this.bulletGroup = this.physics.add.group();

    this.aGrid = new AlignGrid({ scene: this, rows: 11, cols: 11 });
    //this.aGrid.show();

    this.addChar();

    //add time event
    this.time.addEvent({ delay: 2000, callback: this.addChar, callbackScope: this, loop: true });

    this.time.addEvent({ delay: 5000, callback: this.addMan, callbackScope: this, loop: true });

    // add bullet
    this.input.on('pointerdown', this.addBullet, this);

    //check collider
    this.physics.add.collider(this.manGroup, this.bulletGroup, this.hitAction, null, this);
    this.physics.add.collider(this.alienGroup, this.bulletGroup, this.hitAction, null, this);

    // add score
    this.scoreText = this.add.text(50, 10, "Score : 0", { color: "#fff", fontSize: 48 });

    this.hintext=this.add.text(20, 320 ,"Shoot Alien",{ color: "#fff", fontSize: 48 });
    this.hintext.alpha = .4;

    //create animation
    this.anims.create({
      key: 'bom',
      frames: this.anims.generateFrameNumbers('bomb'),
      frameRate: 8,
      repeat: 0
    });
    this.bombSound = this.sound.add('bombSound');
    this.shootSound = this.sound.add('shootSound');
  }

  hitAction(man, bullet) {
    if (man.isMan) {
      this.scene.start('sceneOver', { score: this.score });
    }
    else {
      this.updateScore();
      this.bombSound.volume =.5;
      this.bombSound.play();
      this.bomb = this.add.sprite(man.x, man.y, 'bomb');
      Align.scaleToGameW(this.bomb, .2);
      this.bomb.play("bom");
      this.bomb.on('animationComplete', function () {
        this.destroy();
      })
    }
    man.destroy();
    bullet.destroy();
  }

  updateScore() {
    this.score++;
    this.scoreText.setText("Score " + this.score);
  }

  addMan(){
    var man = this.physics.add.sprite(0, 0, 'man');
    this.aGrid.placeAtIndex(20, man);
    Align.scaleToGameW(man, .1);
    this.manGroup.add(man);
    man.setVelocityX(-100);
    
    man.isMan = true;
  }

  addChar() {

    var alien = this.physics.add.sprite(0, 0, 'alien');
    this.aGrid.placeAtIndex(20, alien);
    Align.scaleToGameW(alien, .1);
    this.alienGroup.add(alien);
    alien.setVelocityX(-150);

  }

  addBullet(pointer) {
    this.shootSound.play();
    this.shootSound.volume = .5;
    var bullet = this.physics.add.sprite(pointer.x, game.config.height - 150, 'bullet');
    this.bulletGroup.add(bullet);
    bullet.setVelocityY(-800);

  }
  update() {

    this.alienGroup.children.iterate(function (child) {

      if (child.x < 0) {
        child.y = child.y+10;
        child.setVelocityX(150);
      }

      if (child.x >360) {
        child.y = child.y+10;
        child.setVelocityX(-150);
      }

    }.bind(this));

    this.manGroup.children.iterate(function (child) {
      
      if (child.x < 0) {
        child.y = child.y+10;
        child.setVelocityX(100);
      }

      if (child.x >360) {
        child.y = child.y+10;
        child.setVelocityX(-100);
      }


    }.bind(this));


  }
}