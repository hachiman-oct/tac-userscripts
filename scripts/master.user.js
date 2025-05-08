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

    loadScript('page_map.js');

    // 必要なページ判定（例: window.tacCurrentPage がある前提）
    function waitForPage(resolveWhen) {
        const timer = setInterval(() => {
            if (resolveWhen()) {
                clearInterval(timer);
                resolveWhen();
            }
        }, 100);
    }

    function loadScript(file) {
        const script = document.createElement('script');
        script.src = base + file;
        script.type = 'text/javascript';
        document.head.appendChild(script);
    }

    waitForPage(() => {
        const page = window.tacCurrentPage;
        if (!page) return false;

        const isAfterLoginPage = Object.values(window.tacCurrentPage.afterLogin).some(Boolean);
        if (isAfterLoginPage) {
            loadScript('web_training_auto');
            loadScript('display_question_count');
            loadScript('restyle');
        };

        const isHome = Object.values(window.tacCurrentPage.afterLogin.isHome).some(Boolean);
        if (isHome) loadScript('insert_table');

        const isBeforeLoginPage = Object.values(window.tacCurrentPage.beforeLogin).some(Boolean);
        if (isBeforeLoginPage) loadScript('login');
    });
})();
