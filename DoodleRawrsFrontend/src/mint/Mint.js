
import React from "react";
import Web3 from "web3";
import { Button, ProgressBar } from 'react-bootstrap'
import { connectWallet, getCurrentWalletConnected } from "../utils/interact";
import SmartContract from "../contracts/DoodleRawrs.json";

import Select from 'react-select';
import mystery1 from '../img/Mystery1.png'
import mystery2 from '../img/Mystery2.png'
import mystery3 from '../img/Mystery3.png'
import  Rainbow from '../img/rainbow.svg';
import  egg from '../img/egg.svg';



import './Mint.css'

const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: '#C7C4E2',
      padding: 20,
    }),
    singleValue: (provided, state) =>({
      ...provided,
        color: '#C7C4E2'
    })
  }



class Mint extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            swords: [],
            wallet: '',
            status: '',
            claimingNft: false,
            smartContract: '',
            web3: null,
            blockchain: null,
            errorMsg: '',
            feedback: '',
            totalSupply: '',
            totalMinted: '',
            typeOptions: [
                { value: 1, label: 1 },
                { value: 2, label: 2 },
                { value: 3, label: 3 },
                { value: 4, label: 4 },
                { value: 5, label: 5 },
                { value: 6, label: 6 },
                { value: 7, label: 7 },
                { value: 8, label: 8 },
                { value: 9, label: 9 },
                { value: 10, label: 10 }
            ],
            mintingAmount: 1
        };

        this.timer = null;

    }

    async connect() {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                const networkId = await window.ethereum.request({
                    method: "net_version",
                });
                var web3 = this.state.web3
                console.log(networkId)
                const NetworkData = await SmartContract.networks[networkId];
                console.log('test' + NetworkData)
                if (networkId == 1) {
                    const SmartContractObj = new web3.eth.Contract(
                        SmartContract.abi,
                        // NetworkData.address
                        //Rinkeby test contract
                        "0x9d00a27216363009C331939429a35C5d462ece6A"
                        //Live Contract
                        //"0x8bEa2b168fb0E5935bd251B1BccB142FEd006171"
                    );
                    await this.setState({
                        wallet: accounts[0],
                        smartContract: SmartContractObj,
                        web3: web3,
                    })
                } else {
                    this.connectFailed("Please change to main ETH net.");
                }
            } catch (err) {
                this.connectFailed("Something went wrong.");
            }
        } else {
            this.connectFailed("Please install Metamask.");
        }
    }

    claimNFTs = (_amount) => {
        this.setClaimingNft(true);
        var smartContract = this.state.smartContract;
        var wallet = this.state.wallet
        var web3 = this.state.web3
        try {
            smartContract.methods.mint(wallet, _amount).send({
                from: wallet,
                value: web3.utils.toWei((0.02 * _amount).toString(), "ether")
            }).then((receipt) => {
                this.setFeedback('Token(s) Successfully Minted!')
                this.setClaimingNft(false)
                this.getTotals()
            }).catch((err) => {
                console.log(err)
                this.setFeedback("Transaction failed")
                this.setClaimingNft(false)
            })
        } catch (err) {
            console.log(err);
            this.setFeedback("There was an error or you are on the wrong network.")
            this.setClaimingNft(false)
        }
    };

    claimFreeNFTs = (_amount) => {
        this.setClaimingNft(true);
        var smartContract = this.state.smartContract;
        var wallet = this.state.wallet
        var web3 = this.state.web3
        try {
            smartContract.methods.mintFree(wallet, _amount).send({
                from: wallet,
                value: web3.utils.toWei((0 * _amount).toString(), "ether")
            }).then((receipt) => {
                this.setFeedback('Token(s) Successfully Minted!')
                this.setClaimingNft(false)
                this.getTotals()
            }).catch((err) => {
                console.log(err)
                this.setFeedback("Transaction failed")
                this.setClaimingNft(false)
            })
        } catch (err) {
            console.log(err);
            this.setFeedback("There was an error or you are on the wrong network.")
            this.setClaimingNft(false)
        }
    };

    getTotals(){
        this.state.smartContract.methods.totalSupply().call().then((data) => {
            this.setState({ totalMinted: data })
        }).catch((err) => {
            console.log(err)
        })

        this.state.smartContract.methods.maxSupply().call().then((data) => {
            this.setState({ totalSupply: data })
        }).catch((err) => {
            console.log(err)
        })
    }

    async componentDidMount() {
        const { address, status } = await getCurrentWalletConnected();
        this.setWallet(address)
        this.setStatus(status);

        console.log(this.state.smartContract)

        await this.addWalletListener();
        if (this.state.wallet !== '') {
            await this.setState({ web3: new Web3(window.ethereum) });
            await this.connect()

            try {
                this.getTotals()
            } catch (e) {
                this.setFeedback('You are on the wrong network! Please connect to ETH mainnet')
            }
        }
    }

    connectFailed(errorMsg) {
        this.setState({ errorMsg })
    }

    setWallet(wallet) {
        this.setState({
            wallet
        })
    }

    setStatus(status) {
        this.setState({
            status
        })
    }

    setFeedback(feedback) {
        this.setState({
            feedback
        })
    }

    setClaimingNft(claimingNft) {
        this.setState({
            claimingNft
        })
    }

    walletOfOwner() {
        var smartContract = this.state.smartContract
        var wallet = this.state.wallet
        var web3 = this.state.web3
        try {
            console.log(smartContract.methods)
            smartContract.methods.walletOfOwner(wallet).call().then((data) => {
                console.log(data)
            }).catch((err) => {
                console.log(err)
            })
        } catch (err) {
            console.log(err);
        }
    }

    connectWalletPressed = async () => { //TODO: implement
        const walletResponse = await connectWallet();
        await this.setStatus(walletResponse.status);
        await this.setWallet(walletResponse.address);
        if (this.state.wallet !== '') {
            await this.setState({ web3: new Web3(window.ethereum) });
            await this.connect()

            try{
                this.state.smartContract.methods.totalSupply().call().then((data) => {
                    this.setState({
                        totalMinted: data
                    })
                }).catch((err) => {
                    console.log(err)
                })
    
                this.state.smartContract.methods.maxSupply().call().then((data) => {
                    this.setState({
                        totalSupply: data
                    })
                }).catch((err) => {
                    console.log(err)
                })
            } catch(e){

            }
        }
    };

    async addWalletListener() {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length) {
                    this.setWallet(accounts[0]);
                    this.setStatus("👆🏽 Write a message in the text-field above.");
                } else {
                    this.setWallet("");
                    this.setStatus("🦊 Connect to Metamask using the top right button.");
                }
            });
            window.ethereum.on("chainChanged", () => {
                window.location.reload();
            });
        } else {
            this.setStatus(
                <p>
                    {" "}
                    🦊{" "}
                    <a target="_blank" href={`https://metamask.io/download.html`}>
                        You must install Metamask, a virtual Ethereum wallet, in your
                        browser.
                    </a>
                </p>
            );
        }
    }

    async handleSelect(options, names) {
        await this.setState({
            mintingAmount: options.value
        })
    }


    render() {
        var wallet = this.state.wallet
        var errorMsg = this.state.errorMsg
        var feedback = this.state.feedback
        var claimingNft = this.state.claimingNft
        var totalMinted = this.state.totalMinted
        var maxSupply = this.state.totalSupply

        const freeSupply = 1000

        return (
            <div>
                <div className="mint">
                     <div className='tri-image'>
                    <img src={mystery2} className='tri rotate-left rotate'></img>
                    <img src={mystery1} className='tri rotate-middle rotate'></img>
                    <img src={mystery3} className='tri rotate-right rotate'></img>
                    </div>
                    <div className='info'>
                        <h2 style={{ textAlign: "center", color: "white", textShadow: "-1px 1px 0 #000" }}>Doodlerawrs</h2>
                    </div>
                    <Button id="walletButton" className='btn2' onClick={this.connectWalletPressed}>
                        {wallet.length > 0 ? (
                            "Wallet: " +
                            String(wallet).substring(0, 6) +
                            "..." +
                            String(wallet).substring(38)
                        ) : (
                            <span>Connect Wallet</span>
                        )}
                    </Button>
                    <div className='minter'>
                        {wallet.length > 0 ? (
                            <div className='btn-holder'>
                                <div className='total'>
                                    <h2 style={{ textAlign: "center", color: "white", textShadow: "-1px 1px 0 #000" }}>{totalMinted ? totalMinted : 0}/{1265} minted</h2>
                                </div>
                                <div className='progress'>
                                    <ProgressBar color='thistle' now={((totalMinted / 1265) * 100)} />
                                </div>
                                <h2 style={{ textAlign: "center", marginTop: "20px", color: "white", textShadow: "-1px 1px 0 #000" }}>
                                    Minting Period is Over.
                                </h2>
                                <p style={{ textAlign: "center", color: "white", padding: "20px", maxWidth: "900px", textShadow: "-1px 1px 0 #000" }}>
                                    All holders are elligible to receive an egg for upcoming BabyRawrs project.
                                    The egg will have a hatching mechanism similar to a reveal process.
                                    When the egg hatches the baby will have unique characteristics.
                                    <img className="egg" src={egg}></img>
                                </p>
                                {/* <div className='mint-action'>
                                    <Select
                                        name="filter"
                                        onChange={(e) => this.handleSelect(e)}
                                        options={this.state.typeOptions}
                                        defaultValue={this.state.typeOptions[0]}
                                        className="mint-select select2"
                                        classNamePrefix="test"
                                        styles={customStyles}
                                    />
                                    <Button
                                        hidden={this.state.totalMinted >= freeSupply}
                                        disabled={this.state.claimingNft && this.state.totalMinted < freeSupply ? 1 : 0}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.claimFreeNFTs(this.state.mintingAmount);
                                        }}
                                        className='mint-button btn2'
                                    >
                                        {claimingNft ? "Loading..." : "Mint Free"}
                                    </Button>
                                    <Button
                                        hidden={this.state.totalMinted < freeSupply}
                                        disabled={this.state.claimingNft && this.state.totalMinted > freeSupply ? 1 : 0}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.claimNFTs(this.state.mintingAmount);
                                        }}
                                        className='mint-button btn2'
                                    >
                                        {claimingNft ? "Loading..." : "Mint 0.02"}
                                    </Button>
                                </div> */}
                            </div>
                        ) : (<></>)}
                    </div>
                    <b><p style={{ textAlign: "center", color: "darkred" }}>{feedback}</p></b>
                </div>
                <div className='footer'>
                    <div className='footerText'>
                        <h1><span style={{color: '#C7C4E2'}}>Join</span> <span style={{color: '#C7C4E2'}}>the</span> <span></span>

                        <span style={{color: '#F6AFCE'}}>C</span>
                        <span style={{color: '#FDC998'}}>O</span>
                        <span style={{color: '#FAE882'}}>M</span>
                        <span style={{color: '#BCDFBC'}}>M</span>
                        <span style={{color: '#A0DDF9'}}>U</span>
                        <span style={{color: '#C7C4E2'}}>N</span>
                        <span style={{color: '#F6AFCE'}}>I</span>
                        <span style={{color: '#FDC998'}}>T</span>
                        <span style={{color: '#FAE882'}}>Y</span>
                        </h1>
                        <p className="listItem"><span style={{color: '#C7C4E2'}}>Come talk to us in Discord if you have any </span> <span style={{color: '#C7C4E2'}}>questions</span> <span style={{color: '#C7C4E2'}}>or</span> <span style={{color: '#C7C4E2'}}>concerns.</span></p>
                        <button className='footer-button'><a className="footerDisc" href="https://discord.gg/Jc8Tx5rSdk">Join Our Discord</a></button>
                        <button className='footer-button'><a className="footerDisc" href="https://opensea.io/collection/doodlerawrs">Buy on Opensea</a></button>
                        <button className='footer-button'><a className="footerDisc" href="https://twitter.com/DoodleRawrs">Twitter</a></button>
                    </div>
                </div>
            </div>
        );
    }
};

export default Mint;
