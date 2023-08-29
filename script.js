// 웹페이지에 바로 띄우기 위함
const messageContainer = document.querySelector("#d-day-message");
const container = document.querySelector("#d-day-container");
const savedDate = localStorage.getItem("saved-date");

const intervalIdArr = []; // 타이머 초기화 시 함수 돌리기 위한 변수 선언

const dateFormMaker = function () {
  const inputYear = document.querySelector("#target-year-input").value;
  const inputMonth = document.querySelector("#target-month-input").value;
  const inputDate = document.querySelector("#target-date-input").value;

  return inputYear + "-" + inputMonth + "-" + inputDate;
};

const counterMaker = function (data) {
  if (data !== savedDate) {
    localStorage.setItem("saved-date", data); // 키 벨류 형태로 로컬스트리지에 저장됨.
  }
  const nowDate = new Date();
  const targetDate = new Date(data).setHours(0, 0, 0, 0); // 자정을 기준으로 계산
  const remaining = (targetDate - nowDate) / 1000; // 초단위로 변환
  // 만약, remaining이 0이라면, 타이머가 종료 되었습니다. 출력
  if (remaining <= 0) {
    container.style.display = "none";
    messageContainer.innerHTML = "<h3>타이머가 종료되었습니다.</h3>";
    messageContainer.style.display = "flex";
    setClearInterval();
    return; // 뒤의 코드 진행되지 않게 함수 종료
  } else if (isNaN(remaining)) {
    container.style.display = "none";
    messageContainer.innerHTML = "<h3>유효한 시간대가 아닙니다.</h3>";
    // 만약, 잘못된 날짜가 들어왔다면, 유효한 시간대가 아닙니다. 출력
    messageContainer.style.display = "flex";
    setClearInterval();
    return; // 뒤의 코드 진행되지 않게 함수 종료
  }

  const remainingObj = {
    remainingDate: Math.floor(remaining / 3600 / 24), // 남은 날짜
    remainingHours: Math.floor(remaining / 3600) % 24, // 남은 시간
    remainingMin: Math.floor(remaining / 60) % 60, // 남은 분
    remainingSec: Math.floor(remaining % 60), // 남은 초
  };

  const documentArr = ["days", "hours", "min", "sec"];
  const timeKeys = Object.keys(remainingObj); // 변수에 담음으로 브라켓 로테이션 활용

  const format = function (time) {
    // 숫자가 10 미만으로 떨어질때 08,09초 등의 형태로 나오게 포맷
    if (time < 10) {
      return "0" + time;
      // 아닌경우 그대로 반환
    } else {
      return time;
    }
  };

  let i = 0;
  for (let tag of documentArr) {
    const remainingTime = format(remainingObj[timeKeys[i]]);
    // remainingObj[timeKeys[i]] -> 포맷함수의 전달인자로 활용
    document.getElementById(tag).textContent = remainingTime;
    i++;
  }
};

const starter = function (targetDateInput) {
  if (!targetDateInput) {
    targetDateInput = dateFormMaker();
  }
  //inputYear + "-" + inputMonth + "-" + inputDate; 담김
  container.style.display = "flex";
  messageContainer.style.display = "none";
  setClearInterval(); // 기존 인터벌 삭제
  //setInterval(() => {counterMaker()},1000)
  counterMaker(targetDateInput);
  const intervalId = setInterval(() => counterMaker(targetDateInput), 1000); // 1초마다 함수 반복실행, 함수 뒤에 소괄호 X
  //setInterval(counterMaker(targetDateInput), 1000) 형태가 아닌 화살표 함수로 넣어야 1초마다 반복이 실행됨
  intervalIdArr.push(intervalId);
};
//setInterval 은 반복될때마다 고유한 아이디값을 반환함 1,2,3 ...
//시작버튼을 새로 누르기 전까지는 기존 데이터를 기준으로 카운트 진행됨.

const setClearInterval = function () {
  for (let i = 0; i < intervalIdArr.length; i++) {
    clearInterval(intervalIdArr[i]); // setInterval 아이디값 만큼 실행해야 종료됨.
  }
};

const resetTimer = function () {
  container.style.display = "none"; // dday 표시되는 숫자 없어짐
  messageContainer.innerHTML = "<h3>d-day를 입력해 주세요.</h3>";
  messageContainer.style.display = "flex"; // dday입력해주세요 표시됨
  localStorage.removeItem("saved-date");
  setClearInterval();
};

if (savedDate) {
  starter(savedDate);
} else {
  container.style.display = "none";
  messageContainer.innerHTML = "<h3>d-day를 입력해 주세요.</h3>";
}

// setClearInterval에 코드를 다 밀어넣으면 counterMaker함수의 if문에서도
// setClearInterval 함수를 사용함으로 표시되는 html 작동에 오류가 생기기 때문에
// 별도로 resetTimer 함수를 만들고 그 안에 setClearInterval 함수를 작동시켜 오류 없앰

//   const documentObj = {
//     days: document.getElementById("days"),
//     hours: document.getElementById("hours"),
//     min: document.getElementById("min"),
//     sec: document.getElementById("sec"),
//   };

//   1.
//   documentObj["days"].textContent = remainingObj["remainingDate"];
//   documentObj["hours"].textContent = remainingObj["remainingHours"];
//   documentObj["min"].textContent = remainingObj["remainingMin"];
//   documentObj["sec"].textContent = remainingObj["remainingSec"];

//   2.
//   for (let i = 0; i < timeKeys.length; i++) {
//     documentObj[docKeys[i]].textContent = remainingObj[timeKeys[i]];
//     // 브라켓 로테이션 방식, docKeys는 변수이므로 키가 아닌 변수로서 호출
//     // document.getElementById("days") 태그가 순차적으로 불러와짐
//   }

//   3.
//   let i = 0;
//   for (let key in documentObj) {
//     documentObj[key].textContent = remainingObj[timeKeys[i]];
//     i++;
//   }
