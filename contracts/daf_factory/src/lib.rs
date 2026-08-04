#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, String, Symbol, Vec};

const ADMIN: Symbol = symbol_short!("ADMIN");
const FUNDS: Symbol = symbol_short!("FUNDS");

#[contract]
pub struct DafFactory;

#[contractimpl]
impl DafFactory {
    /// Initialize the Factory with an Admin Address
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&ADMIN) {
            panic!("Already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&ADMIN, &admin);
    }

    /// Register a new DAF Fund smart contract address
    pub fn register_fund(env: Env, donor: Address, fund_address: Address, fund_name: String) {
        donor.require_auth();
        let mut funds: Vec<(Address, Address, String)> = env
            .storage()
            .instance()
            .get(&FUNDS)
            .unwrap_or(Vec::new(&env));
            
        funds.push_back((donor, fund_address, fund_name));
        env.storage().instance().set(&FUNDS, &funds);
    }

    /// Get all registered DAF funds
    pub fn get_all_funds(env: Env) -> Vec<(Address, Address, String)> {
        env.storage().instance().get(&FUNDS).unwrap_or(Vec::new(&env))
    }
}

#[cfg(test)]
mod test;
