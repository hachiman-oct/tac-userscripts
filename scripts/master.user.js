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

    const base = 'https://hachiman-oct.github.io/tac-userscripts/scripts/';

    function loadScript(file, callback) {
        const fullUrl = base + file;
        if (document.querySelector(`script[src="${fullUrl}"]`)) return;

        const script = document.createElement('script');
        script.src = fullUrl;
        script.type = 'text/javascript';
        script.onload = callback || null;
        document.head.appendChild(script);
    }

    // ページが条件を満たしたら一度だけ onReady を実行
    function waitForPage(conditionFn, onReady) {
        const timer = setInterval(() => {
            if (conditionFn()) {
                clearInterval(timer);
                onReady();
            }
        }, 100);
    }

    // メイン処理
    loadScript('page_map.js', () => {
        waitForPage(
            () => {
                const tacPage = window.tacCurrentPage;
                return tacPage && (
                    Object.values(tacPage.afterLogin || {}).some(Boolean) ||
                    Object.values(tacPage.beforeLogin || {}).some(Boolean)
                );
            },
            () => {
                const tacPage = window.tacCurrentPage;

                const isAfterLoginPage = Object.values(tacPage.afterLogin || {}).some(Boolean);
                if (isAfterLoginPage) {
                    loadScript('web_training_auto.js');
                    loadScript('display_question_count.js');
                    loadScript('restyle.js');
                }

                const isHome = tacPage.afterLogin?.isHome;
                if (isHome) {
                    loadScript('insert_table.js');
                }

                const isBeforeLoginPage = Object.values(tacPage.beforeLogin || {}).some(Boolean);
                if (isBeforeLoginPage) {
                    loadScript('login.js');
                }
            }
        );
    });
})();
