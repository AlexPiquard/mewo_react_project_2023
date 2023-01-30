import PropTypes from "prop-types";
import {getAuthorizationHeader} from "../../../components/Account";
import {Form, useActionData, useLoaderData, useNavigation} from "react-router-dom";
import styles from "./discussion.module.css";
import Error from "../../error/Error";
import Loading from "../../../components/Loading";
import LoadingButton from "../../../components/LoadingButton";
import {useContext} from "react";
import {AccountContext, ThemeContext} from "../../../App";
import {UilMessage} from "@iconscout/react-unicons";
import "../../../index.css"
import ErrorLine from "../../error/ErrorLine";

export function action(formData, account) {
    const data = {
        content: formData.get("content"),
        discussionId: formData.get("discussionId"),
    }

    return fetch(process.env.REACT_APP_SERVER_URL+"/comments", {
        method: "POST",
        headers: Object.assign({
            'Content-Type': 'application/json',
        }, getAuthorizationHeader(account)),
        body: JSON.stringify(data)
    }).then(response => {
        return response.json().then(json => {
            if (!response.ok) return json;
            return true;
        })
    }).catch(error => false);
}

/**
 * Charger les informations d'une discussion en effectuant deux requêtes simultanées :
 * - une pour obtenir les informations basiques de la discussion
 * - une deuxième pour obtenir les commentaires d'une discussion.
 * @returns {Promise<Awaited<Response>[]>}
 */
export function loader(discussionId, account) {
    // Définition d'une méthode commune de requête à l'api.
    const commonFetch = (url) => fetch(process.env.REACT_APP_SERVER_URL + url, {
        method: "GET",
        headers: Object.assign({
            'Content-Type': 'application/json',
        }, getAuthorizationHeader(account))
    });

    // Préparation de la récupération des informations de la discussion.
    const fetchDiscussion = commonFetch("/discussions/" + discussionId);
    // Préparation de la récupération des commentaires de la discussion.
    const fetchComments = commonFetch("/discussions/" + discussionId + "/comments");

    // Attendre la fin des deux requêtes et combiner les résultats.
    return Promise.all([fetchDiscussion, fetchComments]).then(([discussionResponse, commentsResponse]) => {
        // Si une erreur est survenue pendant la première requête, on la retourne.
        if (!discussionResponse.ok) return discussionResponse.json();
        // Si une erreur est survenue pendant la deuxième requête, on la retourne.
        if (!commentsResponse.ok) return commentsResponse.json();

        // On retourne une version combinée des valeurs JSON.
        return discussionResponse.json().then(discussionJson => commentsResponse.json().then(commentsJson => {
            return Object.assign({}, discussionJson, {comments: commentsJson});
        }))
    })
}

function Discussion() {
    const {account} = useContext(AccountContext);
    const {theme} = useContext(ThemeContext);
    const discussion = useLoaderData();
    const actionData = useActionData();
    const navigation = useNavigation();

    // Si une erreur est survenue pendant le chargement : on l'affiche.
    if (discussion?.code) return <Error code={discussion.code} message={discussion.message}/>

    return (
        <div className={styles.discussion_container}>
            <Loading loading={navigation.state === "loading"}>
                <div className={styles.main}>
                    <div className={styles.header + " "+ theme}>
                        <h1>{discussion.title}</h1>
                        <p className={styles.description}>{discussion.description}</p>
                    </div>
                    <div className={styles.comments}>
                        { discussion.comments &&
                            discussion.comments.map(comment => {
                                const mine = comment?.user?.email == account?.user?.email;
                                return <div className={styles.comment + " " + (mine ? styles.mine : "")}>
                                    {!mine && <p className={styles.author}>{comment?.user?.name}</p>}
                                    <p className={styles.text + " " + theme + " " + (mine ? styles.mine : "")} key={comment.id}>{comment.content}</p>
                                </div>
                            })
                        }
                    </div>
                    <div className={styles.new_comment + " " + theme}>
                        <Form method={"post"}>
                            <input type={"hidden"} name={"discussionId"} value={discussion.id}/>

                            <input type={"text"} placeholder={"Contenu"} name={"content"} required/>

                            <LoadingButton type={"submit"} loading={navigation.state === "submitting"}><UilMessage/></LoadingButton>
                        </Form>
                        {actionData?.message && <ErrorLine errorMessage={actionData?.message}/>}
                    </div>
                </div>
                <div className={styles.sidebar + " " + theme}>
                    <div className={styles.members}>
                        <h2>Membres</h2>
                        <ul>
                            {
                                discussion.users.map(user => <li key={user.id}>{user.name}</li>)
                            }
                        </ul>
                    </div>
                </div>
            </Loading>
        </div>
    )
}

Discussion.propTypes = {
    params: PropTypes.object,
}

export default Discussion;