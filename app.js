//Tameshi
enchant();

/* 定数 */
// パラメータ
var SCREEN_WIDTH;
var SCREEN_HEIGHT;

var FISH_WIDTH = 34;
var FISH_HEIGHT = 34;

// ステージ
function sizing(){
	SCREEN_WIDTH = $(document).width();
	SCREEN_HEIGHT = $(document).height();
	$("body").css("margin", 0);
};

/* グローバル変数 */
var game = null;

/* 汎用処理 */
// ランダム値生成
var randfloat = function(min, max) {
	return Math.random()*(max-min)+min;
};

/* メイン処理 */
window.onload = function() {
	// ステージサイズの取得
	sizing();

	// ゲームオブジェクトの生成
	game = new Game(SCREEN_WIDTH, SCREEN_HEIGHT);
	// 画像の読み込み
	game.preload("./img/chara.png");

	// ゲーム開始時の処理
	game.onload = function() {
		var scene = game.rootScene;
		scene.backgroundColor = "black";

		// シーン更新時の処理
		scene.onenterframe = function() {
			if(game.frame % 500 === 0) {
				// ヒトを生成
				makeFish(this);
			}
		};
	};

	game.start();
};

function makeFish (scene) {
			var fish = new Fish();
			fish.x = randfloat(0, SCREEN_WIDTH - FISH_WIDTH)|0;
			fish.y = randfloat(0, SCREEN_HEIGHT - FISH_HEIGHT)|0;
			scene.addChild(fish);
}

/*魚を出現させる*/

    	var bg = new Sprite(320, 320);
		//bg.image = game.assets['bg.png'];
		
		$(window).click(function(e) {
			console.log('touch');
			makeFish(game.rootScene);
	        //var fish = new Fish();
			console.log(e);
	        /*fish.image = game.assets['./img/chara.png'];
	    	fish.x = e.localX;
	    	fish.y = e.localY;
	   	game.rootScene.addChild(fish);*/
	    });
	    //game.rootScene.addChild(bg);



/*
 * ラベルを生成する
 */
var createLabel = function(text, x, y, color) {
	// ラベル生成
	var label = new Label(text);
	label.font = "12px 'Consolas', 'Monaco', 'ＭＳ ゴシック'";
	label.moveTo(x, y);
	label.color = color;

	// 更新処理
	label.onenterframe = function() {
		this.opacity -= 0.05;
		if (this.opacity <= 0) {
			this.parentNode.removeChild(this);
		}
	};

	return label;
};

/*
 * ヒトクラス
 */
var Fish = Class.create(Sprite, {
	// 初期化処理
	initialize: function() {
		Sprite.call(this, FISH_WIDTH, FISH_HEIGHT);

		var game = Game.instance;
		this.image = game.assets["./img/chara.png"];
		this.vx = randfloat(-4, 4)|0;
		this.vy = randfloat(-4, 4)|0;
		// X軸の移動値に応じて向きを調整
		if(this.vx < 0) this.scaleX *= -1;
	},
	// 更新処理
	onenterframe: function() {
		this.x += this.vx;
		this.y += this.vy;

		// フレーム調整
		this.frame += 1;
		this.frame %= 4;

		// 画面外に出ないよう調整
		if(this.x < 0) {
			this.x = 0;
			this.vx *= -1;
			this.scaleX *= -1;
		} else if(this.x > SCREEN_WIDTH - FISH_WIDTH) {
			this.x = SCREEN_WIDTH - FISH_WIDTH;
			this.vx *= -1;
			this.scaleX *= -1;
		}

		if(this.y < 0) {
			this.y = 0;
			this.vy *= -1;
		} else if(this.y > SCREEN_HEIGHT - FISH_HEIGHT) {
			this.y = SCREEN_HEIGHT - FISH_HEIGHT;
			this.vy *= -1;
		}
	},
	// タッチ開始処理
	ontouchstart: function() {	
		var game = Game.instance;
		// ラベル生成
		var label = createLabel("wow!!", this.x, this.y, "white");
		game.rootScene.addChild(label);
		// 自身を削除
		this.parentNode.removeChild(this);
	}
});
