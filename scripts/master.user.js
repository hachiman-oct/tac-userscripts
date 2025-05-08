// ==UserScript==
// @name         Tac Master Script
// @namespace    https://github.com/hachiman-oct/
// @version      1.0
// @description  ユーザースクリプトを一括管理・実行
// @match        https://ws.tac-school.co.jp/*
// @license      This script is licensed for private use only by hachiman-oct.
// @license      Reproduction, modification, redistribution, and use by others are strictly prohibited.
// @updateURL    https://raw.githubusercontent.com/hachiman-oct/tac-userscripts/main/scripts/master.user.js
// @downloadURL  https://raw.githubusercontent.com/hachiman-oct/tac-userscripts/main/scripts/master.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const base = 'https://raw.githubusercontent.com/hachiman-oct/tac-userscripts/main/scripts/';

    function loadScript(file, callback) {
        const script = document.createElement('script');
        script.src = base + file;
        script.type = 'text/javascript';
        script.onload = callback || null;
        document.head.appendChild(script);
    }

    // ページ判定を待ってから各スクリプトを条件付きで読み込む
    function waitForPage(resolveWhen) {
        const timer = setInterval(() => {
            if (resolveWhen()) {
                clearInterval(timer);
                resolveWhen();
            }
        }, 100);
    }

    // 1. page_map.js を読み込んでから処理を始める
    loadScript('page_map.js', () => {
        waitForPage(() => {
            const tacPage = window.tacCurrentPage;
            if (!tacPage) return false;

            const isAfterLoginPage = Object.values(tacPage.afterLogin || {}).some(Boolean);
            if (isAfterLoginPage) {
                loadScript('web_training_auto.js');
                loadScript('display_question_count.js');
                loadScript('restyle.js');
            }

            const isHome = tacPage.afterLogin?.isHome;
            if (isHome) loadScript('insert_table.js');

            const isBeforeLoginPage = Object.values(tacPage.beforeLogin || {}).some(Boolean);
            if (isBeforeLoginPage) loadScript('login.js');

            return true;
        });
    });
})();
