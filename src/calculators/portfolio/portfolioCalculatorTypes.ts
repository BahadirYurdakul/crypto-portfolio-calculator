import { token } from "../../models/transaction";


export interface IBalanceCalculator {
    preProcess?: () => Promise<void>;
    getBalancePerToken: () => Promise<Map<token, number>>;
    getBalanceForToken: (token: token) => Promise<number>;
    getBalancePerTokenAtDate: (searchedDate: number) => Promise<Map<token, number>>;
    getBalanceForTokenAtDate: (searchedDate: number, token: token) => Promise<number>;
}