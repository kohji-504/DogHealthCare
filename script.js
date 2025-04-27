// ページを開いたときに実行される処理
window.onload = function() {
    displayDogs();
    const saveButton = document.getElementById("saveButton");
    saveButton.onclick = saveNewDog;
};

// 新しくデータを保存する関数
function saveNewDog() {
    const dogName = document.getElementById("dogName").value;
    const appointment = document.getElementById("appointment").value;

    if (dogName === "" || appointment === "") {
        alert("すべてのフィールドを入力してください。");
        return;
    }

    let dogs = JSON.parse(localStorage.getItem("dogs")) || [];
    dogs.push({ name: dogName, appointment: appointment });
    localStorage.setItem("dogs", JSON.stringify(dogs));

    alert("データを保存しました！");
    displayDogs();
    document.getElementById("dogForm").reset();
}

// 登録済みのデータを表示する関数
function displayDogs() {
    let dogs = JSON.parse(localStorage.getItem("dogs")) || [];
    const dogList = document.getElementById("dogList");
    dogList.innerHTML = "";

    dogs.forEach((dog, index) => {
        let li = document.createElement("li");
        li.textContent = `${dog.name} - 通院日: ${dog.appointment}`;

        // 編集ボタン
        let editButton = document.createElement("button");
        editButton.textContent = "編集";
        editButton.style.marginLeft = "10px";
        editButton.onclick = function() {
            editDog(index);
        };

        // 削除ボタン
        let deleteButton = document.createElement("button");
        deleteButton.textContent = "削除";
        deleteButton.style.marginLeft = "10px";
        deleteButton.onclick = function() {
            deleteDog(index);
        };

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        dogList.appendChild(li);
    });
}

// データを削除する関数
function deleteDog(index) {
    let dogs = JSON.parse(localStorage.getItem("dogs")) || [];
    dogs.splice(index, 1); // index番目の1件を削除
    localStorage.setItem("dogs", JSON.stringify(dogs));
    displayDogs(); // リストを再描画
}

// データを編集するためにフォームにセットする関数
function editDog(index) {
    let dogs = JSON.parse(localStorage.getItem("dogs")) || [];
    const dog = dogs[index];

    // フォームに現在のデータを入れる
    document.getElementById("dogName").value = dog.name;
    document.getElementById("appointment").value = dog.appointment;

    // 保存ボタンを「更新モード」に切り替える
    const saveButton = document.getElementById("saveButton");
    saveButton.textContent = "更新";
    saveButton.onclick = function() {
        updateDog(index);
    };
}

// データを更新保存する関数
function updateDog(index) {
    let dogs = JSON.parse(localStorage.getItem("dogs")) || [];

    const dogName = document.getElementById("dogName").value;
    const appointment = document.getElementById("appointment").value;

    if (dogName === "" || appointment === "") {
        alert("すべてのフィールドを入力してください。");
        return;
    }

    // データ更新
    dogs[index] = { name: dogName, appointment: appointment };
    localStorage.setItem("dogs", JSON.stringify(dogs));

    alert("データを更新しました！");

    // 保存ボタンを元に戻す
    const saveButton = document.getElementById("saveButton");
    saveButton.textContent = "保存";
    saveButton.onclick = saveNewDog;

    displayDogs();
    document.getElementById("dogForm").reset();
}
