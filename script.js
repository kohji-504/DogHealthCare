document.getElementById("saveButton").addEventListener("click", function() {
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
});

function displayDogs() {
    let dogs = JSON.parse(localStorage.getItem("dogs")) || [];
    const dogList = document.getElementById("dogList");
    dogList.innerHTML = "";

    dogs.forEach(dog => {
        let li = document.createElement("li");
        li.textContent = `${dog.name} - 通院日: ${dog.appointment}`;
        dogList.appendChild(li);
    });
}

window.onload = function() {
    displayDogs();
};
