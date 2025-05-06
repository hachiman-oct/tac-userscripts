(function() {
    'use strict';

    const controller = document.body.dataset.controller;
    const action = document.body.dataset.action;

    const pageMap = {
        isWebTrainingEntryPage: { controller: "web_trainings", action: "subjects" },
        isChapterListPage: { controller: "web_trainings", action: "index" },
        isChapterDetailPage: { controller: "web_trainings", action: "show" },
        isQuestionSolvePage: { controller: "web_training_questions", action: "show" },
        isResult: { controller: "web_training_questions", action: "result" },
        isHome: { controller: "home", action: "index" }
    };
    
    const page = {};
        for (const [key, condition] of Object.entries(pageMap)) {
        page[key] = (controller === condition.controller && action === condition.action);
    };

    window.tacCurrentPage = page;
    
    const isValidPage = Object.values(page).some(Boolean);
    if (!isValidPage) return;

    // モーダルが開いていたら閉じる
    if (page.isQuestionSolvePage) {
        const modal = document.querySelector('.modal-container');
        if (modal && modal.classList.contains('active')) {
            document.getElementById("beginning-question-close")?.click();
            return;
        }
    }

    // 「戻る」ボタンがあるなら押す（結果画面用）
    if (page.isResult) {
        const clearBtn = document.querySelector(".clearBtn a");
        if (clearBtn) clearBtn.click();
        return;
    }

    // 質問画面でキーボード操作対応
    document.addEventListener('keydown', async function(e) {
        const key = e.key.toLowerCase();

        if (key === "enter") {
            // セクション画面では「はじめる」ボタンを自動クリック
            if (page.isChapterDetailPage) {
                startQuestion();
            }
        }

        if (key === 'a' || key === 'd') {
            if (page.isQuestionSolvePage) {
                selectAnswer(key);
            } else if (page.isChapterDetailPage) {
                goAnotherQuestion(key);
            }
        }

        if (/^[1-3]$/.test(key)) {
            if (page.isQuestionSolvePage) {
                goNextQuestion(key);
            }
        }
    });

    /**
     * 問題を始める．解答途中なら途中から開始
     */
    function startQuestion() {
        const btn = document.querySelectorAll('button.searchBtn.mr20');
        if (btn.length === 2) btn[1].click();
        else if (btn.length === 1) btn[0].click();
        return;
    }

    /**正解を選ぶ
     * a: 正解、d: 不正解
     * @param {*} key 
     */ 
    function selectAnswer(key) {
        const btnId = key === 'a' ? "choice-answer-circle" : "choice-answer-x-mark";
        const btn = document.getElementById(btnId);
        if (btn) btn.click();

        // 少し待ってから理解度・復習選択を行う
        setTimeout(() => {
            const section = document.getElementById("btn-section-answer");
            if (!section || section.style.display !== "block") {
                alert("条件を満たしていません。");
                return;
            }
        }, 100);
    }

    /**
     * 次の問題にいく前に理解度・復習の有無を選択
     * @param {*} key 
     */
    function goNextQuestion(key) {
        const checkbox = document.querySelector("#btn_hukusyu input[type='checkbox']");
        const select = document.getElementById("understanding");
        const nextLink = document.querySelector("#next_question a");
        const searchBtn = document.getElementsByClassName("searchBtn");
        const nextQuestionBtn = document.getElementById("next_question");

        if (checkbox) {
            checkbox.checked = (key !== "1");
            checkbox.dispatchEvent(new Event("change"));
        }

        if (select) {
            select.value = key;
            select.dispatchEvent(new Event("change"));
        }

        // 結果画面に遷移
        if (!nextLink && searchBtn.length > 0 && nextQuestionBtn?.onclick) {
            nextQuestionBtn.onclick();
            return;
        }

        // 途中の問題で次へ
        if (nextLink) {
            nextLink.click();
            return;
        }

        // チェックモードの「戻る」
        if (!nextLink && searchBtn.length === 0) {
            const clearBtn = document.querySelector(".clearBtn a");
            if (clearBtn) clearBtn.click();
        }
    }

    function goAnotherQuestion(key) {
        const match = location.pathname.match(/\/web_trainings\/(\d+)/);
        if (match) {
            const baseNumber = Number(match[1]);
            const targetNumber = key === 'a' ? baseNumber - 1 : baseNumber + 1;
        
            const targetUrl = location.href.replace(/\/web_trainings\/\d+/, `/web_trainings/${targetNumber}`);
            window.location.href = targetUrl;
        }        
    }
})();
