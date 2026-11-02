export const STORAGE_KEYS = {
  ACCESS_TOKEN: "fintrack_token",
};

const KEY = STORAGE_KEYS.ACCESS_TOKEN;

export const getAccessToken = () => localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);

export const clearAccessToken = () => {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
};

// remember = true  : localStorage, la session survit à la fermeture du navigateur
// remember = false : sessionStorage, la session disparaît à la fermeture de l'onglet
export const saveAccessToken = (token, remember = false) => {
    clearAccessToken();
    (remember ? localStorage : sessionStorage).setItem(KEY, token);
};