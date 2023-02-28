function coin_price() {
  const myGoogleSheetName =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Suivi')
  const apiKey = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('APIKEY').getRange(2, 4).getValue()

  const coinMarketCapAPICall = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    qs: {
      start: '1',
      limit: '5000',
      convert: 'USD',
    },
    headers: { 'X-CMC_PRO_API_KEY': apiKey },
    json: true,
    gzip: true,
  }

  let myCoinSymbols = []
  const getValues = SpreadsheetApp.getActiveSheet().getDataRange().getValues()
  for (let i = 0; i < getValues.length; i++) {
    // 1 = column B in the spreadsheet
    const coinSymbol = getValues[i][1]
    if (i > 0 && coinSymbol) {
      myCoinSymbols.push(coinSymbol)
    }
  }

  // Let's itereate
  for (let i = 0; i < myCoinSymbols.length; i++) {
    const ticker = myCoinSymbols[i]
    const coinMarketCapUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${ticker}`
    const result = UrlFetchApp.fetch(coinMarketCapUrl, coinMarketCapAPICall)
    const txt = result.getContentText()
    const d = JSON.parse(txt)
    const row = i + 2

    // Puts a column of current market price's in dollars into the sheet at B6 or B7 idk...
    myGoogleSheetName.getRange(row, 6).setValue(d.data[ticker].quote.USD.price)
  }
}