interface IRole {
    ADMIN: string;
    USER: string;
}

export interface IAuth {
    email: string;
    password: string;
    user_name: string;
    image: string;
    role?: IRole;
}