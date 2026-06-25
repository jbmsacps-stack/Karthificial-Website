// =======================================================
// ADMIN NOTES MANAGER
// =======================================================

const boardSelect = document.getElementById("boardSelect");
const classSelect = document.getElementById("classSelect");
const subjectSelect = document.getElementById("subjectSelect");
const chapterSelect = document.getElementById("chapterSelect");

const materialForm = document.getElementById("studyMaterialForm");

const tableBody = document.getElementById("materialsTableBody");

document.addEventListener("DOMContentLoaded", async () => {

    await loadBoards();

});

async function loadBoards() {

    const { data, error } = await supabase

        .from("boards")

        .select("*")

        .order("id");

    if (error) {

        console.error(error);

        return;

    }

    boardSelect.innerHTML =
        `<option value="">Select Board</option>`;

    data.forEach(board => {

        boardSelect.innerHTML += `

            <option value="${board.id}">

                ${board.name}

            </option>

        `;

    });

}

boardSelect.addEventListener("change", async () => {

    classSelect.innerHTML = "";

    subjectSelect.innerHTML = "";

    chapterSelect.innerHTML = "";

    await loadClasses(boardSelect.value);

});

async function loadClasses(boardId){

    const {data,error} = await supabase

        .from("classes")

        .select("*")

        .eq("board_id",boardId)

        .order("id");

    if(error){

        console.error(error);

        return;

    }

    classSelect.innerHTML =

    `<option value="">Select Class</option>`;

    data.forEach(item=>{

        classSelect.innerHTML +=

        `<option value="${item.id}">

            ${item.name}

        </option>`;

    });

}

classSelect.addEventListener("change",async()=>{

    subjectSelect.innerHTML="";

    chapterSelect.innerHTML="";

    await loadSubjects(classSelect.value);

});

classSelect.addEventListener("change",async()=>{

    subjectSelect.innerHTML="";

    chapterSelect.innerHTML="";

    await loadSubjects(classSelect.value);

});

async function loadSubjects(classId){

    const {data,error}=await supabase

        .from("subjects")

        .select("*")

        .eq("class_id",classId)

        .order("display_order");

    if(error){

        console.error(error);

        return;

    }

    subjectSelect.innerHTML=

    `<option value="">Select Subject</option>`;

    data.forEach(subject=>{

        subjectSelect.innerHTML +=

        `<option value="${subject.id}">

            ${subject.name}

        </option>`;

    });

}

subjectSelect.addEventListener("change",async()=>{

    chapterSelect.innerHTML="";

    await loadChapters(subjectSelect.value);

});

async function loadChapters(subjectId){

    const {data,error}=await supabase

        .from("chapters")

        .select("*")

        .eq("subject_id",subjectId)

        .order("chapter_number");

    if(error){

        console.error(error);

        return;

    }

    chapterSelect.innerHTML=

    `<option value="">Select Chapter</option>`;

    data.forEach(chapter=>{

        chapterSelect.innerHTML +=

        `<option value="${chapter.id}">

            ${chapter.chapter_number}
            -
            ${chapter.title}

        </option>`;

    });

}

const titleInput = document.getElementById("materialTitle");
const descriptionInput = document.getElementById("materialDescription");
const materialType = document.getElementById("materialType");
const youtubeInput = document.getElementById("youtubeUrl");
const pdfInput = document.getElementById("pdfFile");
const sortOrder = document.getElementById("sortOrder");
const isActive = document.getElementById("isActive");

async function uploadPDF(file) {

    if (!file) return null;

    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage

        .from("study-materials")

        .upload(fileName, file);

    if (error) {

        console.error(error);

        throw error;

    }

    const { data: publicUrl } = supabase.storage

        .from("study-materials")

        .getPublicUrl(fileName);

    return publicUrl.publicUrl;

}

materialForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        let pdfUrl = null;

        if (pdfInput.files.length > 0) {

            pdfUrl = await uploadPDF(pdfInput.files[0]);

        }

        const payload = {

            subject_id: Number(subjectSelect.value),

            chapter_id: chapterSelect.value
                ? Number(chapterSelect.value)
                : null,

            material_type: materialType.value,

            title: titleInput.value.trim(),

            description: descriptionInput.value.trim(),

            pdf_url: pdfUrl,

            youtube_url: youtubeInput.value.trim(),

            sort_order: Number(sortOrder.value),

            is_active: isActive.checked

        };

        const { error } = await supabase

            .from("study_materials")

            if (editingId) {

    const { error } = await supabase

        .from("study_materials")

        .update(payload)

        .eq("id", editingId);

    if (error) throw error;

    editingId = null;

    document

        .getElementById("saveMaterialBtn")

        .textContent =

        "Save Material";

}
else {

    const { error } = await supabase

        .from("study_materials")

        .insert(payload);

    if (error) throw error;

}

        if (error) throw error;

        alert("Study Material Uploaded Successfully!");

        materialForm.reset();

        await loadMaterials();

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

});

async function loadMaterials() {

    const { data, error } = await supabase

        .from("study_materials")

        .select(`
            *,
            subjects(name),
            chapters(title)
        `)
        .order("sort_order");

    if (error) {

        console.error(error);

        return;

    }

    renderTable(data);

}

function renderTable(materials) {

    tableBody.innerHTML = "";

    if (!materials.length) {

        document.getElementById("emptyState").style.display = "block";

        return;

    }

    document.getElementById("emptyState").style.display = "none";

    materials.forEach((item, index) => {

        tableBody.innerHTML += `

<tr>

<td>${index + 1}</td>

<td>${item.title}</td>

<td>${item.subjects?.name ?? "-"}</td>

<td>${item.chapters?.title ?? "-"}</td>

<td>${item.material_type}</td>

<td>

${item.pdf_url
? `<a href="${item.pdf_url}" target="_blank">View PDF</a>`
: "-"}

</td>

<td>

${item.youtube_url
? `<a href="${item.youtube_url}" target="_blank">Watch</a>`
: "-"}

</td>

<td>

${item.is_active ? "✅" : "❌"}

</td>

<td>

<button
class="edit-btn"
onclick="editMaterial(${item.id})">

Edit

</button>

<button
class="delete-btn"
onclick="deleteMaterial(${item.id})">

Delete

</button>

</td>

</tr>

`;

    });

}

document.addEventListener("DOMContentLoaded", async () => {

    await loadBoards();

    await loadMaterials();

});

async function loadMaterials() {

    const { data, error } = await supabase

        .from("study_materials")

        .select(`
            *,
            subjects(name),
            chapters(title)
        `)
        .order("sort_order");

    if (error) {

        console.error(error);

        return;

    }

    materials = data;

    renderTable(materials);

}

const searchInput = document.getElementById("searchMaterial");

searchInput.addEventListener("input", () => {

    const keyword = searchInput.value.toLowerCase();

    const filtered = materials.filter(item =>

        item.title.toLowerCase().includes(keyword)

    );

    renderTable(filtered);

});

document

.getElementById("refreshMaterialsBtn")

.addEventListener("click", async () => {

    await loadMaterials();

});

async function editMaterial(id) {

    const material = materials.find(m => m.id === id);

    if (!material) return;

    editingId = id;

    titleInput.value = material.title;

    descriptionInput.value = material.description || "";

    youtubeInput.value = material.youtube_url || "";

    materialType.value = material.material_type;

    sortOrder.value = material.sort_order;

    isActive.checked = material.is_active;

    boardSelect.value = "";

    classSelect.value = "";

    subjectSelect.value = material.subject_id;

    await loadChapters(material.subject_id);

    chapterSelect.value = material.chapter_id;

    document

        .getElementById("saveMaterialBtn")

        .textContent = "Update Material";

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

async function deleteMaterial(id){

    const ok = confirm(

        "Delete this study material?"

    );

    if(!ok) return;

    const {error} = await supabase

        .from("study_materials")

        .delete()

        .eq("id",id);

    if(error){

        console.error(error);

        return;

    }

    await loadMaterials();

}

document

.getElementById("resetMaterialBtn")

.addEventListener("click",()=>{

    editingId=null;

    materialForm.reset();

    document

    .getElementById("saveMaterialBtn")

    .textContent=

    "Save Material";

});

const filterSubject =

document.getElementById("filterSubject");

filterSubject.addEventListener(

"change",

()=>{

const value=

filterSubject.value;

if(!value){

renderTable(materials);

return;

}

const filtered=

materials.filter(

item=>item.subject_id==value

);

renderTable(filtered);

});

const filterType =

document.getElementById("filterType");

filterType.addEventListener(

"change",

()=>{

const value=

filterType.value;

if(!value){

renderTable(materials);

return;

}

const filtered=

materials.filter(

item=>item.material_type===value

);

renderTable(filtered);

});

const filterType =

document.getElementById("filterType");

filterType.addEventListener(

"change",

()=>{

const value=

filterType.value;

if(!value){

renderTable(materials);

return;

}

const filtered=

materials.filter(

item=>item.material_type===value

);

renderTable(filtered);

});

async function loadFilterBoards() {

    const { data, error } = await supabase

        .from("boards")

        .select("*")

        .order("id");

    if (error) return console.error(error);

    filterBoard.innerHTML =
        `<option value="">All Boards</option>`;

    data.forEach(board => {

        filterBoard.innerHTML += `

        <option value="${board.id}">

            ${board.name}

        </option>

        `;

    });

}

async function loadFilterClasses(boardId) {

    const { data, error } = await supabase

        .from("classes")

        .select("*")

        .eq("board_id", boardId)

        .order("id");

    if (error) return console.error(error);

    filterClass.innerHTML =
        `<option value="">All Classes</option>`;

    data.forEach(cls => {

        filterClass.innerHTML += `

        <option value="${cls.id}">

            ${cls.name}

        </option>

        `;

    });

}

async function loadFilterSubjects(classId) {

    const { data, error } = await supabase

        .from("subjects")

        .select("*")

        .eq("class_id", classId)

        .order("display_order");

    if (error) return console.error(error);

    filterSubject.innerHTML =
        `<option value="">All Subjects</option>`;

    data.forEach(subject => {

        filterSubject.innerHTML += `

        <option value="${subject.id}">

            ${subject.name}

        </option>

        `;

    });

}

filterBoard.addEventListener("change", async () => {

    await loadFilterClasses(filterBoard.value);

});

filterClass.addEventListener("change", async () => {

    await loadFilterSubjects(filterClass.value);

});

function applyFilters() {

    let filtered = [...materials];

    if (filterSubject.value) {

        filtered = filtered.filter(

            m => m.subject_id == filterSubject.value

        );

    }

    if (filterType.value) {

        filtered = filtered.filter(

            m => m.material_type === filterType.value

        );

    }

    renderTable(filtered);

}

filterSubject.addEventListener(

    "change",

    applyFilters

);

filterType.addEventListener(

    "change",

    applyFilters

);

function showLoading(){

    document

        .getElementById("loadingState")

        .style.display="block";

}

function hideLoading(){

    document

        .getElementById("loadingState")

        .style.display="none";

}

showLoading();

const {data,error}=...

hideLoading();

function showToast(message){

    const toast=document.createElement("div");

    toast.className="toast";

    toast.innerText=message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },100);

    setTimeout(()=>{

        toast.remove();

    },3000);

}