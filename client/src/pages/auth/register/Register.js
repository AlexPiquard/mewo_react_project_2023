import styles from "../../../layouts/auth/auth_layout.module.css"
import {Form, NavLink, redirect, useActionData, useNavigation} from "react-router-dom";
import AuthLayout from "../../../layouts/auth/AuthLayout";
import LoadingButton from "../../../components/LoadingButton";
import ErrorLine from "../../error/ErrorLine";

export function action(formData, onLogged) {
    const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    };

    return fetch(process.env.REACT_APP_SERVER_URL + "/auth/register", {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
        },
        body: JSON.stringify(data),
    }).then(response => {
        return response.json().then(json => {
            if (!response.ok) return json;
            onLogged(json);
            return redirect("/")
        })
    }).catch(error => false);
}

function Register() {
    const actionData = useActionData();
    const navigation = useNavigation();

    return (
        <AuthLayout>
            <img src={require('../../../assets/logo.png')} alt={"Logo"}/>
            <div className={styles.form_container}>
                <Form method={"post"} className={styles.form}>
                    <div className={styles.inputs}>
                        <input type={"email"} placeholder={"Adresse email"} name={"email"} required/>

                        <input type={"password"} placeholder={"Mot de passe"} name={"password"} required/>

                        <input type={"text"} placeholder={"Nom"} name={"name"} required/>
                    </div>

                    <LoadingButton type={"submit"} loading={navigation.state === "submitting"}>Inscription</LoadingButton>
                </Form>
                {actionData?.message && <ErrorLine errorMessage={actionData?.message}/>}
                <NavLink to={"/auth/login"}>Déjà un compte ? Connectez-vous</NavLink>
            </div>
        </AuthLayout>
    )
}

Register.propTypes = {}

export default Register;