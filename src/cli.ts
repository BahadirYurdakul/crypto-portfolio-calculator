#!/usr/local node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {singleThreadPortfolioCalculator} from "./calculators/portfolio/singleThreadPortfolioCalculator";
require('dotenv').config({ path: '../.env' })

yargs(hideBin(process.argv))
    .commandDir('commands')
    .strict()
    .alias({ h: 'help' })
    .argv;

// todo make this callable from command line.
const balanceCalculator = singleThreadPortfolioCalculator(process.env.TRANSACTIONS_FILE_LOCATION as string);
balanceCalculator.preProcess && balanceCalculator.preProcess();
balanceCalculator.getBalancePerToken().then(balanceMap => console.log(balanceMap));