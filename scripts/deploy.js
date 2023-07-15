
const hre = require("hardhat");
const { Contract } = require("hardhat/internal/hardhat-network/stack-traces/model");
const fs = require("fs");
async function main() {
 

  const Todo = await hre.ethers.getContractFactory("todo");
  const todo = await Todo.deploy();

  await todo.deployed();

const abi = JSON.parse(todo.interface.format('json'))
const address =todo.address


const contractData = {
  abi,
  address,
};

fs.writeFileSync('./src/contractData.json', JSON.stringify(contractData))

console.log("Contract data saved to contractData.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
