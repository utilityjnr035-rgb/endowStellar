import { Horizon, rpc } from "@stellar/stellar-sdk";

export const STELLAR_NETWORK = process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet";
export const STELLAR_RPC_URL = process.env.NEXT_PUBLIC_STELLAR_RPC_URL || "https://soroban-testnet.stellar.org:443";
export const STELLAR_NETWORK_PASSPHRASE = process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015";

export const DAF_FACTORY_CONTRACT_ID = process.env.NEXT_PUBLIC_DAF_FACTORY_CONTRACT_ID || "";

export const sorobanServer = new rpc.Server(STELLAR_RPC_URL);
export const horizonServer = new Horizon.Server("https://horizon-testnet.stellar.org");

/**
 * Interface representing a Donor-Advised Fund
 */
export interface DAFund {
  id: string;
  name: string;
  donor: string;
  balanceXLM: number;
  balanceUSDC: number;
  createdAt: string;
}

/**
 * Interface representing a nonprofit recipient
 */
export interface Nonprofit {
  id: string;
  name: string;
  category: string;
  stellarAddress: string;
  description: string;
  verified501c3: boolean;
}

// Mock non-profit database for demonstration
export const MOCK_NONPROFITS: Nonprofit[] = [
  {
    id: "org-1",
    name: "Stellar Education Foundation",
    category: "Education & Literacy",
    stellarAddress: "GBSDF1...EDUCATE",
    description: "Empowering underserved global communities through open blockchain literacy and tech scholarships.",
    verified501c3: true,
  },
  {
    id: "org-2",
    name: "Clean Ocean Action",
    category: "Environment & Wildlife",
    stellarAddress: "GBSDF2...OCEAN",
    description: "Removing plastics and protecting coastal ecosystems using transparent, auditable grant tracking.",
    verified501c3: true,
  },
  {
    id: "org-3",
    name: "Global Relief Initiative",
    category: "Humanitarian Aid",
    stellarAddress: "GBSDF3...RELIEF",
    description: "Rapid disaster response and medical supplies delivery with instant sub-second payout finality.",
    verified501c3: true,
  },
];
