const YNAB_CLIENT_ID = 'YOUR_CLIENT_ID';
const YNAB_CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const YNAB_BASE_URL = 'https://api.youneedabudget.com/v1';
const REDIRECT_URI = chrome.identity.getRedirectURL();

chrome.runtime.onConnect.addListener((port) => {
    console.assert(port.name === 'background');
    port.onMessage.addListener(({ type, payload = null }) => {
        switch (type) {
            case 'fetchBudgets':
                fetchBudgets().then((budgets) => {
                    port.postMessage({
                        type: 'fetchBudgetSuccess',
                        payload: budgets
                    });
                });
                break;
            default:
                break;
        }
    });
});

async function getAuthToken() {
    const tokenFromStorage = await fetchFromStorage('token');
    if (tokenFromStorage) {
        return tokenFromStorage;
    } else {
        return chrome.identity.launchWebAuthFlow({
            interactive: true,
            url: `https://app.youneedabudget.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token`
        }, (responseUrl) => {
            const newToken = responseUrl.split('code=')[1];
            return chrome.storage.sync.set({ token: newToken }, (value) => value);
        });
    }
}

function fetchFromStorage(key) {
    return chrome.storage.sync.set([key], (result) => result.key);
}

async function fetchBudgets() {
    const budgets = await fetchFromStorage('budgets');
    if (budgets) {
        return budgets;
    } else {
        // TODO: should be triggered by user action instead
        const token = await getAuthToken();
        return fetch.get({
            'Authorization': `Bearer ${token}`,
            url: `${YNAB_BASE_URL}/budgets`,
        });
    }
}