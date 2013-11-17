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

//背景

function bgdraw (img1,img2) {
	var canvas1 = document.getElementById('mycanvas1');
	    if (!canvas1 || !canvas1.getContext) return false;
    	var ctx1 = canvas1.getContext('2d');
	var canvas2 = document.getElementById('mycanvas2');
	    if (!canvas2 || !canvas2.getContext) return false;
    	var ctx2 = canvas2.getContext('2d');
    var canvas3 = document.getElementById('mycanvas3');
	    if (!canvas3 || !canvas3.getContext) return false;
    	var ctx3 = canvas3.getContext('2d');
    var canvas4 = document.getElementById('mycanvas4');
	    if (!canvas4 || !canvas4.getContext) return false;
    	var ctx4 = canvas4.getContext('2d');

    img1.onload = function() {
    	//キャンバスのサイズを画面に合わせる
    	$("#mycanvas1").attr({height:img1.height});
		$("#mycanvas1").attr({width:SCREEN_WIDTH});
        var pattern = ctx1.createPattern(img1, 'repeat-x');
        ctx1.fillStyle = pattern;
        //左から20上から20の位置に幅50高さ50の輪郭の四角形を作成する
        ctx1.fillRect(0, 0,SCREEN_WIDTH,img1.height);
    }

    img2.onload = function() {
    	//キャンバスのサイズを画面に合わせる
		$("#mycanvas2").attr({height:img2.height});
		$("#mycanvas2").attr({width:SCREEN_WIDTH});
    	var pattern = ctx2.createPattern(img2, 'repeat-x');
    	ctx2.fillStyle = pattern;
    	ctx2.fillRect(0,0,SCREEN_WIDTH,img2.height);

    	$("#mycanvas4").attr({height:(SCREEN_HEIGHT-img1.height-img2.height)/2});
		$("#mycanvas4").attr({width:SCREEN_WIDTH});
        ctx4.fillStyle = "#cdaa72";
    	//左から20上から20の位置に幅50高さ50の輪郭の四角形を作成する
    	ctx4.fillRect(0,0,SCREEN_WIDTH,mycanvas4.height);

    	$("#mycanvas3").attr({height:SCREEN_HEIGHT-img1.height-img2.height-mycanvas4.height});
		$("#mycanvas3").attr({width:SCREEN_WIDTH});
        ctx3.fillStyle = "#008acc";
    	//左から20上から20の位置に幅50高さ50の輪郭の四角形を作成する
    	ctx3.fillRect(0,0,SCREEN_WIDTH,mycanvas3.height);

    }


}


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
	game.preload("img/chara.png","img/bg/bgtop.gif","img/bg/bgunder.gif","img/bg/bg1.gif");

	//ゲーム開始時の処理
	game.onload = function(){


		var bgimg1 = new Image();
		var bgimg2 = new Image();


		titleScene = game.rootScene;

			//タイトルシーン
			var createtitleScene = function(){

				//背景
				bgimg1.src = 'img/bg/bgtop.gif';
				bgimg2.src = 'img/bg/bgunder.gif';
				bgdraw(bgimg1,bgimg2);

				var scene = new Scene();

				/*タイトルの設定*/
				var titleLabel = new Label("welcome LittLe aquarium");
				titleLabel.font = "8px 'Monaco'";
				titleLabel.moveTo((game.width - titleLabel._boundWidth)/2,(game.height - titleLabel._boundHeight)/2);
				titleLabel.color = "white";

				scene.addChild(titleLabel);

				// シーンにタッチイベントを設定
				scene.addEventListener(Event.TOUCH_START, function(e) { 		
            		//現在表示しているシーンをゲームシーンに置き換えます
            		game.replaceScene(mainScene());
				});
				return scene;
			};

			mainScene = function(){
				var scene = new Scene();
				bgimg1.src = 'img/bg/bgtop.gif';
				bgimg2.src = 'img/bg/bg1.gif';
				bgdraw(bgimg1,bgimg2);

            	makeFish(this);

				return scene;
			};

		game.replaceScene(createtitleScene());

	}
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
