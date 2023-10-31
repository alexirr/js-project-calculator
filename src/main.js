const permutationButton = document.getElementById("permutation-button");
const placementButton = document.getElementById("placement-button");
const combinationsButton = document.getElementById("combinations-button");
const inputValues = document.getElementById("input-values");
const calculateButton = document.getElementById("calculate");
const historyButton = document.getElementById("show-history")
const historyList = document.getElementById("history-list")
let repetitionsCheckBox = document.getElementById("repeat-checkbox")
let answerArea = document.getElementById('answer')

let nInput = document.getElementById("n-input");
let mInput = document.getElementById("m-input");

const inputValuesHTMLForPermutation = `
        <label for="n-input"><h6>Значение n:</h6></label>
        <input id="n-input" type="number" class="display js-display" placeholder="0">
`

const inputValuesHTMLForPlacementAndCombinations = `
    <label for="n-input"><h6>Значение n:</h6></label>
        <input id="n-input" type="number" class="display js-display" placeholder="0">
        <label for="m-input"><h6>Значение m:</h6></label>
        <input id="m-input" type="number" class="display js-display" placeholder="0">
        <div class="permutations">
          <label class="permutation">с повторениями</label>
          <input type="checkbox" id ="repeat-checkbox" class="check__input">
        </div>
`

let typeOfOperation = 3

function renderInput(type) {
    if (type === 1) {
        inputValues.innerHTML = inputValuesHTMLForPermutation;
        nInput = document.getElementById("n-input");
    } else {
        inputValues.innerHTML = inputValuesHTMLForPlacementAndCombinations;
        nInput = document.getElementById("n-input");
        mInput = document.getElementById("m-input");
        repetitionsCheckBox = document.getElementById("repeat-checkbox")
    }
    typeOfOperation = type;
}

function factorial(n) {
    if (n === 1) {
        return 1
    }
    return n * factorial(n - 1)
}

function getHistory() {
    let history = localStorage.getItem("history")
    if (history === null) {
        history = []
        localStorage.setItem("history", JSON.stringify(history))
    } else {
        history = JSON.parse(history)
    }
    return history
}

function showHistory() {
    let history = getHistory()
    history.forEach((expression) => {
        historyList.insertAdjacentHTML("beforeend", `<li>${expression}</li>`)
    });
}

function sendExpression(expression) {
    let expressionObj = {
        expression: expression,
        time: (new Date()).getSeconds()
    }
    fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
            method: "POST",
            body: JSON.stringify(expressionObj)
        }
    )
        .then((response) => {
            alert("Данные сохранены")
        })
        .catch((error) => {
            alert("Ошибка ")
        })
}

function saveHistory(expression) {
    let history = getHistory()
    sendExpression(expression)
    history.push(expression)
    localStorage.setItem("history", JSON.stringify(history))
}

function renderAnswer(answer) {
    answerArea.innerHTML = `<p>Ответ: ${answer}</p>`
}

function calculatePermutation(n) {
    return factorial(n);
}

function calculatePlacement(n, m, isWithRepetitions) {
    let answer = 0
    if (isWithRepetitions) {
        answer = Math.pow(n, m);
    } else {
        answer = factorial(n) / factorial(n - m)
    }
    return answer;
}

function calculateCombinations(n, m, isWithRepetitions) {
    let answer = 0
    if (isWithRepetitions) {
        answer = factorial(n + m - 1) / (factorial(m) * factorial(n - 1));
    } else {
        answer = factorial(n) / (factorial(m) * factorial(n - m))
    }
    return answer;
}

function calculate() {
    let answer = 0;
    let expression = ""
    if (typeOfOperation === 1) {
        let n = +nInput.value
        answer = calculatePermutation(n)
        expression = `P(${n}) = ${answer}`;
    } else {
        let isWithRepetitions = repetitionsCheckBox.checked;
        let n = +nInput.value;
        let m = +mInput.value;
        if (typeOfOperation === 2) {
            answer = calculatePlacement(n, m, isWithRepetitions)
            if (isWithRepetitions) {
                expression = `(${m})|A|(${n}) = ${answer}`
            } else {
                expression = `(${m})A(${n}) = ${answer}`
            }
        } else {
            answer = calculateCombinations(n, m, isWithRepetitions)
            if (isWithRepetitions) {
                expression = `(${m})|C|(${n}) = ${answer}`
            } else {
                expression = `(${m})C(${n}) = ${answer}`
            }
        }
    }

    saveHistory(expression);
    renderAnswer(answer);
}

permutationButton.addEventListener('click', () => {
    renderInput(1)
});

placementButton.addEventListener('click', () => {
    renderInput(2)
});

combinationsButton.addEventListener('click', () => {
    renderInput(3)
});

calculateButton.addEventListener('click', () => {
    calculate();
})

historyButton.addEventListener('click', () => {
    if (historyButton.innerText === "Показать историю") {
        historyButton.innerText = "Скрыть историю"
        showHistory()
    } else {
        historyButton.innerText = "Показать историю"
        historyList.innerHTML = ""
    }
})
