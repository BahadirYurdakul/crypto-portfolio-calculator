import {convertStringToTransaction} from "../../converters/transactionConverters";
import {token, Transaction} from "../../models/transaction";
import {removeTimeFromTimestamp} from "../../utils/timeUtils";
import {IBalanceCalculator} from "./portfolioCalculatorTypes";
import {binarySearchOnSorted} from "../../utils/arrayUtils";
import readline from 'readline';
import fs from 'fs';

export interface dayBalance {
    day: number;
    balance: number;
}

export function singleThreadPortfolioCalculator(filepath: string): IBalanceCalculator {

    const lineReader = readline.createInterface({
        input: fs.createReadStream(filepath),
    });

    let preProcessed: boolean = false;
    const tokenBalanceMap: Map<token, number> = new Map();
    const tokenDayBalanceMap: Map<token, dayBalance[]> = new Map();

    const preProcess = async (): Promise<void> => {
        let headerPassed = false;

        for await (let line of lineReader) {
            if(!headerPassed) {
                headerPassed = true;
                continue;
            }

            const transaction = convertStringToTransaction(line);
            addTrxToGeneralBalanceMap(transaction);
            addTrxToDayBalanceMap(transaction);
        }
        preProcessed = true;
    }

    async function preProcessIfNot(): Promise<void> {
        !preProcessed && await preProcess();
    }

    function addTrxToGeneralBalanceMap(transaction: Transaction) {
        const prevBalance = tokenBalanceMap.get(transaction.token)
        const newBalance = (prevBalance || 0) + transaction.calculatedBalance;
        tokenBalanceMap.set(transaction.token, newBalance);
        return !prevBalance;
    }

    function addTrxToDayBalanceMap(transaction: Transaction) {
        const transactionDate: number = removeTimeFromTimestamp(transaction.timestamp);
        const dayBalances: dayBalance[] | undefined = tokenDayBalanceMap.get(transaction.token);
        if (!dayBalances) {
            tokenDayBalanceMap.set(transaction.token, [{day: transactionDate, balance: transaction.calculatedBalance}]);
            return;
        }

        const dayBalanceLength = dayBalances.length;
        if (dayBalanceLength === 0 || dayBalances[dayBalanceLength - 1].day !== transactionDate) {
            dayBalances.push( { day: transactionDate, balance: transaction.calculatedBalance});
        } else {
            dayBalances[dayBalanceLength - 1].balance += transaction.calculatedBalance;
        }
    }

    const getBalancePerToken = async (): Promise<Map<token, number>> => {
        await preProcessIfNot();
        return Promise.resolve(tokenBalanceMap);
    }

    const getBalanceForToken = async (token: token): Promise<number> => {
        await preProcessIfNot();
        return Promise.resolve(tokenBalanceMap.get(token) || 0);
    }

    const getBalancePerTokenAtDate = async (searchedDate: number): Promise<Map<token, number>> => {
        await preProcessIfNot();
        const resultMap = new Map();
        for(const token of tokenDayBalanceMap) {
             const balance = await getBalanceForTokenAtDate(searchedDate, token[0]);
             balance !== 0 && resultMap.set(token, balance);
        }
        return Promise.resolve(resultMap);
    }

    const getBalanceForTokenAtDate = async (searchedDate: number, token: token): Promise<number> => {
        await preProcessIfNot();
        const dayBalanceArr = tokenDayBalanceMap.get(token);
        if(!dayBalanceArr) {
            return 0;
        }
        const foundBalance = binarySearchOnSorted(dayBalanceArr, searchedDate, (dayBalance) => dayBalance.balance);
        return Promise.resolve(foundBalance || 0);
    }

    return {
        preProcess,
        getBalancePerToken,
        getBalanceForToken,
        getBalancePerTokenAtDate,
        getBalanceForTokenAtDate,
    };
}
