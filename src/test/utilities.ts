import * as request from "request";

const savedIdTokens = new Map();

export function getIdToken(email: string, password: string, callback: (idToken: string) => void): void {
    if (savedIdTokens.get(email)) {
        callback(savedIdTokens.get(email));
    }
    request.post({
        body: JSON.stringify({ email, password, returnSecureToken: true }),
        headers: {
            "content-type": "application/json",
        },
        // tslint:disable-next-line:max-line-length
        url: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAvNCAOfMKNWbRIHwVxLHBtFtm9yHH6tBA",
    }, (error, response, body) => {
        if (error) {
            console.error(error);
            callback(null);
        } else {
            body = JSON.parse(body);
            const token = body.idToken;
            savedIdTokens.set(email, token);
            callback(token);
        }
    });
}
