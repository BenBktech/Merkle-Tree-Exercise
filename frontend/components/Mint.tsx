'use client';
import { useAccount } from "wagmi"
import { useState, useEffect } from "react";
import { whitelisted, contractAddress, contractAbi } from "@/utils/constants";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

const Mint = () => {

    const { address, isConnected } = useAccount();
    const [merkleProof, setMerkleProof] = useState<string[]>([]);
    const [merkleRootError, setMerkleRootError] = useState('');

    const { data: hash, writeContract } = useWriteContract()

    const mint = async() => {
        writeContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'safeMint',
            account: address,
            args: [address, merkleProof]
        })
    }

    const { isLoading, isSuccess } = useWaitForTransactionReceipt({
        hash
    });

    useEffect(() => {
        console.log(merkleRootError);
    }, [merkleRootError])

    useEffect(() => {
        if(isConnected && address) {
            try {
                const tree = StandardMerkleTree.of(whitelisted, ["address"], { sortLeaves: true });
                const racine = tree.root;
                console.log(`Racine de l'arbre de Merkle : ${racine}`)
                const proof = tree.getProof([address]);
                setMerkleProof(proof);
            }
            catch {
                setMerkleRootError('You are not eligible to mint your NFT.');
            } 
        }
    }, [isConnected, address])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                {isConnected ? (
                    <div className="space-y-6">
                        {hash && (
                            <div className="p-4 bg-gray-50 rounded-lg break-all">
                                <span className="font-semibold">Transaction Hash:</span> 
                                <span className="text-gray-600">{hash}</span>
                            </div>
                        )}
                        {isLoading && (
                            <div className="flex items-center justify-center p-4 text-blue-600">
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Waiting for confirmation...
                            </div>
                        )} 
                        {isSuccess && (
                            <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center font-medium">
                                Check your wallet, you have received 1 NFT! 🎉
                            </div>
                        )} 
                        <div className="text-center text-gray-600">
                            Please click on the button below to Mint your NFT.
                            <p className="text-sm mt-1">(Only 1 NFT per address)</p>
                        </div>
                        {merkleRootError ? (
                            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center font-medium">
                                {merkleRootError}
                            </div>
                        ) : (
                            <button 
                                onClick={mint}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02]"
                            >
                                Mint your NFT
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-gray-700 font-medium">
                        Please Connect your Wallet to Mint
                    </div>
                )}
            </div>
        </div>
    )
}

export default Mint