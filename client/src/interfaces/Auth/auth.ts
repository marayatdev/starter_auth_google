export interface Login {
    email: string;
    password: string;
}

export interface Register {
    username: string;
    email: string;
    password: string;
}


export interface User {
    id?: number
    name?: string
    email?: string
    role?: string
}