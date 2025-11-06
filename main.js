import { generateReturnArray } from "./src/investmentGoals.js";
import { Chart } from "chart.js/auto";
import { createTable } from "./src/table.js";

const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");
const form = document.getElementById("investment-form");
const clearFormButton = document.getElementById("clear-form");
let doughnutChartReferece = {};
let progessionChartReferece = {};

const columnsArray = [
  { columnLabel: "Mês", accessor: "month" },
  {
    columnLabel: "Total investido",
    accessor: "investedAmount",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Rendimento mensal",
    accessor: "interestReturns",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Rendimento total",
    accessor: "totalInterestReturns",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Quantia Total",
    accessor: "totalAmount",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
];

function formatCurrencyToTable(valeu) {
  return valeu.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatCurrencyToGraph(valeu) {
  return valeu.toFixed(2);
}

function renderProgression(event) {
  event.preventDefault();
  if (document.querySelector(".border-2")) {
    return;
  }
  resetCharts();
  const startingAmount = Number(
    document.getElementById("starting-amount").value.replace(",", ".")
  );
  const additionalContribution = Number(
    document.getElementById("additional-contribution").value.replace(",", ".")
  );
  const timeAmount = Number(document.getElementById("time-amount").value);
  const timeAmountPeriod = document.getElementById("time-amount-period").value;
  const returnRate = Number(
    document.getElementById("return-rate").value.replace(",", ".")
  );
  const returnRatePeriod = document.getElementById("evaluation-period").value;
  const taxRate = Number(
    document.getElementById("tex-rate").value.replace(",", ".")
  );

  const returnsArray = generateReturnArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );

  const finalInvestmentObject = returnsArray[returnsArray.length - 1];

  doughnutChartReferece = new Chart(finalMoneyChart, {
    type: "doughnut",
    data: {
      labels: ["Total investido", "Rendimento", "Imposto"],
      datasets: [
        {
          data: [
            formatCurrencyToGraph(finalInvestmentObject.investedAmount),
            formatCurrencyToGraph(
              finalInvestmentObject.totalInterestReturns * (1 - taxRate / 100)
            ),
            formatCurrencyToGraph(
              finalInvestmentObject.totalInterestReturns * (taxRate / 100)
            ),
          ],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    },
  });

  progessionChartReferece = new Chart(progressionChart, {
    type: "bar",
    data: {
      labels: returnsArray.map((investimentObject) => investimentObject.month),
      datasets: [
        {
          label: "Total investido",
          data: returnsArray.map(
            (investimentObject) => investimentObject.investedAmount
          ),
          backgroundColor: "rgb(255, 99, 132)",
        },
        {
          label: "Retorno de investimento",
          data: returnsArray.map(
            (investimentObject) => investimentObject.interestReturns
          ),
          backgroundColor: "rgb(54, 162, 235)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });

  createTable(columnsArray, returnsArray, "results-table");
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function resetCharts() {
  if (
    !isObjectEmpty(doughnutChartReferece) &&
    !isObjectEmpty(progessionChartReferece)
  ) {
    doughnutChartReferece.destroy();
    progessionChartReferece.destroy();
  }
}

function clearForm() {
  form["starting-amount"].value = "";
  form["additional-contribution"].value = "";
  form["time-amount"].value = "";
  form["return-rate"].value = "";
  form["tex-rate"].value = "";

  resetCharts();

  const errorInputsContainers = document.querySelectorAll(".border-2");

  for (const errorInputContainer of errorInputsContainers) {
    errorInputContainer.classList.remove("border-2");
    errorInputContainer.parentElement.querySelector("p").remove();
  }
}

function validateInput(event) {
  if (event.target.value === "") {
    return;
  }

  const { parentElement } = event.target;
  const grandParentElement = event.target.parentElement.parentElement;
  const inputValue = event.target.value.replace(",", ".");
  const elementHasThisClass = parentElement.classList.contains("border-2");

  if ((isNaN(inputValue) || Number(inputValue) <= 0) && !elementHasThisClass) {
    const errorTextElement = document.createElement("p");
    errorTextElement.classList.add("text-red-500");
    errorTextElement.innerText = "Insira um valor numérico e maior que zero";

    parentElement.classList.add("border-2");
    parentElement.classList.add("border-red-500");
    parentElement.classList.add("rounded-lg");
    grandParentElement.appendChild(errorTextElement);
  } else if (
    elementHasThisClass &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove("border-2");
    parentElement.classList.remove("border-red-500");
    parentElement.classList.remove("rounded-lg");
    grandParentElement.querySelector("p").remove();
  }
}

for (const formElement of form) {
  if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
    formElement.addEventListener("blur", validateInput);
  }
}

const maiEl = document.querySelector("main");
const caroselEl = document.getElementById("carousel");
const nextButton = document.getElementById("slide-arrow-next");
const previousButton = document.getElementById("slide-arrow-previous");

nextButton.addEventListener("click", () => {
  caroselEl.scrollLeft += maiEl.clientWidth;
});
previousButton.addEventListener("click", () => {
  caroselEl.scrollLeft -= maiEl.clientWidth;
});

form.addEventListener("submit", renderProgression);
clearFormButton.addEventListener("click", clearForm);
