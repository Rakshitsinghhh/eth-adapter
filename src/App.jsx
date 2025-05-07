import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, http, injected, useAccount, useBalance, useConnect, useDisconnect, useSendTransaction, WagmiProvider } from 'wagmi'
import { mainnet } from 'viem/chains'
import { sendTransaction } from 'viem/actions'
import { parseEther } from 'viem'


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
  const { data: hash, sendTransaction } = useSendTransaction()
  function sendtx()
  {
    const to=document.getElementById("to").value;
    const amount=document.getElementById("val").value;
    sendTransaction({
      to,
      amount: parseEther(amount)
    });
  }

  return(
    <div>
      <input id="to" placeholder="enter sender's address"></input>
      <input id="val"  placeholder='enter amount' ></input>
      <button onClick={sendtx}>send</button>
      {hash && <div>transaction : {hash}</div>}
    </div>
  )

}
function App() {

  return (
    <div>
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
