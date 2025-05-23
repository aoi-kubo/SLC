$(function() {
  // 追加完了で一覧ページへの切り替え
  $("#show-link").click(function(event) {
    sessionStorage.setItem("showComment", "true");
    window.location.href = "index.html";
  });
  
  // コメント表示
  if (sessionStorage.getItem("showComment") === "true") {
    $("#comment-new").show().delay(2000).fadeOut("slow");
    sessionStorage.removeItem("showComment"); // すぐに削除する
  }

  // ローカルストレージからデータを取得する共通関数
  const getLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key)) || [];
  };

  // ローカルストレージにデータを保存する共通関数
  const setLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // アイテム一覧への追加
  // 保存データをロードして表示
  function loadSavedItems() {
    let savedItems = getLocalStorage("items");

    $(".container").empty(); // 一度リセット

    let today = new Date(); // 現在の日付を取得（時刻をクリア）
    today.setHours(0, 0, 0, 0);

    savedItems.forEach((item) => {
      let itemLimitDate = new Date(item.limit); // アイテムの期限を日付オブジェクトに変換
      itemLimitDate.setHours(0, 0, 0, 0); // 時刻をクリアして比較

      let isDeadline = itemLimitDate < today; // 期限切れか判定

      let newItem = `
        <div class="item-wrapper">
          <div class="item-contents js-modal-open ${isDeadline ? "deadline" : ""}" data-id="${item.id}">
            <div class="label ${item.priorityClass}">${item.priority}</div>
            <div class="item-detail">
              <h2 class="item-name">${item.name} ${item.capacity}</h2>
              <div>
                <p class="item-limit"><span>期限：</span>${item.limit}</p>
                <p class="item-day"><span>購入日：</span>${item.purchaseDate}</p>
              </div>
            </div>
          </div>
          <div class="delete-btn">使い切り</div>
        </div>
      `;
      $(".item-list ").append(newItem);
    });
  }

  // --- 「完了」ボタンが押された時
  $(document).on("click", ".modal-comp", function() {
    if (!($('.modal-overlay.modal-item').css('display') === 'block')) {
      let itemName = $(".new-item-name").val();
      let itemLimit = $(".new-item-limit").val();
      let itemPrice = $(".new-item-price").val();
      let itemCapacity = $(".new-item-capacity").val();
      let itemPurchaseDate = $(".new-item-buy").val();
      let itemReminderNum = $(".icon-reminder select.reminder-num").val();
      let itemReminderText = $(".icon-reminder select.reminder-text").val();
      let itemPriority = $(".icon-priority select").val();
  
      if (itemName === "" || itemLimit === "") {
        alert("商品名と賞味期限を入力してください！");
        return;
      }
  
      let priorityClass = "";
      if (itemPriority === "高") {
          priorityClass = "Blu01";
      } else if (itemPriority === "中") {
          priorityClass = "Ore01";
      } else if (itemPriority === "低") {
          priorityClass = "Red01";
      }
  
      let newItem = {
        id: Date.now(),
        name: itemName,
        limit: itemLimit,
        price: itemPrice,
        capacity: itemCapacity,
        purchaseDate: itemPurchaseDate,
        reminderNum: itemReminderNum,
        reminderText: itemReminderText,
        priority: itemPriority,
        priorityClass: priorityClass // クラス情報も保存
      };
  
      // LocalStorageに保存
      let savedItems = getLocalStorage("items");
      savedItems.push(newItem);
      console.log(newItem)
      setLocalStorage("items", savedItems);;
  
      // 画面に追加
      $(".item-list").empty();
      loadSavedItems();
    }
  });

  // 利用頻度（優先度）を数値に変換
  function priorityToNumber(priority) {
    switch (priority) {
      case "高": return 3;
      case "中": return 2;
      case "低": return 1;
      default: return 0;
    }
  }

  // 並び替え処理
  $("select[title='ソート']").on("change", function () {
    let selected = $(this).find("option:selected").val();
    let sortItems = JSON.parse(localStorage.getItem("items")) || [];

    switch (selected) {
      case "購入日が古い順":
        // console.log(new Date(a.purchaseDate))
        sortItems.sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate));
        break;
      case "購入日が新しい順":
        sortItems.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
        break;
      case "期限が近い順":
        sortItems.sort((a, b) => new Date(a.limit) - new Date(b.limit));
        break;
      case "利用頻度が高い順":
        sortItems.sort((a, b) => priorityToNumber(b.priority) - priorityToNumber(a.priority));
        break;
      case "利用頻度が低い順":
        sortItems.sort((a, b) => priorityToNumber(a.priority) - priorityToNumber(b.priority));
        break;
      default:
        break;
    }

    // ソート後に再描画
    $(".item-list").empty();
    sortItems.forEach(item => {
      let itemLimitDate = new Date(item.limit);
      itemLimitDate.setHours(0, 0, 0, 0);
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      let isDeadline = itemLimitDate < today;

      let newItem = `
        <div class="item-wrapper">
          <div class="item-contents js-modal-open ${isDeadline ? "deadline" : ""}" data-id="${item.id}">
            <div class="label ${item.priorityClass}">${item.priority}</div>
            <div class="item-detail">
              <h2 class="item-name">${item.name} ${item.capacity}</h2>
              <div>
                <p class="item-limit"><span>期限：</span>${item.limit}</p>
                <p class="item-day"><span>購入日：</span>${item.purchaseDate}</p>
              </div>
            </div>
          </div>
          <div class="delete-btn">使い切り</div>
        </div>
      `;
      $(".item-list").append(newItem);
    });
  });

  // ページ読み込み時に保存データを表示
  $(".item-list").empty();
  loadSavedItems();

// 買い物リストへの追加
  // buy のデータをリスト表示
  function loadbuyItems() {
    let buyItems = JSON.parse(localStorage.getItem("buy")) || [];

    $(".shopping-list.none ul").empty(); // 既存のリストをクリア
    buyItems.forEach(item => {
      let listItem = `
        <li class="item-contents">
          <input class="item-checkbox" type="checkbox" name="checkbox" id="checkbox${item.id}">
          <label for="checkbox${item.id}" class="item-detail">
            <h2 class="item-name">${item.name}</h2>
            <div>
              <p class="item-limit"><span>前回購入日：</span>${item.purchaseDate}</p>
              <p class="item-name"><span>購入金額：</span>${item.price}</p>
            </div>
          </label>
        </li>
      `;
      $(".shopping-list.none ul").append(listItem);
    });
  }

  // ページ読み込み時にアイテムを表示
  loadbuyItems();

  // `bought` のデータを取得し、リストに追加
  function loadBoughtItems() {
    let boughtItems = JSON.parse(localStorage.getItem("bought")) || [];
    $(".shopping-list.done ul").empty(); // リストをクリアして再描画

    boughtItems.forEach(item => {
      let listItem = `
        <li class="item-contents">
          <input class="item-checkbox" type="checkbox" name="checkbox" id="checkbox${item.id}" checked>
          <label for="checkbox${item.id}" class="item-detail">
            <h2 class="item-name">${item.name}</h2>
            <div>
              <p class="item-limit"><span>前回購入日：</span>${item.limit}</p>
              <p class="item-name"><span>購入金額：</span>${item.price}</p>
            </div>
          </label>
        </li>
      `;
      $(".shopping-list.done ul").append(listItem);
    });
  }

  // ページ読み込み時に `bought` のデータを表示
  loadBoughtItems();

  // チェックボックスの変更イベントを監視
  $(".item-contents").on("change", ".item-checkbox", function () {
    let itemId = $(this).attr("id").replace("checkbox", ""); // id から item.id を取得
    let buyItems = JSON.parse(localStorage.getItem("buy")) || [];
    let boughtItems = JSON.parse(localStorage.getItem("bought")) || [];

    // 対象アイテムを `buy` から探す
    let itemIndex = buyItems.findIndex(item => item.id == itemId);
    if (itemIndex !== -1) {
      let movedItem = buyItems.splice(itemIndex, 1)[0]; // `buy` から削除
      boughtItems.push(movedItem); // `bought` に追加

      // LocalStorage を更新
      localStorage.setItem("buy", JSON.stringify(buyItems));
      localStorage.setItem("bought", JSON.stringify(boughtItems));

      // HTML から削除
      $(this).closest(".item-contents").remove();
      loadBoughtItems();

      // 削除完了メッセージ表示
      $("#comment-buy").show();
      setTimeout(function () {
        $("#comment-buy").fadeOut("slow");
      }, 2000);
    }
  });

// モーダルの表示・更新
  const $body = $("body");
  const $modal = $("#modal");
  const $modalOpenButton = $(".js-modal-open");
  const $modalCloseButton = $(".js-modal-close");
  const $modalCompButton = $(".modal-comp");

  // ローカルストレージからアイテムデータを取得する関数
  const getItemsFromStorage = () => {
    return getLocalStorage("items");
  };

  // モーダルを開く関数（アイテム情報をセットする）
  const openModal = function () {
    // console.log('aaa')
    let itemId = $(this).closest(".item-contents").data("id"); // クリックした要素のdata-idを取得
    let items = getItemsFromStorage();

    // 対象のitemを検索
    let item = items.find(i => i.id === itemId);

    if (item) {
      // モーダルの input にデータをセット
      $(".modal-item-name").val(item.name);
      $(".modal-item-limit").val(item.limit);
      $(".modal-item-capacity").val(item.capacity);
      $(".modal-item-price").val(item.price);
      $(".modal-item-buy").val(item.purchaseDate);
      $(".modal-reminder-num").val(item.reminderNum);
      $(".modal-reminder-text").val(item.reminderText);
      $(".modal-03").val(item.priority); // 優先度のセレクトボックスにセット

      // モーダルを表示
      $modal.fadeIn();
      $body.css("overflow", "hidden");
    }

    // モーダル内の完了ボタンを押したときの処理
    $modalCompButton.on("click", function() {
      console.log(itemId)
      let items = getItemsFromStorage();
      console.log(items)
      
      let itemIndex = items.findIndex(i => i.id === itemId);
      console.log(itemIndex)
      if (itemIndex !== -1) {
        // 更新するデータを取得
        items[itemIndex].name = $(".modal-item-name").val();
        items[itemIndex].limit = $(".modal-item-limit").val();
        items[itemIndex].capacity = $(".modal-item-capacity").val();
        items[itemIndex].price = $(".modal-item-price").val();
        items[itemIndex].purchaseDate = $(".modal-item-buy").val();
        items[itemIndex].reminderNum = $(".modal-reminder-num").val();
        items[itemIndex].reminderText = $(".modal-reminder-text").val();
        items[itemIndex].priority = $(".modal-03").val();

        let priorityClass = "";
        if (items[itemIndex].priority === "高") {
            priorityClass = "Blu01";
        } else if (items[itemIndex].priority === "中") {
            priorityClass = "Ore01";
        } else if (items[itemIndex].priority === "低") {
            priorityClass = "Red01";
        }
        items[itemIndex].priorityClass = priorityClass;

        // LocalStorage を更新
        localStorage.setItem("items", JSON.stringify(items));

        // 画面を再読み込みしてリストを更新
        location.reload();
      } else {
        console.error("アイテムが見つかりませんでした。");
      }

      closeModal(); // モーダルを閉じる

    });
  };

  // モーダルを閉じる関数
  const closeModal = function () {
    $modal.fadeOut();
    $body.css("overflow", "auto");
  };

  // モーダル外クリックで閉じる
  const onClickOutside = function (event) {
    if ($modal.is(event.target)) closeModal();
  };

  // イベントリスナーをセット
  $modalOpenButton.on("click", openModal);
  $modalCloseButton.on("click", closeModal);
  $modal.on("click", onClickOutside);


  // 使い切りの挙動
  let startX = 0;
  let currentX = 0;
  let isSwiping = false;

  // スワイプで削除ボタン表示
  $(".item-list").on("touchstart", ".item-wrapper", function (e) {
    startX = e.originalEvent.touches[0].clientX;
    isSwiping = false;
  });

  $(".item-list").on("touchmove", ".item-wrapper", function (e) {
    currentX = e.originalEvent.touches[0].clientX;
    let diffX = startX - currentX;

    if (diffX > 20) { // 左スワイプで削除ボタン表示
      isSwiping = true;
      $(".item-wrapper").removeClass("show-delete"); // 他のアイテムの削除ボタンを閉じる
      $(".item-contents").removeClass("show-delete");
      $(this).addClass("show-delete");
      $(this).find(".item-contents").addClass("show-delete");
    } else if (diffX < -20) { // 右スワイプで削除ボタンを閉じる
      isSwiping = true;
      $(this).removeClass("show-delete");
      $(this).find(".item-contents").removeClass("show-delete");
    }
  });

  $(".item-list").on("touchend", ".item-wrapper", function () {
    if (!isSwiping) {
      $(this).removeClass("show-delete");
    }
  });

  // 削除の挙動
  $(".item-list").on("click", ".delete-btn", function (e) {
  // e.stopPropagation();
  
    let itemdelId = $(".item-contents.show-delete").data("id");

    let deleteItems = getLocalStorage("items");
    
    // アイテムIDに一致する要素を探して削除
    let itemIndex = deleteItems.findIndex(item => item.id === itemdelId);

    if (itemIndex !== -1) {
      let deletedItem = deleteItems.splice(itemIndex, 1)[0]; // 削除するアイテムを取得

      // LocalStorage の items から削除し、buy に保存
      let boughtItems = JSON.parse(localStorage.getItem("buy")) || [];
      boughtItems.push(deletedItem); // buy 配列に追加
      localStorage.setItem("buy", JSON.stringify(boughtItems)); // buy を更新

      // items を更新して保存
      setLocalStorage("items", deleteItems);;

      // 画面から削除
      $(this).closest(".item-wrapper").remove();

      // 削除完了メッセージ表示
      $("#comment-done").show();
      setTimeout(function () {
        $("#comment-done").fadeOut("slow");
      }, 2000);

      // 再ロードしてインデックスを更新
      $(".item-list").empty();
      loadSavedItems();
    } else {
      console.error("アイテムが見つかりませんでした。削除処理を中止します。");
    }
  });

});