// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getDatabase, ref, push, onValue, set, get, query, orderByKey, limitToLast} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";
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
	const firsttimestamp = Date.now();
	set(ref(database, `data/price/solt/${firsttimestamp}`),{
		price: 300
	});
	set(ref(database, `data/price/consome/${firsttimestamp}`),{
		price: 300
	});
	set(ref(database, `data/price/norisolt/${firsttimestamp}`),{
		price: 300
	});
	set(ref(database, `data/price/conpota/${firsttimestamp}`),{
		price: 300
	});
	set(ref(database, `data/price/bataseuyu/${firsttimestamp}`),{
		price: 300
	});
	set(ref(database, `data/price/BBQ/${firsttimestamp}`),{
		price: 300
	});

	
	//salesモーダル表示用関数
	$('.salestaste').on('click', function(){
		let taste = $(this).data('id');
		let name = $(this).data('name');
		sales(taste, name);
		console.log(taste);
	});

	function sales(taste, name){
		console.log('salesモーダルが呼び出されました')
		let dynamicRef = ref(database, `data/sales/${taste}`);
		let salescheck = $('#salescheck');
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
		
		// 購入確定前チェック
		$('.salescheck').on('click', function(){
			let salescount = $('.salescount').val();

			//モーダル切り替えのために即時モーダルを閉じる
			$(function(){
				salesinput.removeClass('active');
			});

			$(function(){
				salescheck.addClass('active');
				return false;
			});

			$('.countcheck').text("販売個数：" + salescount + "個");
			$('.cancel').on('click', function(){
				$('.salescount').val('');

				salescheck.removeClass('active');
			});
		});
			

	
		// 確定ボタンでDBに格納
		// 絶賛エラー中ｗ
		// priceのスコープがうまくいってないのか未定義状態で格納しようとしている
		$('.salessubmit').on('click', function(){
			let submitmodal = $('#salessubmit');
			let salescount = $('.salescount').val();
			let priceref = ref(database, `data/price/${taste}`);
			console.log(price);
			
			const latestQuery = query(priceref, orderByKey(), limitToLast(1));
			
			$(function(){
				salescheck.removeClass('active')
			});
				
			console.log (price)
			if (salescount.trim() !== "" ){
				get(latestQuery).then((snapshot) => {
					const data = snapshot.val();
					const latestTimestamp = Object.keys(data)[0];
					const latestRecord = data[latestTimestamp];
					const price =  latestRecord.price;
				});
				console.log(price)	
				push(dynamicRef,{
					count: salescount,
					price: price,
					timestamp: Date.now()
				})
				
				.then(() => {
					// 送信が成功した時の処理
					console.log("DBへの格納に成功しました");
					
					// 送信後に textarea の中身を空っぽにするx
					$('.salescount').val('');
					
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

			// log　値段変更の可能性が出てきたため作り直し必須
			// 集計結果を格納する空のオブジェクト（箱）を作る
			const totals = {};

			// 【ループ1】各 taste（商品名やIDなど）ごとに処理を回す
			Object.keys(allData).forEach((tasteKey) => {
				const tasteGroup = allData[tasteKey]; // 特定のtaste配下のデータ塊
				let tastetotal = 0;

				// 【ループ2】自動生成されたユニークキー（-NXv...）ごとに処理を回す
				Object.keys(tasteGroup).forEach((uniqueKey) => {
					const record = tasteGroup[uniqueKey];
					
					// 💡 文字列として入っている「Lcount」を、Number() で安全に数値（数字）に変換
					const countNum = Number(record.Lcount);

					// 有効な数字であれば、そのtasteの合計にプラスする
					if (!isNaN(countNum)) {
						tastetotal += countNum;
					}
				});

				// 集計した合計数を、tasteの名前をキーにして保存
				totals[tasteKey] = tastetotal;
			});


			// 3. 画面（またはコンソール）に出力する
			outputTotalResults(totals);
			tasteTotalResults(totals);
		});

		// Ltotal反映用
		function outputTotalResults(totals) {
			console.log("【最新集計結果】", totals);
			let Lsum = 0;

			// 1. データベースにある「taste」ごとにループを回す
			Object.keys(totals).forEach((tasteName) => {
				const LtotalCount = totals[tasteName]; // その味の合計個数
				
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
		
		function tasteTotalResults(totals){
			let tastesum = 0;
			let allsum = 0;

			Object.keys(totals).forEach((tasteName) => {
				const totalCount = totals[tasteName];


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


	// 価格切り替え用
	$('.change').on('click', function(){
			change()
	});

	//　値段を変える味を決めるためのモーダルウィンドウ
	function change(){
		console.log("changeselectモーダルの表示")

		let close = $('.modal-close');
		let changeselect = $('#changeselect');
		let changeprice = $('#changeprice');
		let changecheck = $('#changecheck');
		
		//モーダルウィンドうぉ即時表示
		$(function(){
			changeselect.addClass('active');
			return false;
		});

		//閉じるボタンをクリックしたらモーダルを閉じる
		close.on('click',function(){	
			changeselect.removeClass('active');
		});

		//モーダルの外側をクリックしたらモーダルを閉じる
		$(document).on('click',function(e) {
			if(!$(e.target).closest('.modal-body').length) {
				changeselect.removeClass('active');
			};
		});

		//　変更金額を決めるためのモーダルウィンドウ
		$('.changetaste').on('click', function(){
			console.log("changepriceモーダルの表示")

			let taste = $(this).data('id');
			let name = $(this).data('name');
			
			$(function(){
				changeselect.removeClass('active');
			});

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

			$('.modal-intext').text(name);

			$('.change-check').on('click', function(){
			let changepricevalue = $('.changepricevalue');
			
			//モーダル切り替えのために即時モーダルを閉じる
			$(function(){
				changeprice.removeClass('active');
			});

			$(function(){
				changecheck.addClass('active');
				return false;
			});

			$('.countcheck').text("変更価格：" + changepricevalue.val() + "円");
				$('.cancel').on('click', function(){
					$('.salescount').val('');
					submitmodal.removeClass('active');
				});
			});

			$('changepricesubmit').on('click', function(){
				let priceRef = ref(database, `data/sales/${taste}/${timestamp}`);
				let timestamp = Date.now();


				set(priceRef,{
					price : changepricevalue
				});

				$(function(){
					changecheck.removeClass('active');
				});

				$(function(){
					change.addClass('active');
					return false;
				});
				
			});
		});
	};
});