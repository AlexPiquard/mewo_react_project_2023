import styles from "./discussion_editor.module.css";
import {Form, redirect, useActionData, useLoaderData, useNavigation} from "react-router-dom";
import {getAuthorizationHeader} from "../../../components/Account";
import Loading from "../../../components/Loading";
import Error from "../../error/Error";
import LoadingButton from "../../../components/LoadingButton";
import {useContext} from "react";
import {ThemeContext} from "../../../App";
import ErrorLine from "../../error/ErrorLine";

export function action(formData, account) {
    const data = {
        title: formData.get("title"),
        description: formData.get("description"),
        userIds: formData.getAll("users"),
    }

    return fetch(process.env.REACT_APP_SERVER_URL + "/discussions", {
        method: "POST",
        headers: Object.assign({
            'Content-Type': 'application/json',
        }, getAuthorizationHeader(account)),
        body: JSON.stringify(data),
    }).then(response => {
        return response.json().then(json => {
            if (!response.ok) return json;
            return redirect("/discussions/"+json.id)
        }).catch(error => false);
    })
}

export function loader(account) {
    // Charger les identifiants de tous les utilisateurs existants.
    return fetch(process.env.REACT_APP_SERVER_URL + "/users", {
        method: "GET",
        headers: Object.assign({
            'Content-Type': 'application/json',
        }, getAuthorizationHeader(account)),
    }).then(response => response.json())
}

function DiscussionEditor() {
    const actionData = useActionData();
    const users = useLoaderData();
    const navigation = useNavigation();
    const {theme} = useContext(ThemeContext);

    // Si une erreur est survenue pendant le chargement : on l'affiche.
    if (users?.code) return <Error code={users.code} message={users.message}/>

    return (
        <div className={styles.editor_container}>
            <h1>Nouvelle discussion</h1>
            <Form method={"post"} className={styles.form}>
                <input type={"text"} placeholder={"Titre"} name={"title"} required/>

                <input type={"text"} placeholder={"Description"} name={"description"} required/>

                <Loading loading={navigation.state === "loading"}>
                    <select multiple name={"users"} className={theme} required>
                        {
                            users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)
                        }
                    </select >
                </Loading>

                <LoadingButton type={"submit"} loading={navigation.state === "submitting"}>
                    Poster
                </LoadingButton>
            </Form>
            {actionData?.message && <ErrorLine errorMessage={actionData?.message}/>}
        </div>
    )
}

DiscussionEditor.propTypes = {};

export default DiscussionEditor;