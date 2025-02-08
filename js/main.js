$(document).ready(function() {				
  const $body = $('body');				
  const $modal = $('#modal');				
  const $modalOpenButton = $('.js-modal-open');				
  const $modalCloseButton = $('.js-modal-close');				
          
  const openModal = () => {				
    $modal.fadeIn();				
    $body.css('overflow', 'hidden');
  };
          
  const closeModal = () => {				
    $modal.fadeOut();				
    $body.css('overflow', 'auto');				
  };
          
  const onClickOutside = (event) => {				
    if ($modal.is(event.target)) closeModal();
  }	
          
  $modalOpenButton.on('click', openModal);				
  $modalCloseButton.on('click', closeModal);				
  $modal.on('click', onClickOutside);
});	

$(document).ready(function () {
  let startX = 0;
  let currentX = 0;
  let isSwiping = false;

  $(".item-contents").on("touchstart", function (e) {
      startX = e.originalEvent.touches[0].clientX;
      isSwiping = false;
  });

  $(".item-contents").on("touchmove", function (e) {
      currentX = e.originalEvent.touches[0].clientX;
      let diffX = startX - currentX;

      if (diffX > 20) { // 左スワイプ
          isSwiping = true;
          $(".item-contents").removeClass("show-delete"); // 他のアイテムを閉じる
          $(this).addClass("show-delete");
      } else if (diffX < -20) { // 右スワイプで戻す
          isSwiping = true;
          $(this).removeClass("show-delete");
      }
  });

  $(".item-contents").on("touchend", function () {
      if (!isSwiping) {
          $(this).removeClass("show-delete");
      }
  });

  // 削除ボタンのクリックでアイテムを削除
  $(".delete-btn").on("click", function () {
      $(this).closest(".item-contents").remove();
  });
});
