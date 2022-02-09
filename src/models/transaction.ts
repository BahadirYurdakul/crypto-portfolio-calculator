
// timestamp: Integer number of seconds since the Epoch
// transaction_type: Either a DEPOSIT or a WITHDRAWAL
// token: The token symbol
// amount: The amount transacted
export type Transaction = {
    timestamp: number;
    transaction_type: TransactionType;
    token: token;
    amount: number;
    calculatedBalance: number;
}

export enum TransactionType {
    DEPOSIT = 'DEPOSIT', WITHDRAWAL = 'WITHDRAWAL',
}

export type token = string;
export type currency = string;