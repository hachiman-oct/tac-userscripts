// ==UserScript==
// @name         Tac Login Auto with Settings UI
// @namespace    https://github.com/hachiman-oct/
// @author       hachiman-oct
// @version      1.0
// @license      This script is licensed for private use only by hachiman-oct.
// @license      Reproduction, modification, redistribution, and use by others are strictly prohibited.
// @match        https://ws.tac-school.co.jp/*
// @updateURL    https://raw.githubusercontent.com/hachiman-oct/tac-userscripts/main/tac_login.user.js
// @downloadURL  https://raw.githubusercontent.com/hachiman-oct/tac-userscripts/main/tac_login.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const currentUrl = window.location.pathname;
    const page = {
        login: currentUrl === '/user_session/new',
        chair: currentUrl === '/home/choice_chair',
        course: currentUrl === '/home/choice_course'
    }

    const STORAGE_KEY_ID = 'tac_user_id';
    const STORAGE_KEY_PASS = 'tac_user_pass';
    const STORAGE_KEY_CHAIR_ID = 'tac_chair_id';
    const STORAGE_KEY_PRODUCT_ID = 'tac_product_id';

    const base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const obfuscationMap = "n9m3Lx1TfVkOaE7JgWqDR0BCyNiZzF6AUsd8Ph2MlYoSHtvKcXpbQrew54G+j/";

    if (isSettingsIncomplete()) {
        createSettingsUI();
    }

    const credentials = getCredentials();
    if (!credentials) return;

    if (page.login) {
        const errorElement = document.querySelector(".notice_msgInner #notice_messages .ErrorMsg");
        if (errorElement) {
            console.log("has errorelement");
            showClearStorageClearButtonOnError([
                'tac_user_id',
                'tac_user_pass'
            ]);
        }
        
        const loginBlock = document.querySelector(".loginBlock_content");
        if (loginBlock) {
            const idInput = loginBlock.querySelector("#user_session_login");
            const passInput = loginBlock.querySelector('[name="user_session[password]"]');
            const loginBtn = loginBlock.querySelector('.loginBtn');
            if (idInput && passInput && loginBtn) {
                idInput.value = credentials.id;
                passInput.value = credentials.pass;
                loginBtn.click();
            }
        }
    } else if (page.chair) {
        const registerBlock = document.querySelector(".registerPage");
        if (registerBlock) {
            const chairSelector = `#chair_tax_${credentials.chairId}\\:\\:`;
            const chairBtn = registerBlock.querySelector(chairSelector);
            if (chairBtn) {
                chairBtn.click();
                registerBlock.querySelector(".confirmBtn")?.click();
            } else {
                showClearStorageClearButtonOnError(["tac_chair_id"]);            
            }
        }
    } else if (page.course) {
        const registerBlock = document.querySelector(".registerPage");
        if (registerBlock) {
            const productSelector = `#product_id_${credentials.productId}`;
            const productBtn = registerBlock.querySelector(productSelector);
            if (productBtn) {
                productBtn.click();
                registerBlock.querySelector(".confirmBtn")?.click();
            } else {
                showClearStorageClearButtonOnError(["tac_product_id"]);
            }
        }
    }

    function encode(str) {
        const base64 = btoa(str);
        return base64.split('').map(char => {
            const i = base64chars.indexOf(char);
            return i >= 0 ? obfuscationMap[i] : char;
        }).join('');
    }

    function decode(str) {
        return atob(str.split('').map(char => {
            const i = obfuscationMap.indexOf(char);
            return i >= 0 ? base64chars[i] : char;
        }).join(''));
    }

    function createSettingsUI() {
        const container = document.createElement('div');
        container.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: white;
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            font-family: sans-serif;
            width: 250px;
        `;

        container.innerHTML = `
            <h4 style="margin:0 0 10px;">TAC設定</h4>
            <label>ID:<br><input id="tac_id_input" style="width:100%" /></label><br>
            <label>パスワード:<br><input id="tac_pass_input" type="password" style="width:100%" /></label><br>
            <label>講座ID (chair_tax_XXXX):<br><input id="tac_chair_input" style="width:100%" /></label><br>
            <label>コースID (product_id_XXXXX):<br><input id="tac_product_input" style="width:100%" /></label><br>
            <button id="tac_save_btn" style="margin-top:5px">保存</button>
            <button id="tac_clear_btn" style="margin-top:5px">削除</button>
            <button id="tac_close_btn" style="float:right;margin-top:5px">閉じる</button>
        `;

        document.body.appendChild(container);

        // 初期値をセット
        const idInput = container.querySelector("#tac_id_input");
        const passInput = container.querySelector("#tac_pass_input");
        const chairInput = container.querySelector("#tac_chair_input");
        const productInput = container.querySelector("#tac_product_input");

        const savedId = localStorage.getItem(STORAGE_KEY_ID);
        const savedPass = localStorage.getItem(STORAGE_KEY_PASS);
        const savedChair = localStorage.getItem(STORAGE_KEY_CHAIR_ID);
        const savedProduct = localStorage.getItem(STORAGE_KEY_PRODUCT_ID);

        if (savedId) idInput.value = decode(savedId);
        if (savedPass) passInput.value = decode(savedPass);
        if (savedChair) chairInput.value = savedChair;
        if (savedProduct) productInput.value = savedProduct;

        container.querySelector("#tac_save_btn").onclick = () => {
            localStorage.setItem(STORAGE_KEY_ID, encode(idInput.value));
            localStorage.setItem(STORAGE_KEY_PASS, encode(passInput.value));
            localStorage.setItem(STORAGE_KEY_CHAIR_ID, chairInput.value);
            localStorage.setItem(STORAGE_KEY_PRODUCT_ID, productInput.value);
            alert("設定を保存しました！");
            location.reload();
        };

        container.querySelector("#tac_clear_btn").onclick = () => {
            localStorage.removeItem(STORAGE_KEY_ID);
            localStorage.removeItem(STORAGE_KEY_PASS);
            localStorage.removeItem(STORAGE_KEY_CHAIR_ID);
            localStorage.removeItem(STORAGE_KEY_PRODUCT_ID);
            alert("設定を削除しました");
            location.reload();
        };

        container.querySelector("#tac_close_btn").onclick = () => {
            container.remove();
        };
    }

    function isSettingsIncomplete() {
        return !localStorage.getItem(STORAGE_KEY_ID) ||
            !localStorage.getItem(STORAGE_KEY_PASS) ||
            !localStorage.getItem(STORAGE_KEY_CHAIR_ID) ||
            !localStorage.getItem(STORAGE_KEY_PRODUCT_ID);
    }

    function getCredentials() {
        const idEncoded = localStorage.getItem(STORAGE_KEY_ID);
        const passEncoded = localStorage.getItem(STORAGE_KEY_PASS);
        const chairId = localStorage.getItem(STORAGE_KEY_CHAIR_ID);
        const productId = localStorage.getItem(STORAGE_KEY_PRODUCT_ID);

        if (!idEncoded || !passEncoded || !chairId || !productId) {
            console.warn("TAC設定が未入力または不完全です");
            return null;
        }

        return {
            id: decode(idEncoded),
            pass: decode(passEncoded),
            chairId,
            productId
        };
    }

    // エラーメッセージがある場合、削除確認ボタンを表示
    function showClearStorageClearButtonOnError(keysToClear = []) {
        if (!document.querySelector("#tac_clear_on_error_btn")) {
            const btn = document.createElement("button");
            btn.id = "tac_clear_on_error_btn";
            btn.textContent = "保存情報を削除";
            btn.style = `
                position: fixed;
                right: 15%;
                z-index: 9999;
                padding: 6px 12px;
                background: #f44336;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 1rem;
                cursor: pointer;
            `;
        
    
            btn.onclick = () => {
                const confirmMsg = `以下の情報を削除してページを再読み込みしますか？\n\n- ${keysToClear.join("\n- ")}`;
                if (confirm(confirmMsg)) {
                    keysToClear.forEach(key => localStorage.removeItem(key));
                    alert("指定された保存情報を削除しました。ページを再読み込みします。");
                    location.reload();
                }
            };

            const parent = document.querySelector("#content");
            parent.prepend(btn);
        }
    }
})();
