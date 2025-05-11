(function () {
    'use strict';

    console.log("run display_question_count.js");
    const page = window.tacCurrentPage.afterLogin;
    const isMobile = window.tacCurrentPage.isMobile;

    const interval = setInterval(() => {
        if (page) {
            clearInterval(interval);

            if (page.isChapterDetailPage) getQuestionCount();

            if (page.isQuestionSolvePage) displayQuestionCount();
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

        const num = document.querySelector(".question-title")?.textContent.split("問題")[1];

        const title = isMobile ? document.querySelector(".leransHeading h1") : document.querySelector("#title");
        title.textContent = `${title.textContent}　${num}問 / ${count}問`;
        console.log("done");
    }
})();