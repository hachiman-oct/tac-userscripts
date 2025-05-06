(function () {
    'use strict';

    const interval = setInterval(() => {
        if (window.tacCurrentPage) {
            clearInterval(interval);

            if (window.tacCurrentPage.isChapterDetailPage) {
                getQuestionCount();
            }

            if (window.tacCurrentPage.isQuestionSolvePage) {
                displayQuestionCount();
            }
        }
    }, 100);

    function getQuestionCount() {
        const count = document.querySelector(".result-item-ratio-max-score")?.textContent.split("問")[0];
        const match = location.pathname.match(/\/web_trainings\/(\d+)/);
        if (!(count && match)) return;

        const questionID = match[1];
        localStorage.setItem(`tac_question_count_${questionID}`, count);
    }

    function displayQuestionCount() {
        const match = document.querySelector(".breadcrumbsList > li:nth-child(4) a")?.pathname.match(/\/web_trainings\/(\d+)/);
        if (!match) return 1;

        const questionID = Number(match[1]);
        const count = localStorage.getItem(`tac_question_count_${questionID}`);
        if (!count) return 2;

        const num = document.querySelector(".question-title")?.textContent.split("問題")[1]

        let title = document.querySelector("#title") || document.querySelector(".leransHeading h1");
        title.textContent = `${title.textContent}　${num}問 / ${count}問`
        console.log("done")
    }
})();