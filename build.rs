use cainome::rs::Abigen;
use std::collections::HashMap;

fn main() {
    // Aliases added from the ABI
    let mut aliases = HashMap::new();

    let coursecontract_abigen =
        Abigen::new("coursecontract", "./abi/coursecontract_contract.abi.json").with_types_aliases(aliases).with_derives(vec!["serde::Serialize".to_string(), "serde::Deserialize".to_string()]);

        coursecontract_abigen
            .generate()
            .expect("Fail to generate bindings")
            .write_to_file("./src/abi/coursecontract_contract.rs")
            .unwrap();
}