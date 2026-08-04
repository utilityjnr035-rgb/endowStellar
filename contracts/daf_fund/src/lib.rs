#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, Address, Env, String, Symbol, Vec,
};

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct GrantRecommendation {
    pub recipient: Address,
    pub amount: i128,
    pub memo: String,
    pub executed: bool,
}

const DONOR: Symbol = symbol_short!("DONOR");
const NAME: Symbol = symbol_short!("NAME");
const GRANTS: Symbol = symbol_short!("GRANTS");

#[contract]
pub struct DafFund;

#[contractimpl]
impl DafFund {
    /// Initialize an individual DAF Fund with a primary Donor Advisor and Fund Name
    pub fn init(env: Env, donor: Address, fund_name: String) {
        if env.storage().instance().has(&DONOR) {
            panic!("Fund already initialized");
        }
        env.storage().instance().set(&DONOR, &donor);
        env.storage().instance().set(&NAME, &fund_name);
    }

    /// Recommend a grant disbursement from the DAF to a verified charity / recipient
    pub fn recommend_grant(env: Env, token_address: Address, recipient: Address, amount: i128, memo: String) {
        let donor: Address = env.storage().instance().get(&DONOR).expect("Not initialized");
        donor.require_auth();

        let client = token::Client::new(&env, &token_address);
        let contract_address = env.current_contract_address();

        // Transfer token balance directly from DAF contract to beneficiary charity
        client.transfer(&contract_address, &recipient, &amount);

        let mut grants: Vec<GrantRecommendation> = env
            .storage()
            .instance()
            .get(&GRANTS)
            .unwrap_or(Vec::new(&env));

        grants.push_back(GrantRecommendation {
            recipient,
            amount,
            memo,
            executed: true,
        });

        env.storage().instance().set(&GRANTS, &grants);
    }

    /// Get DAF donor advisor
    pub fn get_donor(env: Env) -> Address {
        env.storage().instance().get(&DONOR).expect("Not initialized")
    }

    /// Get DAF fund name
    pub fn get_name(env: Env) -> String {
        env.storage().instance().get(&NAME).expect("Not initialized")
    }

    /// Get all grants history
    pub fn get_grants(env: Env) -> Vec<GrantRecommendation> {
        env.storage().instance().get(&GRANTS).unwrap_or(Vec::new(&env))
    }
}
