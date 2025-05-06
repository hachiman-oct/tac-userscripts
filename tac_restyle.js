(function (){
    'use strict';

    // 不必要な要素の非表示
    const selectorsToHide = [
        ".infoBlock", // web trainingの情報
        /*".btn-header-section", // web trainingの「戻る」ボタン*/
        ".homeBanner", // ホームのバナー
        ".homeFirstTier", // ホームの情報
        ".homeSecondTier" // ホームの情報
    ]
    selectorsToHide.forEach(sel => {
        const el = document.querySelector(sel)
        if (el) {
            el.style.display = "none";
        }
    });

    // Web Training「はじめる」の自動操作
    const modal = document.querySelector('.modal-container');
    if (modal && modal.classList.contains('active')){
        document.querySelector("#beginning-question-close").click();
    }
})();