import { ICryptoDataService } from "./cryptoServiceTypes";
import { currency, token } from "../models/transaction";
const axios = require('axios').default;

const multiExchangeRateUrl = 'https://min-api.cryptocompare.com/data/pricemulti';

const cryptoCompareApiConfig = {
    headers: {
        'Content-Type': 'application/json',
        'auth-key': process.env.CRYPTO_COMPARE_AUTH_KEY,
    }
};

export function cryptoCompare(): ICryptoDataService {

    const getExchangeRates = async (tokens: token[], currencies: currency[]): Promise<Map<token, Map<currency, number>>> => {
        const fsyms = tokens.join(",");
        const tsyms = currencies.join(",");
        try {
            const response = await axios.post(multiExchangeRateUrl, { fsyms, tsyms }, cryptoCompareApiConfig);
            return response.data;
        } catch (ex) {
            console.error(`Error occurred while trying to fetch exchange rates. 
                           Tokens: ${JSON.stringify(tokens)}, Currencies: ${JSON.stringify(currencies)}`, ex);
            throw new Error("Error occurred because exhange rates cannot be fetched via crypto compare.");
        }
    }

    return {
        getExchangeRates,
    }
}