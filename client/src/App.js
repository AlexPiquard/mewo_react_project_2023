import React, {createContext, useContext, useEffect, useState} from "react";
import {
    createBrowserRouter, redirect,
    RouterProvider, useNavigate, useNavigation,
} from "react-router-dom";
import Register, {action as registerAction} from './pages/auth/register/Register'
import Login, {action as loginAction} from "./pages/auth/login/Login";
import DiscussionEditor, {action as newDiscussionAction, loader as newDiscussionLoader} from './pages/discussions/new/DiscussionEditor';
import {loadSavedAccount, saveAccount, updateAccountUser} from "./components/Account";
import Home, {loader as discussionsLoader} from "./pages/home/Home";
import AppLayout from "./layouts/app/AppLayout";
import {getSavedTheme, saveTheme} from "./components/Theme";
import Discussion, {loader as discussionLoader, action as discussionAction} from "./pages/discussions/view/Discussion";
import UserProfile, {loader as userProfileLoader, action as userProfileAction} from "./pages/users/UserProfile";
import ErrorBoundary from "./components/ErrorBoundary";

export const AccountContext = createContext({
    account: null,
    onAccountChange: (account) => {},
})

export const ThemeContext = createContext({
    theme: "white",
    onThemeChange: () => {},
});

function App() {
    const [account, setAccount] = useState(null);
    const [theme, setTheme] = useState(getSavedTheme() ?? process.env.REACT_APP_DEFAULT_THEME);
    let logging = false; // Permet d'éviter d'être redirigé au login pendant une tentative de connexion, à cause du délai de sauvegarde du compte.

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Home/>,
            errorElement: <ErrorBoundary/>,
            loader: ({request, params}) => discussionsLoader(account, logging),
            children: [
                {
                    path: "/discussions",
                    children: [
                        {
                            path: "/discussions/new",
                            element: <DiscussionEditor/>,
                            loader: ({request, params}) => newDiscussionLoader(account),
                            action: async ({request, params}) => newDiscussionAction(await request.formData(), account)
                        },
                        {
                            path: "/discussions/:discussionId",
                            element: <Discussion/>,
                            loader: ({request, params}) => discussionLoader(params.discussionId, account),
                            action: async ({request, params}) => discussionAction(await request.formData(), account)
                        }
                    ]
                },
                {
                    path: "/users",
                    children: [
                        {
                            path: "/users/:userId",
                            element: <UserProfile/>,
                            loader: ({request, params}) => userProfileLoader(params.userId, account),
                            action: async ({request, params}) => userProfileAction(await request.formData(), account, onAccountUpdate),
                        }
                    ]
                }
            ]
        },
        {
            path: "/auth/register",
            element: <Register/>,
            action: async ({request, params}) => registerAction(await request.formData(), onAccountChange.bind(this)),
        },
        {
            path: "/auth/login",
            element: <Login/>,
            action: ({request, params}) => loginAction(request, onAccountChange.bind(this)),
        },
    ])

    useEffect(() => {
        // Chargement du compte lors du premier chargement.
        setAccount(loadSavedAccount());
    }, []);

    /**
     * Evénement effectué lorsque le thème global est modifié par l'utilisateur.
     */
    const onThemeChange = () => {
        const newTheme = theme === "white" ? "black" : "white";
        setTheme(newTheme);
        saveTheme(newTheme);
    }

    /**
     * Evenement effectué lors d'une connexion ou déconnexion.
     * @param account
     */
    const onAccountChange = (account) => {
        setAccount(account);
        saveAccount(account);
        logging = true;
    }

    /**
     * Evenement effectué lorsque les informations des comptes sont modifiées.
     * @param user
     */
    const onAccountUpdate = (user) => {
        const newAccount = updateAccountUser(account, user);
        saveAccount(newAccount);
    }

    return <ThemeContext.Provider value={{theme: theme, onThemeChange: onThemeChange.bind(this)}}>
        <AccountContext.Provider value={{account: account, onAccountChange: onAccountChange.bind(this)}}>
            <AppLayout>
                <RouterProvider router={router}/>
            </AppLayout>
        </AccountContext.Provider>
    </ThemeContext.Provider>;
}

export default App;
