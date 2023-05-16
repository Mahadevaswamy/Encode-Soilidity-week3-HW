import { ethers } from "ethers";
import { Ballot__factory, ERC20VotesContract__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();
import { showThrottleMessage } from "@ethersproject/providers";
dotenv.config();
const address="";


function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
  }
async function main() {
 // console.log(process.argv);
 const wallet=new  ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  console.log(`Using the wallet address: ${wallet.address}`)
  const provider = new ethers.providers.EtherscanProvider("sepolia", process.env.ETHERSCAN_API_KEY);
 //const provider=new ethers.providers.AlchemyProvider("sepolia", process.env.ALCHEMY_API_KEY);
 const lastBlock=await provider.getBlock("latest");
 console.log(`The last block is ${lastBlock.number}`)
 const signer=wallet.connect(provider);
 const balance=await signer.getBalance();
 console.log(`Balance of ${signer.address}, is ${balance} WEI`);
  const PROPOSALS = process.argv.slice(2);
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
    const jsonString = fs.readFileSync('artifacts/contracts/ERC20VotesContract.sol/ERC20VotesContract.json', 'utf-8');
  const abi = JSON.parse(jsonString).abi;
 
  const ERC20VotesContractInstance = new ethers.Contract( "0xdb47d641ebd22be06c0ce8be2368cdb0f4c17afc",abi, signer);
//    const acc1VotesAfter=await ERC20VotesContractInstance.getVotes("0x06B059777F28b762208E97032f5eeFE0aE5329aA");
//  console.log(`acc1 address :0x06B059777F28b762208E97032f5eeFE0aE5329aA \n has ${ethers.utils.formatUnits(acc1VotesAfter)} votes after delegating`);
//   //ERC20VotesContractInstance.delegate();

  const ballotFactory=new Ballot__factory(signer);

        const ballotContract=await ballotFactory.deploy(convertStringArrayToBytes32( ["Chocoloate", "vanilla", "strawberry"]), "0xdb47d641ebd22be06c0ce8be2368cdb0f4c17afc",lastBlock.number);
                await ballotContract.deployed();
        const deployTxn=await ballotContract.deployTransaction.wait();
        console.log(`The Ballot contract is deployed at ${ballotContract.address}`)
        console.log(` deployed block ID: ${deployTxn.blockNumber}`)
        // const voteTxn=await ballotContract.vote(1, 5);
        // await voteTxn.wait();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
