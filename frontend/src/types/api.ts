export interface ApiProject {
  project_id: string;
  name: string;
  description: string;
  category: string;
  total_funding: number;
  target_funding: number;
  investors_count: number;
  status: string;
  created_at: string;
  roi_estimate: number;
}

export interface ApiWallet {
  wallet_id: string;
  public_key: string;
  balance: number;
}

export interface ApiInvestPayload {
  sender: string;
  amount: number;
  signature: string;
}
