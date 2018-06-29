import { AxiosPromise } from "axios";
import { MarqetaUser } from "../../models/MarqetaUser";
import { User } from "../../models/User";
export default class MarqetaClient {

    public addUser(user: User): AxiosPromise<any> {
        return Promise.resolve({
            config: null,
            data: {id: user.id},
            headers: {},
            status: 201,
            statusText: "Created",
          });
    }

    public updateUser(user: User): AxiosPromise<any> {
        return Promise.resolve({
            config: null,
            data: {id: user.id},
            headers: {},
            status: 200,
            statusText: "Updated",
          });
    }

    public getUser(id: string): AxiosPromise<MarqetaUser> {
        return Promise.resolve({
            config: null,
            data: {token: id},
            headers: {},
            status: 200,
            statusText: "Retrieved",
          });
    }
}
