// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getDatabase, ref, push, onValue} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJ76_QooazJfdeU63NajhW4ze_Gggx5lE",
    authDomain: "wakosai-possystem-3d4a2.firebaseapp.com",
    databaseURL: "https://wakosai-possystem-3d4a2-default-rtdb.firebaseio.com",
    projectId: "wakosai-possystem-3d4a2",
    storageBucket: "wakosai-possystem-3d4a2.firebasestorage.app",
    messagingSenderId: "289249107654",
    appId: "1:289249107654:web:000704fae40335c04ec1c7"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);



$(function(){

	let soltprice = 300;
	let consomeprice = 300;
	let norisoltprice = 300;
	let conpotaprice = 300;
	let bataseuyuprice = 300;
	let BBQprice = 300;
	
	//salesモーダル表示用関数
	$('.taste-button').on('click', function(){
		let taste = $(this).data('id');
		let name = $(this).data('name');
		sales(taste, name);
		console.log(taste);
	});

	function sales(taste, name){
		console.log('salesモーダルが呼び出されました')
		let dynamicRef = ref(database, `data/sales/${taste}`);
		let close = $('.modal-close');
		let salesinput = $('#sales-input');

		
		//モーダルウィンドうぉ即時表示
		$(function(){
			salesinput.addClass('active');
			return false;
		});

		//閉じるボタンをクリックしたらモーダルを閉じる
		close.on('click',function(){	
			salesinput.removeClass('active');
		});

		//モーダルの外側をクリックしたらモーダルを閉じる
		$(document).on('click',function(e) {
			if(!$(e.target).closest('.modal-body').length) {
				salesinput.removeClass('active');
			};
		});

		$('.modal-intext').text(name);
		
		$('.submit-check').on('click', function(){
			let submitmodal = $('#submit-modal');
			let Lsalescount = $('.Lsales-count').val();
			let Ssalescount = $('.Ssales-count').val();

			//モーダル切り替えのために即時モーダルを閉じる
			$(function(){
				salesinput.removeClass('active');
			});

			$(function(){
				submitmodal.addClass('active');
				return false;
			});

			$('.Lcount').text("Lサイズ" + Lsalescount + "個");
			$('.Scount').text("Sサイズ" + Ssalescount + "個");

			$('.cancel').on('click', function(){
				$('.Lsales-count').val('');
				$('.Ssales-count').val('');
				submitmodal.removeClass('active');
			});
		});

	
		//確定ボタンでDBに格納
		$('.submit').on('click', function(){
			let submitmodal = $('#submit-modal');
			let Lsalescount = $('.Lsales-count').val();
			let Ssalescount = $('.Ssales-count').val();

			if (Lsalescount.trim() !== "" || Ssalescount.trim() !== ""){
				if (Lsalescount.trim() == ""){
					Lsalescount = 0
				};

				if (Ssalescount.trim() == ""){
					Ssalescount = 0
				};

				push(dynamicRef,{
					Lcount: Lsalescount,
					Scount: Ssalescount,
					timestamp: Date.now()
				})
				.then(() => {
					// 送信が成功した時の処理
					console.log("DBへの格納に成功しました");
					
					// 送信後に textarea の中身を空っぽにするx
					$('.Lsales-count').val('');
					$('.Ssales-count').val('');

					
					// 送信後にモーダルを閉じる
					$(function(){
						let close = $('.modal-close');
						let successmodal = $('#success-modal');

						submitmodal.removeClass('active');

						//モーダルウィンドうぉ即時表示
						$(function(){
							successmodal.addClass('active');
							return false;
						});

						//閉じるボタンをクリックしたらモーダルを閉じる
						close.on('click',function(){	
							successmodal.removeClass('active');
						});

						//モーダルの外側をクリックしたらモーダルを閉じる
						$(document).on('click',function(e) {
							if(!$(e.target).closest('.modal-body').length) {
								successmodal.removeClass('active');
							};
						});
					});

				})
				.catch((error) => {
					// 万が一エラーが起きた場合
					console.error("DBへの格納に失敗しました:", error);
				});
			};
		});
	};


	//logモーダル表示用関数
	$('.log').on('click', function(){
		log();
	});

	function log(){
		console.log('logモーダルが呼び出されました')
		let close = $('.modal-close'),
		saleslog= $('#sales-logs');
		
		//モーダルウィンドうぉ即時表示
		$(function(){
			saleslog.addClass('active');
			return false;
		});

		//閉じるボタンをクリックしたらモーダルを閉じる
		close.on('click',function(){	
			saleslog.removeClass('active');
		});

		//モーダルの外側をクリックしたらモーダルを閉じる
		$(document).on('click',function(e) {
			if(!$(e.target).closest('.modal-body').length) {
				saleslog.removeClass('active');
			};
		});

		//初期宣言
		const saleRootRef = ref(database, 'data/sales');

		
		// onValueは、指定した場所（data/sale）のデータが更新されるたびに「毎回勝手に実行」されます
		onValue(saleRootRef, (snapshot) => {
			const allData = snapshot.val();
			
			// データベースが完全に空っぽの場合は処理をスキップ
			if (!allData) {
				console.log("売上データがありません。");
				return;
			}

			// Llog
			// 集計結果を格納する空のオブジェクト（箱）を作る
			const Ltotals = {};

			// 【ループ1】各 taste（商品名やIDなど）ごとに処理を回す
			Object.keys(allData).forEach((LtasteKey) => {
				const tasteGroup = allData[LtasteKey]; // 特定のtaste配下のデータ塊
				let Ltastetotal = 0;

				// 【ループ2】自動生成されたユニークキー（-NXv...）ごとに処理を回す
				Object.keys(tasteGroup).forEach((uniqueKey) => {
					const record = tasteGroup[uniqueKey];
					
					// 💡 文字列として入っている「Lcount」を、Number() で安全に数値（数字）に変換
					const LcountNum = Number(record.Lcount);

					// 有効な数字であれば、そのtasteの合計にプラスする
					if (!isNaN(LcountNum)) {
						Ltastetotal += LcountNum;
					}
				});

				// 集計した合計数を、tasteの名前をキーにして保存
				Ltotals[LtasteKey] = Ltastetotal;
			});

			// Slog
			// 集計結果を格納する空のオブジェクト（箱）を作る
			const Stotals = {};

			// 【ループ1】各 taste（商品名やIDなど）ごとに処理を回す
			Object.keys(allData).forEach((StasteKey) => {
				const tasteGroup = allData[StasteKey]; // 特定のtaste配下のデータ塊
				let Stastetotal = 0;

				// 【ループ2】自動生成されたユニークキー（-NXv...）ごとに処理を回す
				Object.keys(tasteGroup).forEach((uniqueKey) => {
					const record = tasteGroup[uniqueKey];
					
					// 💡 文字列として入っている「Scount」を、Number() で安全に数値（数字）に変換
					const ScountNum = Number(record.Scount);

					// 有効な数字であれば、そのtasteの合計にプラスする
					if (!isNaN(ScountNum)) {
						Stastetotal += ScountNum;
					}
				});

				// 集計した合計数を、tasteの名前をキーにして保存
				Stotals[StasteKey] = Stastetotal;
			});


			// 3. 画面（またはコンソール）に出力する
			LoutputTotalResults(Ltotals);
			SoutputTotalResults(Stotals);
			tasteTotalResults(Ltotals, Stotals);
		});

		// Ltotal反映用
		function LoutputTotalResults(Ltotals) {
			console.log("【最新集計結果】", Ltotals);
			let Lsum = 0;

			// 1. データベースにある「taste」ごとにループを回す
			Object.keys(Ltotals).forEach((tasteName) => {
				const LtotalCount = Ltotals[tasteName]; // その味の合計個数
				
				// 2. tasteNameと同じクラス（例: .chocolate や .vanilla）を持つ行を探す
				// その行の中にある「.count-value」という要素の文字を、最新の合計数に書き換える
				// 💡末尾に「 個」などのお好みの単位を付けられます
				$(`.${tasteName} .Lcount-value`).text(`${LtotalCount} 個`);
				Lsum += LtotalCount;
				console.log(LtotalCount);
				console.log(Lsum);
			});
			
			$(`.sum .Ltotal`).text(`${Lsum} 個`);
		};
		

		// Stotal反映用
		function SoutputTotalResults(Stotals) {
			console.log("【最新集計結果】", Stotals);
			let Ssum = 0;

			// 1. データベースにある「taste」ごとにループを回す
			Object.keys(Stotals).forEach((tasteName) => {
				const StotalCount = Stotals[tasteName]; // その味の合計個数

				// 2. tasteNameと同じクラス（例: .chocolate や .vanilla）を持つ行を探す
				// その行の中にある「.count-value」という要素の文字を、最新の合計数に書き換える
				// 💡末尾に「 個」などのお好みの単位を付けられます
				$(`.${tasteName} .Scount-value`).text(`${StotalCount} 個`);
				Ssum = Ssum + StotalCount;
			});
			$(`.sum .Stotal`).text(`${Ssum} 個`);
		};

		function tasteTotalResults(Ltotals, Stotals){
			let tastesum = 0;
			let allsum = 0;

			Object.keys(Ltotals).forEach((tasteName) => {
				const LtotalCount = Ltotals[tasteName];
				const StotalCount = Stotals[tasteName];


				// ここを変数化しないといけない
				// 変数化したV
				switch (tasteName){
					case "solt":
						tastesum = LtotalCount * soltprice + StotalCount * soltprice;
						$(`.${tasteName} .total`).text(`${tastesum} 円`);
						allsum = allsum + tastesum;
						break;
					case "consome":
						tastesum = LtotalCount * consomeprice + StotalCount * consomeprice;
						$(`.${tasteName} .total`).text(`${tastesum} 円`);
						allsum = allsum + tastesum;
						break;
					case "norisolt":
						tastesum = LtotalCount * norisoltprice + StotalCount * norisoltprice;
						$(`.${tasteName} .total`).text(`${tastesum} 円`);
						allsum = allsum + tastesum;
						break;
					case "conpota":
						tastesum = LtotalCount * conpotaprice + StotalCount * conpotaprice;
						$(`.${tasteName} .total`).text(`${tastesum} 円`);
						allsum = allsum + tastesum;
						break;
					case "bataseuyu":
						tastesum = LtotalCount * bataseuyuprice + StotalCount * bataseuyuprice;
						$(`.${tasteName} .total`).text(`${tastesum} 円`);
						allsum = allsum + tastesum;
						break;
					case "BBQ":
						tastesum = LtotalCount * BBQprice + StotalCount * BBQprice;
						$(`.${tasteName} .total`).text(`${tastesum} 円`);
						allsum = allsum + tastesum;
						break;
				}
			});

			$(`.sum .allrangetotal`).text(`${allsum} 円`);

		};
		
		
	};

	$('.change').on('click', function(){
		change()
	});

	function change(){

		let close = $('.modal-close'),
		changeprice= $('#changeprice');
		

		//モーダルウィンドうぉ即時表示
		$(function(){
			changeprice.addClass('active');
			return false;
		});

		//閉じるボタンをクリックしたらモーダルを閉じる
		close.on('click',function(){	
			changeprice.removeClass('active');
		});

		//モーダルの外側をクリックしたらモーダルを閉じる
		$(document).on('click',function(e) {
			if(!$(e.target).closest('.modal-body').length) {
				changeprice.removeClass('active');
			};
		});

		$('.change-check').on('click', function(){
			let changecheckmodal = $('#change-check-modal');
			
			
			let Csolt = $('#Csolt');
			let Cconsome = $('#Cconsome');
			let Cnorisolt = $('#Cnorisolt');
			let Cconpota = $('#Cconpota');
			let Cbataseuyu = $('#Cbataseuyu');
			let CBBQ = $('#CBBQ');
			
			//モーダル切り替えのために即時モーダルを閉じる
			$(function(){
				changeprice.removeClass('active');
			});

			$(function(){
				changecheckmodal.addClass('active');
				return false;
			});

			$('.changesoltvalue').text("塩味" + Csolt + "円");
			$('.changeconsomevalue').text("コンソメ味" + Cconsome + "円")


		});
	};

	
    
});