import styles from "./home.module.css";
import {NavLink, Outlet, redirect, useLoaderData, useNavigate, useNavigation} from "react-router-dom";
import {useContext} from "react";
import {disconnect, getAuthorizationHeader} from "../../components/Account";
import {AccountContext, ThemeContext} from "../../App";
import Error from "../error/Error";
import Loading from "../../components/Loading";
import {UilPlus, UilSignOutAlt} from "@iconscout/react-unicons";

export function loader(account, logging) {
    // Si le compte n'est pas encore chargé, on ne fait rien.
    if (!account) return null;
    // Si le compte est chargé mais inexistant, on redirige vers la page de connexion.
    // Si une connexion est en cours, on ne redirige pas.
    if (!account?.user?.id && !logging) return redirect("/auth/login");
    // Charger toutes les discussions existantes.
    return fetch(process.env.REACT_APP_SERVER_URL + "/users/"+account.user.id+"/discussions", {
        method: "GET",
        headers: Object.assign({
            'Content-Type': 'application/json',
        }, getAuthorizationHeader(account))
    }).then(response => response.json());
}

function Home() {
    const {account} = useContext(AccountContext);
    const {theme} = useContext(ThemeContext);

    return <div className={styles.container}>
        <div className={styles.navbar + " " + theme}>
            <LoggedAccount/>
            {account && <Discussions/>}
        </div>
        <div className={styles.content}>
            <Outlet context={account}/>
        </div>
    </div>
}

Home.propTypes = {}

function LoggedAccount() {
    const {account, onAccountChange} = useContext(AccountContext);
    const navigate = useNavigate();

    if (account?.user) return (
        <div className={styles.account}>
            <div className={styles.avatar} onClick={() => navigate("/users/"+account.user.id)}>
                <img src="https://api.dicebear.com/5.x/big-smile/svg?backgroundColor=d1d4f9" alt="avatar"/>
                <p>{account.user.name}</p>
            </div>
            <button onClick={() => disconnect(account, onAccountChange)}><UilSignOutAlt/></button>
        </div>
    );

    return <NavLink to={"/auth/login"}>Connexion</NavLink>;
}

LoggedAccount.propTypes = Home.propTypes;

function Discussions() {
    const discussions = useLoaderData();
    const navigation = useNavigation();
    const navigate = useNavigate();
    const theme = useContext(ThemeContext);

    // Si une erreur est survenue pendant le chargement : on l'affiche.
    if (discussions?.code) return <Error code={discussions.code} message={discussions.message}/>

    return <div className={styles.discussions_container}>
        <div className={styles.new} onClick={() => navigate("/discussions/new")}>
            <UilPlus/>
            Nouvelle discussion
        </div>
        <h1 className={theme}>DISCUSSIONS</h1>
        <Loading loading={navigation.state === "loading" || !discussions}>
            <div className={styles.discussions}>
                { discussions &&
                    discussions.map(discussion => <div className={styles.discussion} onClick={() => navigate("/discussions/"+discussion.id)} key={discussion.id}>
                        <h2>{discussion.title.substring(0, 50) + (discussion.title.length > 50 ? "..." : "")}</h2>
                        <p>{discussion.description.substring(0, 50) + (discussion.description.length > 50 ? "..." : "")}</p>
                    </div>)
                }
            </div>
        </Loading>
    </div>
}

Discussions.propTypes = {};

export default Home;