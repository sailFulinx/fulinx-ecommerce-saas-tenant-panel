interface RegionCountryListParams {
  /* ID */
  id?: string | null

  /* Country Name */
  countryName?: string | null

  /* Iso2 */
  iso2?: string | null
}

interface RegionCountryListData {
  /* Country Name */
  countryName: string

  /* Iso3 */
  iso3: string

  /* Iso2 */
  iso2: string

  /* Phone Code */
  phoneCode: string

  /* Capital */
  capital: string

  /* Currency */
  currency: string

  /* Currency Symb */
  currencySymbol: string

  /* Tld */
  tld: string

  /* Natives */
  natives: string

  /* Region */
  region: string

  /* Sub Region */
  subRegion: string

  /* Timezones */
  timezones: string

  /* Translations */
  translations: string

  /* Latitude */
  latitude: number

  /* Longitude */
  longitude: number

  /* Emoji */
  emoji: string

  /* EmojiU */
  emojiU: string

  /* Rapid API GeoDB Cities */
  wikiDataId: string
}

interface RegionStateListParams {
  /* ID */
  id?: string | null

  /* State Name */
  stateName?: string | null

  /* Country ID */
  countryId?: string | null
}

interface RegionStateListData {
  /* State Name */
  stateName: string

  /* Country ID */
  countryId: string

  /* Country Code */
  countryCode: string

  /* Fips Code */
  fipsCode: string

  /* ISO2 */
  iso2: string

  /* Latitude */
  latitude: number

  /* Longitude */
  longitude: number
}

interface RegionCityListParams {
  /* ID */
  id?: string | null

  /* City Name */
  cityName?: string | null

  /* State ID */
  stateId?: string | null

  /* Country ID */
  countryId?: string | null
}

interface RegionCityListData {
  /* City Name */
  cityName: string

  /* State ID */
  stateId: string

  /* State Code */
  stateCode: string

  /* Country ID */
  countryId: string

  /* Country Code */
  countryCode: string

  /* Latitude */
  latitude: number

  /* Longitude */
  longitude: number
}
