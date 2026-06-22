const modal = document.getElementById("papers-modal");
const papersContainer = document.getElementById("papers-container");
const modalTitle = document.getElementById("modal-title");
const closeModalBtn = document.getElementById("close-modal");

document.querySelectorAll(".view-papers-btn").forEach(button => {

    button.addEventListener("click", async () => {

        const standard = button.dataset.standard;
        const subject = button.dataset.subject;

        modal.classList.remove("hidden");

        modalTitle.textContent = `${subject} Question Papers`;

        papersContainer.innerHTML = "Loading...";

        const { data, error } = await window.supabaseClient
            .from("question_papers")
            .select("*")
            .eq("standard", standard)
            .eq("subject", subject);

        console.log(data);
        console.log(error);

        if (error) {

            papersContainer.innerHTML = `
                <p>Error loading papers</p>
            `;

            return;
        }

        if (!data || data.length === 0) {

            papersContainer.innerHTML = `
                <p>No papers found</p>
            `;

            return;
        }

        papersContainer.innerHTML = "";

        data.forEach(paper => {

            papersContainer.innerHTML += `

                <div class="paper-card">

                    <h3>${paper.title}</h3>

                    <p>Year: ${paper.year}</p>

                    <a href="${paper.file_url}"
                       target="_blank"
                       class="resource-card-btn">

                        Open PDF

                    </a>

                </div>

            `;
        });
    });
});

closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});