const dollarUsLocale = Intl.NumberFormat('en-US');

export const formatCurrency = (value: number) => dollarUsLocale.format(value);
