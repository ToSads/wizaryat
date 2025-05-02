let catdata;
let examsdata;
let headerQoute = document.querySelector('.header-qoute')

let catagoriesDiv = document.querySelector(".catagories");
if (!localStorage.getItem("reload") || localStorage.getItem("reload") >= 5) {
    localStorage.setItem("reload", 0);
}

async function fetchAndApplyData() {
    const catagoriesURL = "https://tourmaline-delirious-burglar.glitch.me/catagories";
    try {
        const response = await fetch(catagoriesURL);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        catdata = await response.json();
        console.log(catdata);

        const examsURL = "https://tourmaline-delirious-burglar.glitch.me/links";
        try {
            const response = await fetch(examsURL);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            examsdata = await response.json();
            console.log(examsdata);

            document.querySelector(".loading-screen").style = "display:none;";
            localStorage.setItem("reload", 0);
        } catch (error) {
            localStorage.setItem("reload",Number(localStorage.getItem("reload")) + 1);
            if (localStorage.getItem("reload") < 5) {
                console.error(error.message);
                location.reload();
            } else {
                let url = new URL(window.location.href);
                url.pathname = "/error.html";
                let newUrl = url.toString();
                window.location.href = newUrl;
            }
        }
    } catch (error) {
        localStorage.setItem("reload", Number(localStorage.getItem("reload")) + 1);
        if (localStorage.getItem("reload") < 5) {
            console.error(error.message);
            location.reload();
        } else {
            let url = new URL(window.location.href);
            url.pathname = "/error.html";
            let newUrl = url.toString();
            window.location.href = newUrl;
        }
    }
    putHTML();
}

let translate = {
    "Biology": "الاحياء",
    "Physics": "الفيزياء",
    "Chemistry": "الكيمياء",
    "English": "اللغة الانجليزية",
    "French": "اللغة الفرنسية",
    "Islamic": "التربية الاسلامية",
    "Arabic": "اللغة العربية",
    "Math": "الرياضيات"
}
function putHTML() {
    headerQoute.innerHTML = `
            <h1>أجوبة الاختبارات الوزارية</h1>
            <h3>راجع إجابات أسئلة الاختبارات الوزارية للسادس الاعدادي</h3>
    `
    catagoriesDiv.innerHTML = `
        <div onclick="catagoryClicked('Biology')" class="biologyDiv catagoryDiv">
        <iconify-icon icon="material-symbols-light:microbiology" width="65" height="65"  style="color: #10B981"></iconify-icon>
        <p>الاحياء</p>
        </div>

        <div onclick="catagoryClicked('Physics')" class="physicsDiv catagoryDiv">
        <iconify-icon icon="hugeicons:physics" width="65" height="65"  style="color: #0EA5E9 "></iconify-icon>
        <p>الفيزياء</p>
        </div>

        <div onclick="catagoryClicked('Chemistry')" class="chemistryDiv catagoryDiv">
        <iconify-icon icon="healthicons:biochemistry-laboratory" width="65" height="65"  style="color: #6366F1"></iconify-icon>
        <p>الكيمياء</p>
        </div>

        <div onclick="catagoryClicked('English')" class="englishDiv catagoryDiv">
        <iconify-icon icon="icon-park-solid:english" width="65" height="65"  style="color: #3B82F6 "></iconify-icon>
        <p>اللغة الانجليزية</p>
        </div>

        <div onclick="catagoryClicked('French')" class="frenchDiv catagoryDiv">
        <iconify-icon icon="mdi:france" width="65" height="65"  style="color: #E879F9"></iconify-icon>
        <p>اللغة الفرنسية</p>
        </div>

        <div onclick="catagoryClicked('Islamic')" class="islamicDiv catagoryDiv">
        <iconify-icon icon="noto-v1:mosque" width="65" height="65"  style="color: #22C55E "></iconify-icon>
        <p>التربية الاسلامية</p>
        </div>

        <div onclick="catagoryClicked('Arabic')" class="arabicDiv catagoryDiv">
        <iconify-icon icon="mdi:abjad-arabic" width="65" height="65"  style="color: #F97316"></iconify-icon>
        <p>اللغة العربية</p>
        </div>
        
        <div onclick="catagoryClicked('Math')" class="mathDiv catagoryDiv">
        <iconify-icon icon="mynaui:math-square" width="65" height="65"  style="color: #EF4444"></iconify-icon>
        <p>الرياضيات</p>
        </div>

    `;
}
fetchAndApplyData();

function catagoryClicked(subject) {
    headerQoute.innerHTML = `
            <h1>حدد القسم</h1>
            `
    let catagoriesInSubject = [];
    catdata.forEach((catagoryObject) => {
        if (catagoryObject["subjects"].includes(subject))
            catagoriesInSubject.push(catagoryObject);
    });
    if (catagoriesInSubject.length == 0) {
        headerQoute.innerHTML = `
            <h1>لم يتم اضافة اسئلة لهذه المادة</h1>
            <button class="back-icon" onclick="putHTML()">الرجوع</button>
            `
    }
    console.log(catagoriesInSubject);

    catagoriesDiv.innerHTML = `
        <button class="homeBtn" onclick="putHTML()">
        <img src="media/images/icons/ic--baseline-home (1).png" alt="Home">
        </button>`;
        catagoriesInSubject.forEach((cat) => {
        catagoriesDiv.innerHTML += `
        <div onclick="showYears('${cat["name"]}', '${subject}')" class="catagoryDiv">${cat["name"]}
        <div class="small-div">
            <small>${translate[subject]}</small>
        </div>
        </div>
    `;
    });
}


function showYears(cat,sub) {
    headerQoute.innerHTML = `
            <h1>حدد السنة</h1>
            `
    console.log(cat,sub)
    let yearsInThatExam = []
    examsdata.forEach(exam=> {
        console.log(yearsInThatExam.includes('2019'))
        if (exam['section'] == cat && exam['subject'] == sub) {
            if (!yearsInThatExam.includes(exam['year'])) {
                yearsInThatExam.push(exam['year'])
            }

        }
    }) 
    
    if (yearsInThatExam.length == 0) {
        headerQoute.innerHTML = `
            <h1>لم يتم اضافة اسئلة لهذه المادة</h1>
            <button class="back-icon" onclick="putHTML()">الرجوع</button>
            `
    }
    catagoriesDiv.innerHTML = `
        <button class="homeBtn" onclick="putHTML()">
        <img src="media/images/icons/ic--baseline-home (1).png" alt="Home">
        </button>
        `
    yearsInThatExam.forEach(year => {
        catagoriesDiv.innerHTML += `
        <div onclick="showExams('${cat}', '${sub}', '${year}')" class="catagoryDiv">${year}
        <div class="small-div">
            <small>${translate[sub]}</small>
            <hr>
            <small>${cat}</small>
        </div>
        </div>
    `;
    })
}


function showExams(cat,sub,year) {
    headerQoute.innerHTML = `
            <h1>الادوار</h1>
            `
    let exams = []
    examsdata.forEach(exam => {
        if (exam["section"] == cat && exam['subject'] == sub && exam['year'] == year) {
            exams.push(exam)
        }
    })
    

    catagoriesDiv.innerHTML = `
        <button class="homeBtn" onclick="putHTML()">
        <img src="media/images/icons/ic--baseline-home (1).png" alt="Home">
        </button>
        `
    exams.forEach(exam => {
        catagoriesDiv.innerHTML += `
        <a href="${exam['url']}" target="_blank" class="catagoryDiv">${exam['title']}
        <div class="small-div">
            <small>${translate[sub]}</small>
            <hr>
            <small>${cat}</small>
            <hr>
            <small>${year}</small>
        </div>
        </a>
    `;
    })
}
