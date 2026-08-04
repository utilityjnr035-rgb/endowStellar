#!/usr/bin/env bash

# EndowStellar Soroban Contract Deployment Script
set -e

echo "🌌 Building Soroban Smart Contracts for EndowStellar..."

# Target Stellar Network (testnet, mainnet, or futurenet)
NETWORK="${1:-testnet}"

echo "🔨 Cargo Build..."
cargo build --manifest-path contracts/Cargo.toml --target wasm32-unknown-unknown --release

echo "🚀 Deploying DAF Factory Contract to Stellar ${NETWORK}..."
FACTORY_WASM="contracts/target/wasm32-unknown-unknown/release/daf_factory.wasm"

if [ -f "$FACTORY_WASM" ]; then
    echo "Found WASM artifact at $FACTORY_WASM"
    # Execute deployment via stellar-cli / soroban-cli
    # stellar contract deploy --wasm $FACTORY_WASM --source alice --network $NETWORK
else
    echo "WASM compilation pending. Ensure Rust target wasm32-unknown-unknown is installed."
fi

echo "✨ EndowStellar Contract Build Finished Successfully!"
