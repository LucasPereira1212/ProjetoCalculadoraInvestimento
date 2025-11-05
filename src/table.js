const isNonEmptyArray = (arrayElement) =>
  Array.isArray(arrayElement) && arrayElement.length > 0;

const createTable = (collunsArray, dataArray, tableId) => {
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
  createTableBody();
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
  for (const tableColumnsObject of columnsArray) {
    const headerElement = /*html*/ `<th class="text-center" >${tableColumnsObject}</th>`;
    headerRow.innerHTML += headerElement;
  }

  tableHeaderReference.appendChild(headerRow);
}
function createTableBody() {}
