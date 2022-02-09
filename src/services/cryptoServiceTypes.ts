import { currency, token } from "../models/transaction";

export interface ICryptoDataService {
    getExchangeRates: (tokens: token[], currencies: currency[]) => Promise<Map<token, Map<currency, number>>>;
}