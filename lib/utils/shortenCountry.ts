const shortenCountry = (country: string): string => {
  switch (country) {
    case 'United States of America':
      return 'US'
    case 'United Kingdom':
      return 'UK'
    default:
      return country
  }
}

export default shortenCountry
