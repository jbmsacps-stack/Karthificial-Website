const modal =
    document.getElementById("papers-modal");

const modalTitle =
    document.getElementById("modal-title");

const papersContainer =
    document.getElementById("papers-container");

const closeModalBtn =
    document.getElementById("close-modal");

const buttons =
    document.querySelectorAll(".view-papers-btn");

function openModal() {
    modal.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
}

closeModalBtn.addEventListener(
    "click",
    closeModal
);

window.addEventListener("click", (e) => {

    if (e.target === modal) {
        closeModal();
    }
});

buttons.forEach(button => {

    button.addEventListener("click",
        async () => {

        const standard =
            button.dataset.standard;

        const subject =
            button.dataset.subject;

        modalTitle.textContent =
            `${standard} ${subject} Papers`;

        papersContainer.innerHTML =
            "<p>Loading papers...</p>";

        openModal();

        const { data, error } = await supabase
            .from("question_papers")
            .select("*")
            .eq("standard", standard)
            .eq("subject", subject)
            .order("created_at",
                { ascending: false });

        if (error) {

            papersContainer.innerHTML = `
                <p>Failed to load papers.</p>
            `;

            return;
        }

        if (!data.length) {

            papersContainer.innerHTML = `
                <p>No papers available yet.</p>
            `;

            return;
        }

        let html = "";

        data.forEach(paper => {

            html += `
                <div class="resource-box-card"
                     style="margin-bottom:15px;">

                    <h3>${paper.title}</h3>

                    <p>
                        ${paper.year || "Year Not Available"}
                    </p>

                    <a
                        href="${paper.pdf_url}"
                        target="_blank"
                        class="resource-card-btn">
                        Open PDF
                    </a>

                </div>
            `;
        });

        papersContainer.innerHTML = html;
    });
});