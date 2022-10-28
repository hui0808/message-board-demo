const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("MessageBoard contract", function() {
  it("留言", async function() {
    // 获取账户
    const [owner] = await ethers.getSigners()
    // 获取名为 MessageBoard 的智能合约
    const MessageBoard = await ethers.getContractFactory("MessageBoard")
    // 部署合约，返回 Contract 合约对象
    const contract = await MessageBoard.deploy()
    // 调用合约进行测试
    let messages = await contract.getAllMessage()
    expect(messages.length).to.equal(0)
    await contract.connect(owner).saveMessage("hello,world1")
    await contract.connect(owner).saveMessage("hello,world2")
    messages = await contract.getAllMessage()
    expect(messages.length).to.equal(2)
    expect(messages[1].msg).to.equal("hello,world2")
  });
  it("删除留言", async function () {
    const [owner, otherAccount] = await ethers.getSigners()
    const MessageBoard = await ethers.getContractFactory("MessageBoard")
    const contract = await MessageBoard.deploy()
    await contract.connect(owner).saveMessage("hello,world1")
    await contract.connect(owner).saveMessage("hello,world2")
    let messages = await contract.getAllMessage()
    await contract.connect(owner).deleteMessage(messages[0].id)
    messages = await contract.getAllMessage()
    expect(messages.length).to.equal(1)
    expect(messages[0].msg).to.equal("hello,world2")
    // 删除不是自己的留言
    await expect(contract.connect(otherAccount).deleteMessage(messages[0].id)).to.rejectedWith(Error)
    const count = (await contract.getMessageCount()).toNumber()
    expect(count).to.equal(1)
  })
})