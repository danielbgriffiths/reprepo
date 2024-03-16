// External Usages
use argon2::{Config, hash_raw, Variant, Version};
use tauri_plugin_stronghold::Builder;

pub fn create_stronghold_plugin() -> Builder {
    Builder::new(|password| {
        let config = Config {
            lanes: 4,
            mem_cost: 10_000,
            time_cost: 10,
            variant: Variant::Argon2id,
            version: Version::Version13,
            ..Default::default()
        };

        let salt = "your-salt".as_bytes();

        let key = hash_raw(password.as_ref(), salt, &config).expect("failed to hash password");

        key.to_vec()
    })
}