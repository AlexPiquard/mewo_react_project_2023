export function saveTheme(theme) {
    // On sauvegarde le theme de l'utilisateur dans le stockage local.
    localStorage.setItem("theme", theme);
}

export function getSavedTheme() {
    // Obtenir le thème qui a été éventuellement sauvegardé pour cet utilisateur.
    return localStorage.getItem("theme");
}