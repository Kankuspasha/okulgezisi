let love = 0; let turn = 0; const maxTurn = 15;
let playerName = "";
let isProcessing = false;
let currentLocationIndex = 0;
let hasKiss = false;
let hasSlap = false;
let kissCounter = 0;
let slapCounter = 0;

const locations = [
    { name: "Okul Bahçesi", color: "#2c3e50" },
    { name: "Otobüs", color: "#d35400" },
    { name: "Uludağ", color: "#ecf0f1" }
];

const eventPool = {
    "Okul Bahçesi": [
        { 
            text: "Ömer fısıldıyor: 'Gezi otobüsünde yan yana oturacağız değil mi?'", 
            options: [
                { text: "Tabii ki, yerini ayırdım bile!", love: 5, img: "mutlu.jpg" },
                { text: "Eğer yer kalırsa bakarız.", love: 1, img: "uzgun.jpg" },
                { text: "Başkasıyla oturmayı düşünüyordum.", love: -4, img: "sinirli.jpg" }
            ]
        }
    ],
    "Otobüs": [
        { 
            text: "Ömer camdan dışarı bakıyor: 'Yolculuk seninle çok daha güzel [NAME].'", 
            options: [
                { text: "Benim için de seninle her yol cennet.", love: 7, img: "mutlu.jpg" },
                { text: "Yollar da amma uzunmuş...", love: 1, img: "uzgun.jpg" },
                { text: "Kafamı dinlemek istiyordum aslında.", love: -6, img: "sinirli.jpg" }
            ]
        }
    ],
    "Uludağ": [
        { 
            text: "Ömer kar tanelerini izliyor: 'Burası bembeyaz, tıpkı senin gibi...'", 
            options: [
                { text: "Senin sevgin de bu karlar kadar saf.", love: 8, img: "mutlu.jpg" },
                { text: "Donduk Ömer, hadi içeri girelim.", love: 2, img: "uzgun.jpg" },
                { text: "Sana göre her şey romantik zaten.", love: -4, img: "sinirli.jpg" }
            ]
        }
    ]
};

function getFolder() {
    if (hasKiss && hasSlap) return "opucuktokat";
    if (hasKiss) return "opucuk";
    if (hasSlap) return "tokat";
    return "resimler";
}

function updateCharacterImage(imgName) {
    const folder = getFolder();
    const baseName = imgName.split('.')[0]; 
    // Telefonun dosya sistemini zorlamaması için ./ eklendi
    const finalPath = "./" + folder + "/" + baseName + ".jpg";
    document.getElementById("characterImage").src = finalPath;
}

function startGame() {
    const inputField = document.getElementById("playerNameInput");
    const nameValue = inputField.value.trim().toLowerCase();

    if (nameValue === "asya") {
        playerName = "Asya";
        document.getElementById("name-screen").style.display = "none";
        document.querySelector(".game-screen").style.display = "flex";
        
        document.getElementById("displayPlayerName").innerText = "ASYA";
        document.getElementById("locationLabel").innerText = locations[0].name.toUpperCase();
        
        setupActions();
        loadEvent();
    } else {
        alert("Sadece Asya geziye katılabilir!");
    }
}

function setupActions() {
    document.getElementById("kissBtn").onclick = () => {
        if(isProcessing) return;
        hasKiss = true; kissCounter++; slapCounter = 0;
        if(kissCounter >= 5) {
            secretEnd("Ömer mutluluktan bayıldı! Kalbi bu kadar sevgiyi kaldıramadı. Gezi iptal. ❤️‍🔥");
        } else {
            handleSpecial("Ömer'i öptün! ❤️", 1, "mutlu.jpg");
        }
    };
    document.getElementById("slapBtn").onclick = () => {
        if(isProcessing) return;
        hasSlap = true; slapCounter++; kissCounter = 0;
        if(slapCounter >= 5) {
            secretEnd("Ömer tokat yemekten bayıldı! Gezi iptal, disipline sevk edildin! 😵‍💫");
        } else {
            handleSpecial("Ömer'e tokat attın! 😲", -1, "sinirli.jpg");
        }
    };
}

function handleSpecial(msg, pts, img) {
    isProcessing = true;
    love += pts;
    document.getElementById("love").innerText = love;
    document.getElementById("eventBox").innerText = msg;
    updateCharacterImage(img);
    setTimeout(nextTurn, 1000);
}

function secretEnd(message) {
    isProcessing = true;
    document.getElementById("eventBox").innerText = message;
    document.querySelector(".special-actions").style.display = "none";
    updateCharacterImage("uzgun.jpg");
    document.getElementById("cards").innerHTML = '<button onclick="location.reload()">TEKRAR DENE</button>';
}

function loadEvent() {
    isProcessing = false;
    const cards = document.getElementById("cards");
    cards.innerHTML = "";
    if(turn >= maxTurn) { endGame(); return; }

    const pool = eventPool[locations[currentLocationIndex].name];
    const evt = pool[Math.floor(Math.random() * pool.length)];
    document.getElementById("eventBox").innerText = evt.text.replace("[NAME]", playerName);

    evt.options.sort(() => Math.random() - 0.5).forEach(opt => {
        const btn = document.createElement("button");
        btn.innerText = opt.text;
        btn.onclick = () => {
            if(isProcessing) return;
            isProcessing = true;
            kissCounter = 0; slapCounter = 0;
            love += opt.love;
            document.getElementById("love").innerText = love;
            updateCharacterImage(opt.img);
            setTimeout(nextTurn, 1000);
        };
        cards.appendChild(btn);
    });
}

function nextTurn() {
    turn++;
    document.getElementById("progressBar").style.width = (turn/maxTurn*100) + "%";
    if(turn === 5) changeLocation(1);
    else if(turn === 10) changeLocation(2);
    loadEvent();
}

function changeLocation(idx) {
    currentLocationIndex = idx;
    document.querySelector(".game-screen").style.backgroundColor = locations[idx].color;
    document.getElementById("locationLabel").innerText = locations[idx].name.toUpperCase();
}

function endGame() {
    const eb = document.getElementById("eventBox");
    const cd = document.getElementById("cards");
    cd.innerHTML = "";
    document.querySelector(".special-actions").style.display = "none";
    
    if(love >= 50) {
        updateCharacterImage("mutlu.jpg");
        eb.innerText = "💖 Ömer: 'Asya, bu gezi hayatımın en güzel günüydü. Seni seviyorum!'";
    } else {
        updateCharacterImage("uzgun.jpg");
        eb.innerText = 'Ömer: "Aramıza dağlar girse de seni sevmeye devam edeceğim..."';
    }
    cd.innerHTML = '<button onclick="location.reload()">BAŞA DÖN</button>';
}

window.onload = () => {
    document.getElementById("startBtn").addEventListener("click", startGame);
};