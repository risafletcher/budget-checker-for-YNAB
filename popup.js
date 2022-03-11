// Event handling
const port = chrome.runtime.connect({ name: 'background' });
port.onMessage.addListener(({ type, payload }) => {
    switch (type) {
        case 'fetchBudgetsSuccess':
            createBudgetsMenu(payload);
        case 'fetchBudgetSuccess':
            createBudgetContent(payload);
            break;
        default:
            break;
    }
});

// DOM manipulation
const mainContainer = document.getElementById('main');

function createBudgetsMenu(budgets = []) {
    const selectMenu = document.createElement('select');
    budgets.forEach((budget) => {
        const menuOption = document.createElement('option');
        menuOption.id = budget.id;
        menuOption.value = budget.name;
        menuOption.innerText = budget.name;
        selectMenu.appendChild(menuOption);
    });
    menuContainer.appendChild(selectMenu);
}

function createBudgetContent(budget) {
    const container = document.createElement('div');
    const header = document.createElement('h1');
    header.innerText = budget.name;
    container.appendChild(header);
}