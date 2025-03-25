import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

async function main() {
    const whitelisted: string[][] = [
        ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
        ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"],
        ["0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"],
    ];
    //*** à compléter ***//
    console.log(`Racine de l'arbre de Merkle : ${merkleTree.root}`);

    const [owner] = await ethers.getSigners();
    const contract = await ethers.deployContract("Alyra", [owner.address, merkleTree.root]);

    await contract.waitForDeployment();

    console.log(`Adresse du contrat déployé : ${contract.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});  // Remove any extra backticks or empty code blocks after this