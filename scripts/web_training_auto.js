(function () {
    'use strict';

    console.log("run web_training_auto.js");

    const page = window.tacCurrentPage.afterLogin;

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

    // キー入力イベントの処理
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (keyMap[key]) {
            keyMap[key]();
        }
    });

    if (page.isMobile) goNextButton();

    // 質問画面でキーボード操作対応
    const keyMap = {
        shift: () => {
            if (page.isChapterDetailPage) startQuestion();
        },
        a: () => {
            if (page.isQuestionSolvePage) {
                selectAnswer('left');
            } else if (page.isChapterDetailPage) {
                goAnotherQuestion('left');
            }
        },
        d: () => {
            if (page.isQuestionSolvePage) {
                selectAnswer('');
            } else if (page.isChapterDetailPage) {
                goAnotherQuestion('');
            }
        },
        q: () => {
            if (page.isQuestionSolvePage) goNextQuestion(1);
        },
        w: () => {
            if (page.isQuestionSolvePage) goNextQuestion(2);
        },
        e: () => {
            if (page.isQuestionSolvePage) goNextQuestion(3);
        }
    };

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
        const btnId = key === 'left' ? "choice-answer-circle" : "choice-answer-x-mark";
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
            checkbox.checked = (key !== 1);
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
            const targetNumber = key === 'left' ? baseNumber - 1 : baseNumber + 1;

            const targetUrl = location.href.replace(/\/web_trainings\/\d+/, `/web_trainings/${targetNumber}`);
            window.location.href = targetUrl;
        }
    }

    function goNextButton() {
        if (!document.getElementById("goNextButtons")) {
            const parent = document.querySelector("#btn-section-answer");
            const container = document.createElement("div");
            container.id = "goNextButtons";

            for (let key = 1; key <= 3; key++) {
                const btn = document.createElement("button");
                btn.textContent = `Go ${key}`;

                btn.addEventListener("click", () => {
                    goNextQuestion(key);
                });

                container.appendChild(btn);
            }

            parent.insertBefore(container, parent.firstChild);

            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://hachiman-oct.github.io/tac-userscripts/sccs/go_next_button.scss";
            document.head.appendChild(link);

            console.log("run web_training_auto.js mobile");
        }
    }
})();