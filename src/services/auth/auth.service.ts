
export class AuthService {
    private isAuth: boolean = false;

    constructor() {

    }

    public isAuthorized() {
        return this.isAuth;
    }

    public signIn(email: string, password: string) {
        // add endpoint to sign in
    }
}