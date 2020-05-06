class sceneOver extends Phaser.Scene {
    constructor() {
        super('sceneOver');
    }

    preload() {
        this.load.image('bb', 'assets/images/ab.jpg');
    }

    init(data) {
        //console.log('init', data);
        this.fScore = data.score;

    }

    create() {

        //background
        let bg = this.add.image(0, 0, 'bb');
        bg.displayHeight = this.sys.game.config.height;
        bg.scaleX = bg.scaleY;
        bg.y = game.config.height / 2;
        bg.x = game.config.width / 2;

        this.alien = this.add.image(game.config.width / 2, game.config.height / 2, 'alien');
        this.gameOverText = this.add.text(game.config.width / 2 - 130, game.config.height / 2 - 180, "Game Over", { color: "#fff", fontSize: 48 });

        this.add.text(game.config.width / 2 - 15, game.config.height / 2 - 100, this.fScore, { color: "#fff", fontSize: 48 });

    }

}