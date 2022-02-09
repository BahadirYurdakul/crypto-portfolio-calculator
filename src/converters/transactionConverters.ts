import {Transaction, TransactionType} from "../models/transaction";


export function convertStringToTransaction(commaDelimitedString: string): Transaction {
    const trxAsArr = commaDelimitedString.split(",");
    const transactionType = trxAsArr[1] as TransactionType;
    const amount = Number(trxAsArr[3]);
    return {
        timestamp: Number(trxAsArr[0]),
        transaction_type: trxAsArr[1] as TransactionType,
        token: trxAsArr[2],
        amount,
        calculatedBalance: transactionType === TransactionType.DEPOSIT ? amount : - amount,
    };
}