interface CurrencyData {
  /* Currency ID */
  id: string

  /* Country Name */
  countryName: string

  /* Currency Code */
  currencyName: string

  /* Currency Code */
  currencyCode: string

  /* Symbol Left */
  symbolLeft: string

  /* Symbol Right */
  symbolRight: string

  /* Decimal Place */
  decimalPlace: number

  /* Is Hot */
  isHot: boolean

  /* Sort */
  sort: number
}

interface CurrencyListParams {
  currencyCode: string
}
