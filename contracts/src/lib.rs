#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Env, String, Symbol};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Certificate {
    pub symbol: Symbol,
    pub student: String,
    pub course_name: String,
    pub issue_date: u64,
}

#[contract]
pub struct CertificateContract;

#[contractimpl]
impl CertificateContract {
    /// Issue a new certificate to a student for a specific course with a custom symbol.
    pub fn issue(env: Env, symbol: Symbol, student: String, course_name: String) -> Certificate {
        let issue_date = env.ledger().timestamp();

        let cert = Certificate {
            symbol: symbol.clone(),
            student,
            course_name,
            issue_date,
        };

        env.storage().instance().set(&symbol, &cert);

        cert
    }

    /// Retrieve a certificate by its symbol.
    pub fn get_certificate(env: Env, symbol: Symbol) -> Certificate {
        env.storage().instance().get(&symbol).unwrap()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Ledger, Env};

    #[test]
    fn issues_and_loads_certificate_with_custom_symbol() {
        let env = Env::default();
        env.ledger().with_mut(|ledger| ledger.timestamp = 1_234);

        let symbol = symbol_short!("SOLID");
        let student = String::from_str(&env, "Ada Lovelace");
        let course_name = String::from_str(&env, "Rust 101");

        let issued = CertificateContract::issue(
            env.clone(),
            symbol.clone(),
            student.clone(),
            course_name.clone(),
        );

        assert_eq!(
            issued,
            Certificate {
                symbol: symbol.clone(),
                student,
                course_name,
                issue_date: 1_234,
            }
        );

        let stored = CertificateContract::get_certificate(env, symbol);
        assert_eq!(stored, issued);
    }
}
