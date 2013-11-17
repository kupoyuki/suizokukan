enchant();

/*定数*/

//パラメータ

var SCREEN_WIDTH;
var SCREEN_HEIGHT;



/*グローバル変数*/
var game = null;


//魚　後々種類変更できるようにする
var fish;
var FISH_WIDTH = 34;
var FISH_HEIGHT = 34;

//ステージ
function sizing(){
	SCREEN_WIDTH = $(document).width();
	SCREEN_HEIGHT = $(document).height();
	$("body").css("margin",0);
}

/*汎用処理*/

//ランダム値生成
var randfloat = function(min,max){
	return Math.random()*(max-min)+min;
}

/*メイン処理*/
window.onload = function() {

	//ステージサイズの取得
	sizing();

	//ゲームオブジェクトの生成
	game = new Game(SCREEN_WIDTH,SCREEN_HEIGHT);
	game.fps = 5;

	//画像の読み込み
	game.preload("img/chara.png");

	//ゲーム開始時の処理
	game.onload = function(){
		
		var createMainScene = function(){
				var mainScene = new Scene();
            	//makeFish(this);
				return mainScene;
			};
		
		//titleScene = game.rootScene;
			//タイトルシーン
			var createTitleScene = function(){
				var titleScene = new Scene();

				/*タイトルの設定*/
				var titleLabel = new Label("welcome LittLe aquarium");
				titleLabel.font = "8px 'Monaco'";
				titleLabel.moveTo((game.width - titleLabel._boundWidth)/2,(game.height - titleLabel._boundHeight)/2);
				titleLabel.color = "white";
				titleScene.addChild(titleLabel);

				// シーンにタッチイベントを設定
				titleScene.addEventListener(Event.TOUCH_START, function(e) { 		
            		//現在表示しているシーンをゲームシーンに置き換えます
            		//game.replaceScene(mainScene());
					game.pushScene(createMainScene());
				});
				return titleScene;
			};			
		game.pushScene(createTitleScene());
	};
	game.start();
};



/*魚を出現させる*/
function makeFish (scene) {
	fish = new Fish();
	fish.image = game.assets['./img/chara.png'];
		//fish.x = randfloat(0, SCREEN_WIDTH - FISH_WIDTH)|0;
		//fish.y = randfloat(0, SCREEN_HEIGHT - FISH_HEIGHT)|0;
	$(window).click(function(e) {
		console.log('touch');
		//makeFish(scene);
		console.log(e);

	    fish.x = e.localX;
	    fish.y = e.localY;

	scene.addChild(fish);
	});
};


/* ラベルを生成する */
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

/* 魚クラス */
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
