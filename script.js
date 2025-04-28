// WebアプリとしてデプロイしたGASのURLをここに貼ってください
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxmSNvFncdjHsVcGRQXabm00dwD6IgP_zowe0xpZzbWVf9pV30TtQVDORJJB3zXrwWk/exec';

// ページを開いたときに実行
window.onload = function() {
    displayDogs();
    const saveButton = document.getElementById("saveButton");
    saveButton.onclick = saveNewDog;
};

// 新規保存
function saveNewDog() {
    const dog = getDogDataFromForm();

    if (!dog.name || !dog.appointment) {
        alert("必須項目（犬の名前・通院日）を入力してください。");
        return;
    }

    fetch(GAS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dog)
    })
    .then(response => response.json())
    .then(data => {
        alert("データを保存しました！");
        resetForm();
        displayDogs();
    })
    .catch(error => {
        console.error('保存エラー:', error);
    });
}

// 編集保存
function updateDog(index) {
    const dog = getDogDataFromForm();

    if (!dog.name || !dog.appointment) {
        alert("必須項目（犬の名前・通院日）を入力してください。");
        return;
    }

    // 一旦削除して保存し直す簡易方式
    deleteDog(index, false);
    setTimeout(() => {
        saveNewDog();
    }, 500);
}

// リスト表示
function displayDogs() {
    fetch(GAS_URL)
        .then(response => response.json())
        .then(dogs => {
            const dogList = document.getElementById("dogList");
            dogList.innerHTML = "";

            dogs.forEach((dog, index) => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <div>
                        ${dog.photo ? `<img src="${dog.photo}" alt="顔写真" style="width:80px;height:80px;border-radius:50%;">` : ""}
                        <p><strong>${dog.name}</strong>（${dog.breed || "犬種不明"}）</p>
                        <p>生年月日: ${dog.birthday || "不明"}</p>
                        <p>体温: ${dog.temperature ? dog.temperature + "℃" : "不明"}</p>
                        <p>体重: ${dog.weight ? dog.weight + "kg" : "不明"}</p>
                        <p>通院日: ${dog.appointment || "未定"}</p>
                        <p>マイクロチップ番号: ${dog.microchip || "なし"}</p>
                    </div>
                `;

                const editButton = document.createElement("button");
                editButton.textContent = "編集";
                editButton.style.margin = "5px";
                editButton.onclick = function() {
                    editDog(index, dogs);
                };

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "削除";
                deleteButton.style.margin = "5px";
                deleteButton.onclick = function() {
                    deleteDog(index);
                };

                li.appendChild(editButton);
                li.appendChild(deleteButton);
                dogList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('取得エラー:', error);
        });
}

// 削除
function deleteDog(index, reload = true) {
    fetch(GAS_URL)
        .then(response => response.json())
        .then(dogs => {
            dogs.splice(index, 1);

            const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('シート1');
            sheet.clearContents();
            sheet.appendRow(['Name', 'Birthday', 'Temperature', 'Weight', 'Breed', 'Microchip', 'PhotoURL', 'Appointment']);
            dogs.forEach(dog => {
                sheet.appendRow([
                    dog.name,
                    dog.birthday,
                    dog.temperature,
                    dog.weight,
                    dog.breed,
                    dog.microchip,
                    dog.photo,
                    dog.appointment
                ]);
            });

            if (reload) {
                displayDogs();
            }
        });
}

// 編集開始
function editDog(index, dogs) {
    const dog = dogs[index];

    document.getElementById("dogName").value = dog.name;
    document.getElementById("birthday").value = dog.birthday || "";
    document.getElementById("temperature").value = dog.temperature || "";
    document.getElementById("weight").value = dog.weight || "";
    document.getElementById("breed").value = dog.breed || "";
    document.getElementById("microchip").value = dog.microchip || "";
    document.getElementById("photo").value = dog.photo || "";
    document.getElementById("appointment").value = dog.appointment || "";

    const saveButton = document.getElementById("saveButton");
    saveButton.textContent = "更新";
    saveButton.onclick = function() {
        updateDog(index);
    };
}

// フォームからデータを取る
function getDogDataFromForm() {
    return {
        name: document.getElementById("dogName").value,
        birthday: document.getElementById("birthday").value,
        temperature: document.getElementById("temperature").value,
        weight: document.getElementById("weight").value,
        breed: document.getElementById("breed").value,
        microchip: document.getElementById("microchip").value,
        photo: document.getElementById("photo").value,
        appointment: document.getElementById("appointment").value
    };
}

// フォームをリセット
function resetForm() {
    document.getElementById("dogForm").reset();
    const saveButton = document.getElementById("saveButton");
    saveButton.textContent = "保存";
    saveButton.onclick = saveNewDog;
}
