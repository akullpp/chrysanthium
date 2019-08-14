import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 50em;
  line-height: 1.5;
  padding: 4em 1em;
  color: #566b78;
`

const DateWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
`

const WrapperQuote = styled.div`
  margin-top: 1em;
  padding-top: 1em;
  font-size: 20px;
`

const WrapperMeta = styled.div`
  padding-top: 3em;
  font-size: 14px;
  text-align: right;
`

const Hidzuke = styled.h1`
  text-align: center;
  color: gainsboro;
`

const Enso = styled.img`
  display: block;
  margin: auto;
`

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
    <Wrapper>
      <a href="/">
        <Enso src="/enso.svg" alt="" />
      </a>

      <WrapperQuote>{quote.quote}</WrapperQuote>

      <WrapperMeta>
        {quote.author} - {quote.from}
      </WrapperMeta>

      <DateWrapper>
        <Hidzuke>{date}</Hidzuke>
      </DateWrapper>
    </Wrapper>
  )
}
