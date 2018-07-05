import axios from "axios";
const savedIdTokens = new Map();

export function getIdToken(email: string, password: string): Promise<string> {
    if (savedIdTokens.get(email)) {
        return Promise.resolve(savedIdTokens.get(email));
    }
    return axios.post(
        // tslint:disable-next-line:max-line-length
        "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAvNCAOfMKNWbRIHwVxLHBtFtm9yHH6tBA",
        { email, password, returnSecureToken: true },
        {
            headers: {
                "content-type": "application/json",
            },
        })
        .then((response) => {
            const token = response.data.idToken;
            savedIdTokens.set(email, token);
            return token;
        })
        .catch((err) => {
            console.error(err);
            return Promise.reject(err);
        });
};
