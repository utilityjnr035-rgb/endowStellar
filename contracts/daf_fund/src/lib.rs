#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, Address, Env, Map, String, Symbol,
    Vec,
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
const SIGNATORIES: Symbol = symbol_short!("SIGS");
const THRESHOLD: Symbol = symbol_short!("THRESH");
const SIGNATURES: Symbol = symbol_short!("SIGS_MAP");
const GRANT_APPROVED: Symbol = symbol_short!("grant_appr");
const GRANT_DISBURSED: Symbol = symbol_short!("grant_disb");

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

    /// Recommend a grant disbursement from the DAF to a verified charity / recipient.
    /// When the approval threshold is greater than 1, the grant is stored as pending
    /// and no tokens are transferred until the threshold of approvals is collected.
    pub fn recommend_grant(env: Env, token_address: Address, recipient: Address, amount: i128, memo: String) {
        let donor: Address = env.storage().instance().get(&DONOR).expect("Not initialized");
        donor.require_auth();

        let threshold: u32 = env.storage().instance().get(&THRESHOLD).unwrap_or(1);

        let mut grants: Vec<GrantRecommendation> = env
            .storage()
            .instance()
            .get(&GRANTS)
            .unwrap_or(Vec::new(&env));

        if threshold > 1 {
            // Pending state: no transfer until approvals reach the threshold.
            grants.push_back(GrantRecommendation {
                recipient,
                amount,
                memo,
                executed: false,
            });
            env.storage().instance().set(&GRANTS, &grants);
        } else {
            let client = token::Client::new(&env, &token_address);
            let contract_address = env.current_contract_address();

            // Transfer token balance directly from DAF contract to beneficiary charity
            client.transfer(&contract_address, &recipient, &amount);

            grants.push_back(GrantRecommendation {
                recipient,
                amount,
                memo,
                executed: true,
            });
            env.storage().instance().set(&GRANTS, &grants);

            let grant_index = grants.len() - 1;
            env.events()
                .publish((GRANT_DISBURSED,), (grant_index, amount));
        }
    }

    /// Register a signatory authorized to approve pending grants. Callable by the donor.
    pub fn register_signatory(env: Env, signatory: Address) {
        let donor: Address = env.storage().instance().get(&DONOR).expect("Not initialized");
        donor.require_auth();

        let mut signatories: Vec<Address> = env
            .storage()
            .instance()
            .get(&SIGNATORIES)
            .unwrap_or(Vec::new(&env));

        if !signatories.contains(&signatory) {
            signatories.push_back(signatory);
            env.storage().instance().set(&SIGNATORIES, &signatories);
        }
    }

    /// Remove a signatory. Callable by the donor.
    pub fn remove_signatory(env: Env, signatory: Address) {
        let donor: Address = env.storage().instance().get(&DONOR).expect("Not initialized");
        donor.require_auth();

        let signatories: Vec<Address> = env
            .storage()
            .instance()
            .get(&SIGNATORIES)
            .unwrap_or(Vec::new(&env));

        let mut updated: Vec<Address> = Vec::new(&env);
        for s in signatories.iter() {
            if s != signatory {
                updated.push_back(s);
            }
        }
        env.storage().instance().set(&SIGNATORIES, &updated);
    }

    /// Set the approval threshold. Callable by the donor.
    /// Must be greater than 0 and no greater than the number of registered signatories.
    pub fn set_threshold(env: Env, threshold: u32) {
        let donor: Address = env.storage().instance().get(&DONOR).expect("Not initialized");
        donor.require_auth();

        if threshold == 0 {
            panic!("Threshold must be greater than 0");
        }

        let signatories: Vec<Address> = env
            .storage()
            .instance()
            .get(&SIGNATORIES)
            .unwrap_or(Vec::new(&env));

        if threshold > signatories.len() {
            panic!("Threshold exceeds signatory count");
        }

        env.storage().instance().set(&THRESHOLD, &threshold);
    }

    /// Approve a pending grant. Requires auth from the calling signatory.
    /// Records the signature (deduplicated) and disburses once the threshold is met.
    pub fn approve_grant(env: Env, grant_index: u32) {
        let signatory = env.invoker();
        signatory.require_auth();

        let signatories: Vec<Address> = env
            .storage()
            .instance()
            .get(&SIGNATORIES)
            .unwrap_or(Vec::new(&env));

        if !signatories.contains(&signatory) {
            panic!("Not a registered signatory");
        }

        let mut grants: Vec<GrantRecommendation> = env
            .storage()
            .instance()
            .get(&GRANTS)
            .unwrap_or(Vec::new(&env));

        if grant_index >= grants.len() {
            panic!("Invalid grant index");
        }

        let grant = grants.get(grant_index).unwrap();
        if grant.executed {
            panic!("Grant already executed");
        }

        let mut signatures: Map<u32, Vec<Address>> = env
            .storage()
            .instance()
            .get(&SIGNATURES)
            .unwrap_or(Map::new(&env));

        let mut grant_sigs: Vec<Address> = signatures.get(grant_index).unwrap_or(Vec::new(&env));

        if !grant_sigs.contains(&signatory) {
            grant_sigs.push_back(signatory.clone());
            signatures.set(grant_index, grant_sigs.clone());
            env.storage().instance().set(&SIGNATURES, &signatures);

            env.events()
                .publish((GRANT_APPROVED,), (grant_index, signatory.clone()));
        }

        let threshold: u32 = env.storage().instance().get(&THRESHOLD).unwrap_or(1);

        if grant_sigs.len() >= threshold {
            Self::disburse_grant_internal(&env, &mut grants, grant_index);
        }
    }

    /// Disburse a pending grant once the approval threshold has been met.
    pub fn disburse_grant(env: Env, grant_index: u32) {
        let mut grants: Vec<GrantRecommendation> = env
            .storage()
            .instance()
            .get(&GRANTS)
            .unwrap_or(Vec::new(&env));

        if grant_index >= grants.len() {
            panic!("Invalid grant index");
        }

        let grant = grants.get(grant_index).unwrap();
        if grant.executed {
            panic!("Grant already executed");
        }

        let signatures: Map<u32, Vec<Address>> = env
            .storage()
            .instance()
            .get(&SIGNATURES)
            .unwrap_or(Map::new(&env));

        let grant_sigs: Vec<Address> = signatures.get(grant_index).unwrap_or(Vec::new(&env));
        let threshold: u32 = env.storage().instance().get(&THRESHOLD).unwrap_or(1);

        if grant_sigs.len() < threshold {
            panic!("Approval threshold not met");
        }

        Self::disburse_grant_internal(&env, &mut grants, grant_index);
    }

    fn disburse_grant_internal(env: &Env, grants: &mut Vec<GrantRecommendation>, grant_index: u32) {
        let grant = grants.get(grant_index).unwrap();
        let token_address: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("TOKEN"))
            .expect("Token not set");

        let client = token::Client::new(env, &token_address);
        let contract_address = env.current_contract_address();
        client.transfer(&contract_address, &grant.recipient, &grant.amount);

        grants.set(
            grant_index,
            GrantRecommendation {
                recipient: grant.recipient.clone(),
                amount: grant.amount,
                memo: grant.memo.clone(),
                executed: true,
            },
        );
        env.storage().instance().set(&GRANTS, grants);

        env.events()
            .publish((GRANT_DISBURSED,), (grant_index, grant.amount));
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

    /// Get registered signatories
    pub fn get_signatories(env: Env) -> Vec<Address> {
        env.storage()
            .instance()
            .get(&SIGNATORIES)
            .unwrap_or(Vec::new(&env))
    }

    /// Get the current approval threshold
    pub fn get_threshold(env: Env) -> u32 {
        env.storage().instance().get(&THRESHOLD).unwrap_or(1)
    }

    /// Get the collected signatures for a given grant index
    pub fn get_grant_signatures(env: Env, grant_index: u32) -> Vec<Address> {
        let signatures: Map<u32, Vec<Address>> = env
            .storage()
            .instance()
            .get(&SIGNATURES)
            .unwrap_or(Map::new(&env));
        signatures.get(grant_index).unwrap_or(Vec::new(&env))
    }
}
