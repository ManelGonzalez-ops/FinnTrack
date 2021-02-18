export interface PeopleItem {
    user: User;
    portfolio: PortfolioPoint[];
}

export interface User {
    userId: number
    firstName: string
    lastName: string
    email: string
    username: string
}

export interface PortfolioPoint {
    portfolioCost: number;
    portfolioValue: number;
    accruedIncome: number;
    liquidativeValue: number;
}

// --- USERITEM --- //

export interface PeopleData {
    prices: Prices;
    possesionsSeries: PossesionsSeries;
    portfolio: Portfolio,
    user: User
}

type Prices = Record<string, Tickers>
type Tickers = Record<string, {close: number}>

export interface Position {
    ticker: string;
    amount: number;
    unitaryCost: number;
}
export interface PossesionsSeries {
    income: number;
    positions: Position[];
}


type Portfolio = Record<string, PortfolioPoint>