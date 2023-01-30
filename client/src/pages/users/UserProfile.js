import PropTypes from "prop-types";
import {Form, useActionData, useLoaderData, useNavigation} from "react-router-dom";
import Error from "../error/Error";
import {getAuthorizationHeader} from "../../components/Account";
import Loading from "../../components/Loading";
import LoadingButton from "../../components/LoadingButton";
import styles from "./user_profile.module.css"
import ErrorLine from "../error/ErrorLine";

export function action(formData, account, onAccountUpdate) {
    const data = {}

    // Construire l'objet détaillant les informations qui ont été modifiées dans le formulaire.
    if (formData?.get("name") && formData.get("name") != account?.user?.name) data["name"] = formData.get("name");
    if (formData?.get("email") && formData.get("email") != account?.user?.email) data["email"] = formData.get("email");
    if (formData?.get("password") && formData?.get("password").length > 0) data["password"] = formData.get("password");

    return fetch(process.env.REACT_APP_SERVER_URL+"/users/"+account?.user?.id, {
        method: "PATCH",
        headers: Object.assign({
            'Content-Type': 'application/json',
        }, getAuthorizationHeader(account)),
        body: JSON.stringify(data),
    }).then(response => {
        return response.json().then(json => {
            if (response.ok) onAccountUpdate(json);
            return json;
        })
    });
}

export function loader(userId, account) {
    // On possède déjà les informations de l'utilisateur connecté, pas besoin de faire une requête.
    // On s'assure juste qu'il s'agit bien de lui, on n'autorise pas à consulter les profils des autres.
    if (!account?.user?.id) return null;

    if (account.user.id == userId) return account;
    return {code: 401, message: "Unauthorized"};
}

function UserProfile() {
    const account = useLoaderData();
    const actionData = useActionData();
    const navigation = useNavigation();

    if (account?.code) return <Error code={account.code} message={account.message} />;

    return <div className={styles.profile_container}>
        <h1>Votre profil</h1>
        <Loading loading={navigation.state === "loading" || !account}>
            <Form method={"post"} className={styles.form}>
                <input type={"text"} placeholder={"Nom"} name={"name"} defaultValue={account?.user?.name}/>

                <input type={"email"} placeholder={"Adresse email"} name={"email"} defaultValue={account?.user?.email}/>

                <input type={"password"} placeholder={"Mot de passe"} name={"password"} defaultValue={account?.user?.password}/>

                <LoadingButton type={"submit"} loading={navigation.state === "submitting"}>
                    Sauvegarder
                </LoadingButton>
            </Form>
            {actionData?.message && <ErrorLine errorMessage={actionData?.message}/>}
        </Loading>
    </div>
}

UserProfile.propTypes = {
    account: PropTypes.object,
}

export default UserProfile;