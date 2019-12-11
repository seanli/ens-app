import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import 'core-js/es/object'
import App from 'App'
import { setupENS } from '@ensdomains/ui'
import { SET_ERROR } from 'graphql/mutations'

import { GlobalStateProvider } from 'globalState'
import 'globalStyles'
import { setupClient } from 'apolloClient'

import Fortmatic from 'fortmatic'

let fm = new Fortmatic('pk_live_6836EE5A179281AE')

window.addEventListener('load', async () => {
  let client

  try {
    client = await setupClient()
    if (
      process.env.REACT_APP_STAGE === 'local' &&
      process.env.REACT_APP_ENS_ADDRESS
    ) {
      await setupENS({
        reloadOnAccountsChange: true,
        customProvider: fm.getProvider(),
        ensAddress: process.env.REACT_APP_ENS_ADDRESS
      })
    } else {
      await setupENS({
        customProvider: fm.getProvider(),
        reloadOnAccountsChange: false
      })
    }
  } catch (e) {
    console.log(e)
    await client.mutate({
      mutation: SET_ERROR,
      variables: { message: e.message }
    })
  }
  ReactDOM.render(
    <ApolloProvider client={client}>
      <GlobalStateProvider>
        <App />
      </GlobalStateProvider>
    </ApolloProvider>,
    document.getElementById('root')
  )
})
