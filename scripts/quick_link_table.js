(function () {
    'use strict';

    console.log("run insert_table.js");

    const table = document.createElement('table');
    table.className = 'appended-table';

    // theadを作成
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = 'Quick_links';
    headRow.appendChild(th);
    thead.appendChild(headRow);
    table.appendChild(thead);

    // tbodyを作成
    const tbody = document.createElement('tbody');

    // 行データ
    const rows = [
        { href: "/web_trainings?web_training_category_id=529&product_id=57716", text: "Question: Business_Law" },
        { href: "/web_trainings?web_training_category_id=530&product_id=57716", text: "Question: Auditing" },
        { href: "/web_trainings?web_training_category_id=533&product_id=57716", text: "Question: Financial_Accounting_Theory" },
        { href: "/web_trainings?web_training_category_id=539&product_id=57716", text: "Question: Management_Accounting" },
        { href: "/chair_pdfs?product_id=57716", text: "Materials" },
    ];

    // 各行を追加
    rows.forEach(row => {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        const a = document.createElement('a');
        a.href = row.href;
        a.textContent = row.text;
        td.appendChild(a);
        tr.appendChild(td);
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    let parent = document.querySelector('.contentInner') || document.querySelector('.homeMain');
    if (!parent) return;

    let child = document.querySelector(".homeFirstTier") || parent.firstChild;
    parent.insertBefore(table, child);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://hachiman-oct.github.io/tac-userscripts/css/quick_link_table.css";
    document.head.appendChild(link);
})();