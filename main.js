enchant();
/*定数*/

//パラメータ
var SCREEN_WIDTH;
var SCREEN_HEIGHT;

/*グローバル変数*/
var game = null;

//魚　後々種類変更できるようにする
var FISH_WIDTH = 50;
var FISH_HEIGHT = 50;

/*汎用処理*/

//ランダム値生成
var randfloat = function(min,max){
	return Math.random()*(max-min)+min;
};

/*メイン処理*/
window.onload = function() {

	//ステージサイズの取得
	SCREEN_WIDTH = $(document).width();
	SCREEN_HEIGHT = $(document).height();

	//ゲームオブジェクトの生成
	game = new Game(SCREEN_WIDTH,SCREEN_HEIGHT);
	game.fps = 5;

	//画像の読み込み	
	for (i=0;i<fish_catalog.length;i++) {
		for (j=0;j<fish_catalog[i].length;j++) {
			game.preload(fish_catalog[i][j]['file']);
		}
	}

	//ゲーム開始時の処理
	game.onload = function(){
		var createMainScene = function(){
				var mainScene = new Scene();
				mainScene.addEventListener(Event.TOUCH_START, function(e) {
					pos = $("#space_4").position().top;
					fishType = -1;
					if (e.localY < pos) {
						//上の魚
						fishType = (Math.round(randfloat(0,100)) <= 10) ? 1 : 0;
						t_top = 0;
						t_bottom = 	pos;			
					} else {
						//下の魚
						fishType = 2;
						t_top = pos;
						t_bottom = 	SCREEN_HEIGHT;
					}
					//Random select Fish
					SelectedFish = Math.round(randfloat(0,(fish_catalog[fishType].length-1)));
            		//Create fish
            		makeFish(
            			this,
            			fish_catalog[fishType][SelectedFish]['name'],
            			e.localX,
            			e.localY,
            			fish_catalog[fishType][SelectedFish]['file'],
            			fish_catalog[fishType][SelectedFish]['width'],
            			fish_catalog[fishType][SelectedFish]['height'],
            			t_top,
            			t_bottom
            		);
				});
				return mainScene;
			};
		
		//titleScene = game.rootScene;
			//タイトルシーン
			var createTitleScene = function(){
				var titleScene = new Scene();

				/*タイトルの設定*/
				var titleLabel = new Label("welcome little aquarium");
				titleLabel.font = "18px 'Monaco'";
				titleLabel.moveTo((game.width - titleLabel._boundWidth)/2,(game.height - titleLabel._boundHeight)/2);
				titleLabel.color = "white";
				titleScene.addChild(titleLabel);
				
				// シーンにタッチイベントを設定
				titleScene.addEventListener(Event.TOUCH_START, function(e) { 		
            		//現在表示しているシーンをゲームシーンに置き換えます
					game.replaceScene(createMainScene());
				});
				return titleScene;
			};			
		game.pushScene(createTitleScene());
	};
	game.start();
};



/*魚を出現させる*/
function makeFish (scene,name,t_x,t_y,imageFile,w,h,t,b) {
	fish = new Fish(w,h,t,b);
	fish.image = game.assets[imageFile];
	fish.x = t_x-(w/2);
	fish.y = t_y-(h/2);
	fish.name = name;
	scene.addChild(fish);
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
	initialize: function(w,h,top,bottom) {
		
		if (w != undefined && h != undefined && top != undefined && bottom != undefined) {
			Sprite.call(this, w, h);
			this.width = w;
			this.height = h;
			this.top = top;
			this.bottom = bottom;
		} else {
			Sprite.call(this, FISH_WIDTH, FISH_HEIGHT);
			this.width = FISH_WIDTH;
			this.height = FISH_HEIGHT;
			this.top = 0;
			this.bottom = SCREEN_HEIGHT;
			console.log(this.bottom);
		}
		
		var game = Game.instance;
		var speed = 5;
		this.image = game.assets["./img/fish_anime/fish1.png"];
		this.name = "untitled fish";
		this.vx = randfloat(-speed, speed)|0;
		this.vy = randfloat(-speed, speed)|0;

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
		} else if(this.x > SCREEN_WIDTH - this.width) {
			this.x = SCREEN_WIDTH - this.width;
			this.vx *= -1;
			this.scaleX *= -1;
		}

		if(this.y < this.top) {
			this.y = this.top;
			this.vy *= -1;
		} else if(this.y > this.bottom - this.height) {
			this.y = this.bottom - this.height;
			this.vy *= -1;
		}
	},
	// タッチ開始処理
	ontouchstart: function() {	
		var game = Game.instance;
		// ラベル生成
		var label = createLabel(this.name, this.x, this.y+(this.height/2), "white");
		game.currentScene.addChild(label);
		// 自身を削除
		this.parentNode.removeChild(this);
	}
});
