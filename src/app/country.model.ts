export interface Country{
    uid: string;
    Country: string;
    CountryCode: string;
    Slug: string;
    NewConfirmed: number;
    TotalConfirmed: number;
    ActiveCases: number;
    NewDeaths: number;
    TotalDeaths: number;
    RecoveryRate: number;
    NewRecovered: number;
    TotalRecovered: number;
    MortalityRate: number;
    Date: string;
}