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

    let dogs = JSON.parse(localStorage.getItem("dogs")) || [];
    dogs.push(dog);
    localStorage.setItem("dogs", JSON.stringify(dogs));

    alert("データを保存しました！");
    resetForm();
    displayDogs();
}

// 編集保存
function updateDog(index) {
    const dog = getDogDataFromForm();

    if (!dog.name || !dog.appointment) {
        alert("必須項目（犬の名前・通院日）を入力してください。");
        return;
    }

    let dogs = JSON.parse(localStorage.getItem("dogs")) || [];
    dogs[index] = dog;
    localStorage.setItem("dogs", JSON.stringify(dogs));

    alert("データを更新しました！");
    resetForm();

    const saveButton = document.getElementById("saveButton");
    saveButton.textContent = "保存";
    saveButton.onclick = saveNewDog;

    displayDogs();
}

// リスト表示
function displayDogs() {
    const dogs = JSON.parse(localStorage.getItem("dogs")) || [];
    const dogList = document.getElementById("dogList");
    dogList.innerHTML = "";

    dogs.forEach((dog, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div>
                ${dog.photo ? `<img src="${dog.photo}" alt="顔写真" style="width:80px;height:80px;border-radius:50%;">` : ""}
                <p><strong>${dog.name}</strong>（${dog.breed || "犬種不明"}）</p>  <!-- ←ここでbreedを表示する！ -->
                <p>生年月日: ${dog.birthday || "不明"}</p>
                <p>体温: ${dog.temperature ? dog.temperature + "℃" : "不明"}</p>
                <p>体重: ${dog.weight ? dog.weight + "kg" : "不明"}</p>
                <p>通院日: ${dog.appointment || "未定"}</p>
                <p>マイクロチップ番号: ${dog.microchip || "なし"}</p>
            </div>
        `;

        // 編集ボタン
        const editButton = document.createElement("button");
        editButton.textContent = "編集";
        editButton.style.margin = "5px";
        editButton.onclick = function() {
            editDog(index);
        };

        // 削除ボタン
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
}

// 削除
function deleteDog(index) {
    let dogs = JSON.parse(localStorage.getItem("dogs")) || [];
    dogs.splice(index, 1);
    localStorage.setItem("dogs", JSON.stringify(dogs));
    displayDogs();
}

// 編集開始
function editDog(index) {
    const dogs = JSON.parse(localStorage.getItem("dogs")) || [];
    const dog = dogs[index];

    document.getElementById("dogName").value = dog.name;
    document.getElementById("birthday").value = dog.birthday || "";
    document.getElementById("temperature").value = dog.temperature || "";
    document.getElementById("weight").value = dog.weight || "";
    document.getElementById("furColor").value = dog.furColor || "";
    document.getElementById("microchip").value = dog.microchip || "";
    document.getElementById("photo").value = dog.photo || "";
    document.getElementById("appointment").value = dog.appointment || "";

    const saveButton = document.getElementById("saveButton");
    saveButton.textContent = "更新";
    saveButton.onclick = function() {
        updateDog(index);
    };
}

// フォームからデータをまとめて取る
function getDogDataFromForm() {
    return {
        name: document.getElementById("dogName").value,
        birthday: document.getElementById("birthday").value,
        temperature: document.getElementById("temperature").value,
        weight: document.getElementById("weight").value,
        breed: document.getElementById("breed").value, // ここを修正！！
        microchip: document.getElementById("microchip").value,
        photo: document.getElementById("photo").value,
        appointment: document.getElementById("appointment").value
    };
}

// フォームリセット
function resetForm() {
    document.getElementById("dogForm").reset();
}
