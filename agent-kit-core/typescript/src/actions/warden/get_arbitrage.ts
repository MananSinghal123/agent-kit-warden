import { WardenAction } from "./warden_action";
import { Account, createPublicClient, createWalletClient, formatEther, http } from "viem";
import { z } from "zod";
import {botAbi} from "../../utils/contracts/abi/botAbi";
import { KNOWN_CONTRACTS } from "../../utils/contracts/constants/known";
import { primaryChain } from "../../utils/chains";
import { sepolia } from "viem/chains";

const wardenContract = KNOWN_CONTRACTS[primaryChain.id]?.WARDEN;

const CREATE_ARBITRAGE_PROMPT = `This tool should be called when a user wants to execute flash loan arbitrage.`;

const sepoliaPublicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
});

enum AddressType {
    Unspecified = 0,
    Ethereum = 1,
    Osmosis = 2,
}

const types = [AddressType.Ethereum];

if (!wardenContract?.address) {
    throw new Error("Warden contract address not found");
}

export const GetArbitrageInput = z.object({
        token1: z.string(),
        token2: z.string(),
});
    
export async function getArbitrage(
    account:Account,
    args: z.infer<typeof GetArbitrageInput>
): Promise<string> {
    try {
        const walletClient = createWalletClient({
            account,
            chain: sepolia,
            transport: http(process.env.RPC_URL),
          })
        
          
            const hash = await walletClient.writeContract({
              address: `0xb4aA9BcF2DAA6b30D8c105aD8D1927F351a92744`,
              abi: botAbi,
              functionName: 'execute',
              args: [args.token1,args.token2]
            })
           
            const receipt = await sepoliaPublicClient.waitForTransactionReceipt({
                hash,
            });
       
        if (receipt.status === "success") {
            return `Successfully done. Transaction hash: ${receipt.transactionHash}`;
        } else {
            throw new Error("Transaction failed");
        }
    } catch (error) {
        throw new Error(
            `Failed to do arbitrage: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

/**
 * Get balance action.
 */
export class GetArbitrageAction implements WardenAction<typeof GetArbitrageInput> {
    public name = "get_arbitrage";
    public description = CREATE_ARBITRAGE_PROMPT;
    public schema = GetArbitrageInput;
    public function = getArbitrage;
}

