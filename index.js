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

function closead() {
    document.querySelector('.ad-div').style = 'display:none;'
}


let translate = {
    "Biology": "الاحياء",
    "Physics": "الفيزياء",
    "Chemistry": "الكيمياء",
    "English": "اللغة الانكليزية",
    "French": "اللغة الفرنسية",
    "Islamic": "التربية الاسلامية",
    "Arabic": "اللغة العربية",
    "Math": "الرياضيات"
}

// دالة عكسية للترجمة من العربي إلى الإنجليزي إذا لزم الأمر في المستقبل
let reverseTranslate = {};
for (const eng in translate) {
    reverseTranslate[translate[eng]] = eng;
}

function putHTML() {
    headerQoute.innerHTML = `
                        <h1>أجوبة الاختبارات الوزارية</h1>
                        <h3>راجع إجابات أسئلة الاختبارات الوزارية للسادس الاعدادي</h3>
    `
    catagoriesDiv.innerHTML = `
        <div onclick="catagoryClicked('Biology')" class="biologyDiv catagoryDiv">
        <iconify-icon icon="material-symbols-light:microbiology" width="65" height="65"   style="color: #10B981"></iconify-icon>
        <p>الاحياء</p>
        </div>

        <div onclick="catagoryClicked('Physics')" class="physicsDiv catagoryDiv">
        <iconify-icon icon="hugeicons:physics" width="65" height="65"   style="color: #0EA5E9 "></iconify-icon>
        <p>الفيزياء</p>
        </div>

        <div onclick="catagoryClicked('Chemistry')" class="chemistryDiv catagoryDiv">
        <iconify-icon icon="healthicons:biochemistry-laboratory" width="65" height="65"   style="color: #6366F1"></iconify-icon>
        <p>الكيمياء</p>
        </div>

        <div onclick="catagoryClicked('English')" class="englishDiv catagoryDiv">
        <iconify-icon icon="icon-park-solid:english" width="65" height="65"   style="color: #3B82F6 "></iconify-icon>
        <p>اللغة الانجليزية</p>
        </div>


        <div onclick="catagoryClicked('Islamic')" class="islamicDiv catagoryDiv">
        <iconify-icon icon="noto-v1:mosque" width="65" height="65"   style="color: #22C55E "></iconify-icon>
        <p>التربية الاسلامية</p>
        </div>

        <div onclick="catagoryClicked('Arabic')" class="arabicDiv catagoryDiv">
        <iconify-icon icon="mdi:abjad-arabic" width="65" height="65"   style="color: #F97316"></iconify-icon>
        <p>اللغة العربية</p>
        </div>

        <div onclick="catagoryClicked('Math')" class="mathDiv catagoryDiv">
        <iconify-icon icon="mynaui:math-square" width="65" height="65"   style="color: #EF4444"></iconify-icon>
        <p>الرياضيات</p>
        </div>

    `;
     /* 
    <div onclick="catagoryClicked('French')" class="frenchDiv catagoryDiv">
    <iconify-icon icon="mdi:france" width="65" height="65"   style="color: #E879F9"></iconify-icon>
    <p>اللغة الفرنسية</p>
    </div> */
}
fetchAndApplyData();
/*  */
function catagoryClicked(subject) {
    headerQoute.innerHTML = `
                    <h1>حدد القسم</h1>
                    `
    let catagoriesInSubject = [];
    // ترجمة اسم المادة الإنجليزية إلى العربية
    const arabicSubject = translate[subject];

    catdata.forEach((catagoryObject) => {
        if (catagoryObject["subjects"].includes(arabicSubject)) // البحث باستخدام الاسم العربي المترجم
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
        <div onclick="showYears('${cat["_id"]}', '${subject}')" class="catagoryDiv">${cat["name"]}
        <div class="small-div">
            <small>${translate[subject]}</small>
        </div>
        </div>
    `;
    });
}


function showYears(catId, sub) { // استخدمنا catId بدلاً من cat
    headerQoute.innerHTML = `
                        <h1>حدد السنة</h1>
                        `
    console.log(catId, sub)
    let yearsInThatExam = []
    examsdata.forEach(exam=> {
        if (exam['section'] == catId && exam['subject'] == translate[sub]) { // استخدام الترجمة هنا لمطابقة API
            if (!yearsInThatExam.includes(exam['year'])) {
                yearsInThatExam.push(exam['year'])
            }

        }
    })

    let catname;
    catdata.forEach(cat => {
        if (cat["_id"] == catId) catname = cat['name']
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
        <div onclick="showExams('${catId}', '${sub}', '${year}')" class="catagoryDiv">${year}
        <div class="small-div">
            <small>${translate[sub]}</small>
            <hr>
            <small>${catname}</small>
        </div>
        </div>
    `;
    })
}


function showExams(catId, sub, year) { // استقبلنا catId بدلاً من cat
    headerQoute.innerHTML = `
                        <h1>الادوار</h1>
                        `
    let exams = []
    examsdata.forEach(exam => {
        // استخدام الترجمة هنا لمطابقة قيم API العربية
        if (exam["section"] == catId && exam['subject'] == translate[sub] && exam['year'] == year) {
            exams.push(exam)
        }
    })


    let catname;
    catdata.forEach(cat => {
        if (cat["_id"] == catId) catname = cat['name']
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
            <small>${exam['subject']}</small>
            <hr>
            <small>${catname}</small>
            <hr>
            <small>${year}</small>
        </div>
        </a>
    `;
    })
}