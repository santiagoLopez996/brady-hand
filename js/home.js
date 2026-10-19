/*TABS*/

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(button => {

    button.addEventListener("click", () => {

        const tabId = button.dataset.tab;

        tabButtons.forEach(btn =>{

            btn.classList.remove("active");
        });

        tabContents.forEach(content =>{

            content.classList.remove("active");
        });

        button.classList.add("active");

        document 
            .getElementById(tabId)
            .classList.add("active");

    });

});