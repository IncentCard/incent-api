export interface MarqetaUser {
    token: string;

    // optional fields
    first_name?: string;
    last_name?: string;
    address1?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    birth_date?: string;
    ssn?: string;
}
