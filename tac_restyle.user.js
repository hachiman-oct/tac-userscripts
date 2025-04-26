// ==UserScript==
// @name         Tac Restyle
// @namespace    https://github.com/hachiman-oct/
// @author       hachiman-oct
// @version      1.0
// @license      This script is licensed for private use only by hachiman-oct.
// @license      Reproduction, modification, redistribution, and use by others are strictly prohibited.
// @match        https://ws.tac-school.co.jp/*
// @updateURL    https://raw.githubusercontent.com/hachiman-oct/tac-userscripts/main/tac_restyle.user.js
// @downloadURL  https://raw.githubusercontent.com/hachiman-oct/tac-userscripts/main/tac_restyle.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

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