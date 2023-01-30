const ACCOUNT_KEY = "account";

export function loadSavedAccount() {
    // Charger le compte sauvegardé en stockage local.
    const account = JSON.parse(localStorage.getItem(ACCOUNT_KEY));
    if (!account?.tokens) return {};

    // Vérifier que le token du compte n'a pas expiré.

    const expirationDate = new Date(account.tokens.access.expires);
    if (expirationDate.getTime() < new Date()) {
        // Si le token n'est plus valide, on supprime le compte sauvegardé pour redemander une authentification.
        saveAccount({});
        return null;
    }

    return account;
}

export function getAuthorizationHeader(account) {
    return {'Authorization': `Bearer ${account?.tokens?.access?.token}`};
}

export function saveAccount(account) {
    // Sauvegarder le compte connecté en stockage local.
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
}

/**
 * Mets à jour les informations d'utilisateur du compte, et retourne une copie du nouveau compte.
 * @param account - Le compte à modifier
 * @param user - Les informations d'utilisateur à mettre à jour.
 * @returns {any}
 */
export function updateAccountUser(account, user) {
    account.user = user;
    saveAccount(account);
    return Object.assign({}, account);
}

export async function disconnect(account, onAccountChange) {
    return await fetch(process.env.REACT_APP_SERVER_URL + "/auth/logout", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({refreshToken: account.tokens.refresh.token})
    }).then(response => {
        if (response.ok) {
            onAccountChange({});
            return null;
        }
        return response.json().then(json => json.message);
    });
}