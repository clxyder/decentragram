import React, { Component } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
// import Identicon from 'identicon.js';
import './App.css';
import Decentragram from '../abis/Decentragram.json'
import Navbar from './Navbar'
import Main from './Main'

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {

  async componentWillMount() {
    // life cycle callback
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    // From <https://www.trufflesuite.com/tutorial#instantiating-web3>
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = detectEthereumProvider();
    }
    // If no injected web3 instance is detected, fall back to Ganache
    // NOTE Only sufficient for development purposes.
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    window.web3 = new Web3(App.web3Provider);
  }

  async loadBlockchainData() {
    // Load account
    const eth = window.ethereum;
    const accounts = await eth.request({ method: 'eth_accounts' });
    this.setState({ account: accounts[0] });
    // Network ID
    const networkId = await window.web3.eth.net.getId();
    const networkData = Decentragram.networks[networkId];
    if (networkData) {
      const decentragram = window.web3.eth.Contract(Decentragram.abi, networkData.address);
      this.setState({ decentragram });
      const imagesCount = await decentragram.methods.imageCount().call();
      this.setState({ imagesCount });

      for (var i = 1; i <= imagesCount; i++) {
        const image = await decentragram.methods.images(i).call();
        this.setState({
          images: [...this.state.images, image]
        })
      }
      // Sort images. Show highest tipped images first
      this.setState({
        images: this.state.images.sort((a,b) => b.tipAmount - a.tipAmount )
      })
      this.setState({ loading: false });
    } else {
      window.alert("Decentragram contract not deployed to detected network.");
    }
  }

  captureFile = event => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  uploadImage = description => {
    console.log("Submitting file to ipfs...")

    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }

      this.setState({ loading: true })
      this.state.decentragram.methods.uploadImage(result[0].hash, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  tipImageOwner(id, tipAmount) {
    this.setState({ loading: true})
    this.state.decentragram.methods.tipImageOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      decentragram: null,
      images: [],
      loading: true
    }

    this.uploadImage = this.uploadImage.bind(this)
    this.tipImageOwner = this.tipImageOwner.bind(this)
    this.captureFile = this.captureFile.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
            images = {this.state.images}
            captureFile={this.captureFile}
            uploadImage={this.uploadImage}
            tipImageOwner={this.tipImageOwner}
            />
        }
      </div>
    );
  }
}

export default App;