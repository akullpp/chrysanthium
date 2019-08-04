import React, { useEffect, useState } from 'react'

const getToday = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

const getRandomQuote = quotes => {
  const randomIndex = Math.floor(Math.random() * quotes.length)
  return {
    randomQuote: quotes[randomIndex],
    newQuotes: [
      ...quotes.slice(0, randomIndex),
      ...quotes.slice(randomIndex + 1),
    ],
  }
}

const updateLocalStorage = quotes => {
  const { randomQuote, newQuotes } = getRandomQuote(quotes)
  const today = getToday()

  localStorage.setItem(
    'senshi',
    JSON.stringify({
      date: today,
      randomQuote,
      quotes: newQuotes,
    })
  )
  return localStorage.getItem('senshi')
}

const getStorage = async () => {
  let storage = localStorage.getItem('senshi')

  if (!storage) {
    storage = await fetch('quotes.json')
      .then(response => response.json())
      .then(({ quotes }) => updateLocalStorage(quotes))
  }
  return Promise.resolve(JSON.parse(storage))
}

export default () => {
  const emptyQuote = { quote: '', author: '', from: '' }
  const [quote, setQuote] = useState(emptyQuote)

  async function fetchQuotes() {
    const { date, randomQuote, quotes } = await getStorage()

    if (quotes && quotes.length < 1) {
      getStorage()
    }
    if (getToday() > date) {
      updateLocalStorage(quotes)
    }
    setQuote(randomQuote)
  }

  useEffect(() => {
    fetchQuotes()
  }, [])

  const date = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
    era: 'long',
  }).format(Date.now())

  return (
    <div>
      <img src="enso.svg" alt="" />
      <p>{quote.quote}</p>
      <p>
        {quote.author} - {quote.from}
      </p>
      <span>{date}</span>
    </div>
  )
}
