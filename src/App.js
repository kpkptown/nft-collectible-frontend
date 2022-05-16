import React, { useEffect, useState } from "react";
import squirrelImg from './assets/rinkeby_squirrels.gif';
import "./App.css";
import contract from "./contracts/NFTCollectible.json";
import { ethers } from "ethers";
// import { Fragment } from 'react/cjs/react.production.min';
import Footer from './components/Footer';
import Header from './components/Header';

const OPENSEA_LINK = 'https://testnets.opensea.io/collection/rinkeby-squirrels';
const contractAddress = "0x1e35ba89B3Db80FE502691cDAa377B5BBD155E1b";
const abi = contract.abi;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [metamaskError, setMetamaskError] = useState(null);
  const [mineStatus, setMineStatus] = useState(null);

  // async function checkWalletIsConnected() {
  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
  
    if (!ethereum) {
      console.log("Make sure you have MetaMask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    const network = await ethereum.request({ method: 'eth_chainId' });

    if (accounts.length !== 0 && network.toString() === '0x13881') {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setMetamaskError(false);
      setCurrentAccount(account);
    } else {
      setMetamaskError(true)
      console.log("No authorized account found");
    }
  };

  const connectWallet = async() => {
    const { ethereum } = window;

    if(!ethereum) {
      alert("Please install MetaMask!");
    }

    try {
      const network = await ethereum.request({ method: 'eth_chainId' });

      if (network.toString() === '0x13881') {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Found an account! Address: ", accounts[0]);
        setMetamaskError(null);
        setCurrentAccount(accounts[0]);
      }

      else {
        setMetamaskError(true);
      }
    } catch (err) {
      console.log(err)
    }
  }

  const mintNFT = async () => {
    try{
      setMineStatus('mining');

      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.mintNFTs(1, { gasLimit: 160000, value: ethers.utils.parseEther("0.01") });

        console.log("Mining... plese wait");
        await nftTxn.wait();

        console.log(`Mined, see transaction: ${nftTxn.hash}`);
        setMineStatus('success');

      } else {
        setMineStatus('error');
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      setMineStatus('error');
      console.log(err);
    }
  }

  useEffect(() => {
    checkWalletIsConnected();

    if (window.ethereum) {
      window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
    }
  }, []);

  const renderNotConnectedContainer = () => {
    return (
      <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
      </button>
    )
  }

  const renderMintUI = () => {
    return (
      <button onClick={mintNFT} className="cta-button connect-wallet-button">
        Mint a Polygon Squirrel NFT
      </button>
    )
  }

  return (
    <>
      {metamaskError && <div className='metamask-error'>Metamask から Polygon Testnet に接続してください!</div>}
      <div className="App">
        <div className="container">
          <Header opensea={OPENSEA_LINK} />
          <div className="header-container">
            <div className='banner-img'>
              <img src={squirrelImg} alt="Polygon Squirrels" />
            </div>
            {currentAccount && mineStatus !== 'mining' && renderMintUI()}
            {!currentAccount && !mineStatus && renderNotConnectedContainer()}
            <div className='mine-submission'>
              {mineStatus === 'success' && <div className={mineStatus}>
                <p>NFT minting successful!</p>
                <p className="success-link">
                  <a href={`https://testnets.opensea.io/${currentAccount}/`} target='_blank' rel='noreferrer'>Click here</a>
                  <span> to view your NFT on Opensea.</span>
                </p>
              </div>}
              {mineStatus === 'mining' && <div className={mineStatus}>
                <div className="loader" />
                <span>Transaction is mining</span>
              </div>}
              {mineStatus === 'error' && <div className={mineStatus}>
                <p>Transaction failed. Make sure you have at least 0.01 MATIC in your Metamask wallet and try again.</p>
              </div>}
            </div>
          </div>
          {currentAccount && <div className='show-user-address'>
            <p>
              Your address being connected: &nbsp;
              <br/>
                <span>
                  <a className='user-address' target='_blank' rel='noreferrer'>
                    {currentAccount}
                  </a>
                </span>
            </p>
          </div>}
          <Footer address={contractAddress} />
        </div>
      </div>
    </>
  );
}

export default App;