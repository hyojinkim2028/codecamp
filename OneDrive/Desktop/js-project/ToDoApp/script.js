const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");

const savedTodoList = JSON.parse(localStorage.getItem("saved-items"));
// 문자열로 변환된 데이터가 제이슨 데이터 포맷을 가지고 있다면 다시 원본 형태로 변환

const createTodo = function (storageData) {
  // storageData -> savedTodoList[i]

  let todoContents = todoInput.value;
  if (storageData) {
    todoContents = storageData.contents;
  }

  const newLi = document.createElement("li");
  const newSpan = document.createElement("span");
  const newBtn = document.createElement("button");

  newBtn.addEventListener("click", () => {
    newLi.classList.toggle("complete");
    saveItemsFn();
  });

  newLi.addEventListener("dblclick", () => {
    newLi.remove();
    saveItemsFn();
  });

  if (storageData?.complete) {
    // storageData 값이 null이나 undifined의 경우 complete값을 찾지 않음. -> 조건식 실행 X (? : 옵셔널체이닝)
    newLi.classList.add("complete");
  }

  newSpan.textContent = todoContents;
  newLi.appendChild(newBtn);
  newLi.appendChild(newSpan); // 하위 태그 추가
  todoList.appendChild(newLi); // todo에 적은 것 엔터 치면 새로운 li 추가되며 리스트 업데이트됨
  todoInput.value = ""; // 업데이트 후 텍스트 박스 비우기
  saveItemsFn();
};

const keyCodeCheak = function () {
  if (window.event.keyCode === 13 && todoInput.value !== "") {
    createTodo();
  }
};

const deleteAll = function () {
  const liList = document.querySelectorAll("li"); // li태그 전체선택
  for (let i = 0; i < liList.length; i++) {
    liList[i].remove();
  }
  saveItemsFn(); // 삭제 후 저장
};

const saveItemsFn = function () {
  const saveItems = [];
  for (let i = 0; i < todoList.children.length; i++) {
    // li태그 갯수만큼 반복
    const todoObj = {
      contents: todoList.children[i].querySelector("span").textContent,
      complete: todoList.children[i].classList.contains("complete"),
      // li 태그에 complete class가 존재하는지 확인해서 담아줌
    };
    saveItems.push(todoObj);
  }

  saveItems.length === 0
    ? localStorage.removeItem("saved-items")
    : localStorage.setItem("saved-items", JSON.stringify(saveItems));
};
//로컬스토리지에 저장하려면 문자열 형태여야함, 객체는 String 문법 사용X
//JSON을 활용함.

if (savedTodoList) {
  for (let i = 0; i < savedTodoList.length; i++) {
    createTodo(savedTodoList[i]);
  }
}

const weatherSearch = function (position) {
  console.log(position.latitude);
  const openWeatherRes = fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${position.latitude}&lon=${position.longitude}&appid=3732efbe33fd7e71c9ef06290ead3abc`
  );
  console.log(openWeatherRes);
};

const accessToGeo = function (position) {
  const positionObj = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
  weatherSearch(positionObj);
};

const askForLocation = function () {
  navigator.geolocation.getCurrentPosition(accessToGeo, (err) => {
    console.log(err);
  });
};

askForLocation();
