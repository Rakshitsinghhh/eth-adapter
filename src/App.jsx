import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, http, injected, useAccount, useBalance, useConnect, useDisconnect, WagmiProvider } from 'wagmi'
import { mainnet } from 'viem/chains'


const queryClient= new QueryClient()

const config=createConfig({
  chains: [mainnet],
  transports:{
    [mainnet.id]:http(),
  },
  connectors: [injected()]
})



function WalletOption() {
  const { connectors, connect } = useConnect()

  return connectors.map((connector) => (
    <button key={connector.uid} onClick={() => connect({ connector })}>
      {connector.name}
    </button>
  ))
}

function Balancegetter()
{
  const {address}=useAccount();
  const {disconnect}=useDisconnect()

  const { data, isLoading, error } = useBalance({ address });

  return (
    <div>
      <div>
        address : {address}
      </div>

        {isLoading && <div>isLoading..</div>}
        {error && <div>error</div>}
        {data && (
        <div>
          balance: {data.formatted} {data.symbol}
        </div>
        )}
        <button onClick={() => disconnect()}>Disconnect</button>
  </div>
  )
}

function Txnsend()
{
  return(
    <div>
      
    </div>
  )

}
function App() {

  return (
    <div>
      <input placeholder='enter amount'></input>
      <button>click to send</button>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <div>
            <WalletOption/>
          </div>
          <div>
            <Balancegetter/>
          </div>
          <div>
            <Txnsend/>  
          </div>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  )
}

export default App
