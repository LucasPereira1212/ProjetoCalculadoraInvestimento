const isNonEmptyArray = (arrayElement) =>
  Array.isArray(arrayElement) && arrayElement.length > 0;

export const createTable = (collunsArray, dataArray, tableId) => {
  if (
    !isNonEmptyArray(collunsArray) ||
    !isNonEmptyArray(dataArray) ||
    !tableId
  ) {
    throw new Error(
      "Para a correta execução, precisamos de um array com colunas, outro com as informações das linhas e também o id do elemento tabela selecionado "
    );
  }
  const tableElement = document.getElementById(tableId);
  if (!tableElement || tableElement.nodeName !== "TABLE") {
    throw new Error("Id informado não corresponde a nenhum elemento table ");
  }

  createTableHeader(tableElement, collunsArray);
  createTableBody(tableElement, dataArray, collunsArray);
};

function createTableHeader(tableReference, columnsArray) {
  function creatTheadElement(tableReference) {
    const thead = document.createElement("thead");
    tableReference.appendChild(thead);
    return thead;
  }
  const tableHeaderReference =
    tableReference.querySelector("thead") ?? creatTheadElement(tableReference);

  const headerRow = document.createElement("tr");

  ["bg-blue-900", "text-slate-200", "sticky", "top-0"].forEach((cssClass) =>
    headerRow.classList.add(cssClass)
  );
  for (const tableColumnsObject of columnsArray) {
    const headerElement = /*html*/ `<th class="text-center" >${tableColumnsObject.columnLabel}</th>`;
    headerRow.innerHTML += headerElement;
  }

  tableHeaderReference.appendChild(headerRow);
}
function createTableBody(tableReference, tableItems, columnsArray) {
  function creatTbodyElement(tableReference) {
    const tbody = document.createElement("tbody");
    tableReference.appendChild(tbody);
    return tbody;
  }
  const tableBodyReference =
    tableReference.querySelector("tboby") ?? creatTbodyElement(tableReference);

  for (const [itemIndex, tableItem] of tableItems.entries()) {
    const tableRow = document.createElement("tr");
    if (itemIndex % 2 !== 0) {
      tableRow.classList.add("bg-blue-200");
    }
    for (const tableColums of columnsArray) {
      const formatFn = tableColums.format ?? ((info) => info);
      tableRow.innerHTML += /*html*/ `<td class="text-center" >${formatFn(
        tableItem[tableColums.accessor]
      )}</td>`;
    }
    tableReference.appendChild(tableRow);
  }
}
