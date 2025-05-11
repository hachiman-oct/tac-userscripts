(function () {
    'use strict';

    console.log("run page_map.js");

    const currentUrl = window.location.pathname;
    const controller = document.body.dataset.controller;
    const action = document.body.dataset.action;

    const page = {
        beforeLogin: {
            login: currentUrl === '/user_session/new',
            chair: currentUrl === '/home/choice_chair',
            course: currentUrl === '/home/choice_course',
        },

        afterLogin: {
            isWebTrainingEntryPage: controller === "web_trainings" && action === "subjects",
            isChapterListPage: controller === "web_trainings" && action === "index",
            isChapterDetailPage: controller === "web_trainings" && action === "show",
            isQuestionSolvePage: controller === "web_training_questions" && action === "show",
            isResult: controller === "web_training_questions" && action === "result",
            isHome: controller === "home" && action === "index",
        },

        isMobile: document.querySelectorAll('link[rel="apple-touch-icon"]').length > 0
    };

    window.tacCurrentPage = page;
})();