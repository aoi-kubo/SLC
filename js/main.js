// 追加完了で一覧ページへの切り替え、追加コメント表示
$(document).ready(function() {
  $("#show-link").click(function(event) {
    sessionStorage.setItem("showComment", "true");
    window.location.href = "index.html";
  });

  if (sessionStorage.getItem("showComment") === "true") {
    $("#comment-new").show();
    setTimeout(function() {
      $("#comment-new").fadeOut("slow", function() {
        sessionStorage.removeItem("showComment");
      });
    }, 2000);
  }
});


// アイテム一覧への追加
$(document).ready(function () {
  // 保存データをロードして表示
  function loadSavedItems() {
    let savedItems = JSON.parse(localStorage.getItem("items")) || [];

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
  $(".modal-comp").on("click", function () {
    if (!($('.modal-overlay.modal-item').css('display') === 'block')) {
        console.log('aaa')
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
      let savedItems = JSON.parse(localStorage.getItem("items")) || [];
      savedItems.push(newItem);
      console.log(newItem)
      localStorage.setItem("items", JSON.stringify(savedItems));
  
      // 画面に追加
      loadSavedItems();
    }
  });

  // ページ読み込み時に保存データを表示
  loadSavedItems();
});

// 買い物リストへの追加
$(document).ready(function () {
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

});

// モーダルの表示・更新
$(document).ready(function () {
  const $body = $("body");
  const $modal = $("#modal");
  const $modalOpenButton = $(".js-modal-open");
  const $modalCloseButton = $(".js-modal-close");
  const $modalCompButton = $(".modal-comp");

  // ローカルストレージからアイテムデータを取得する関数
  const getItemsFromStorage = () => {
    return JSON.parse(localStorage.getItem("items")) || [];
  };

  // モーダルを開く関数（アイテム情報をセットする）
  const openModal = function () {
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
    $modalCompButton.on("click", function () {
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
});


// 使い切りの挙動
$(document).ready(function () {
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

    let savedItems = JSON.parse(localStorage.getItem("items")) || [];
    
    // アイテムIDに一致する要素を探して削除
    let itemIndex = savedItems.findIndex(item => item.id === itemdelId);

    if (itemIndex !== -1) {
      let deletedItem = savedItems.splice(itemIndex, 1)[0]; // 削除するアイテムを取得

      // LocalStorage の items から削除し、buy に保存
      let boughtItems = JSON.parse(localStorage.getItem("buy")) || [];
      boughtItems.push(deletedItem); // buy 配列に追加
      localStorage.setItem("buy", JSON.stringify(boughtItems)); // buy を更新

      // items を更新して保存
      localStorage.setItem("items", JSON.stringify(savedItems));

      // 画面から削除
      $(this).closest(".item-wrapper").remove();

      // 削除完了メッセージ表示
      $("#comment-done").show();
      setTimeout(function () {
        $("#comment-done").fadeOut("slow");
      }, 2000);

      // 再ロードしてインデックスを更新
      loadSavedItems();
    } else {
      console.error("アイテムが見つかりませんでした。削除処理を中止します。");
    }
  });
});

