import contractInfo from '../../artifacts/contracts/MessageBoard.sol/MessageBoard.json'
import { ethers } from 'ethers'

const contractAbi = contractInfo.abi

class MessageBoard {
  async init() {
    this.updateTitle('欢迎来到留言板，请先连接到MetaMask钱包')
    await this.connectToMetaMask()
    this.updateTitle(`欢迎来到留言板，用户 ${this.address.slice(2)}`)
    this.connectToContract("0x0165878A594ca255338adfa4d48449f69242Eb8F", contractAbi, this.signer)
    this.showInputBar()
    this.onSubmitBtnClicked()
    this.onDeleteBtnClicked()
    this.onMessageBoardUpdated()
    this.render()
  }
  async connectToMetaMask() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress()
    console.log("Account:", await signer.getAddress());
    this.provider = provider
    this.signer = signer
    this.address = address
  }
  connectToContract(contractAddress, contractAbi, account) {
    this.contract = new ethers.Contract(contractAddress, contractAbi, account)
    console.log(this.contract)
  }

  updateTitle(title) {
    document.querySelector('h1').innerText = title
  }

  async render() {
    const messages = await this.contract.getAllMessage()
    console.log(messages)
    document.querySelector('.message-board-container').innerHTML = ''
    messages.forEach((message, index) => {
      this.renderMessage(message.author, message.timestamp, message.msg, index + 1)
    })
    for (const message of messages) {
    }
  }
  renderMessage(author, timestamp, message, index) {
    const el = document.createElement('div')
    el.classList.add('message')
    el.innerText = `#${index} 用户 ${author} 在 ${Date(timestamp).toString()} 留言了：${message}`
    if (author === this.address) {
      el.insertAdjacentHTML('beforeend', `<button class="message-del-btn" data-id="${index - 1}">删除</button>`)
    }
    document.querySelector('.message-board-container').insertAdjacentElement('beforeend', el)
  }
  showInputBar() {
    document.querySelector('.msg-input-container').classList.remove('hide')
  }
  onSubmitBtnClicked() {
    document.querySelector('.msg-submit-btn').addEventListener('click', async (event) => {
      const inputEl = document.querySelector('.msg-input')
      const message = inputEl.value
      await this.contract.connect(this.signer).saveMessage(message)
      inputEl.value = ''
    })
  }
  onDeleteBtnClicked() {
    document.querySelector('.message-board-container').addEventListener('click', (event) => {
      const target = event.target
      if (target.classList.contains('message-del-btn')) {
        this.contract.deleteMessage(target.dataset.id)
      }
    })
  }
  onMessageBoardUpdated() {
    this.contract.on("MessageUpdated", () => {
      console.log('updated')
      this.render()
    })
  }
}

new MessageBoard().init()