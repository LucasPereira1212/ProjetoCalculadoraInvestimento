import { generateReturnArray } from "./src/investmentGoals.js";

const form = document.getElementById("investment-form");
const clearFormButton = document.getElementById("clear-form");

function renderProgression(event) {
  event.preventDefault();
  if (document.querySelector(".border-2")) {
    return;
  }
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

  console.log(returnsArray);
}

function clearForm() {
  form["starting-amount"].value = "";
  form["additional-contribution"].value = "";
  form["time-amount"].value = "";
  form["return-rate"].value = "";
  form["tex-rate"].value = "";

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

form.addEventListener("submit", renderProgression);
clearFormButton.addEventListener("click", clearForm);
