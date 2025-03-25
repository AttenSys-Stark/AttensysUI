# Argent Session Keys Integration

## Overview

This document provides information about the integration of Argent Session Keys in the Attensys application. Session keys allow users to sign and authorize transactions once, then execute multiple transactions without requiring additional signatures for a limited time period.

## Features

- **Time-limited Sessions**: Sessions automatically expire after a set time (24 hours by default)
- **Real-time Expiry Timer**: Visual countdown showing remaining session time
- **Clear Session Option**: Manually revoke sessions at any time
- **Transaction Execution**: Simplified transaction flow without signature requests once a session is active

## Demo Page

A dedicated Session Keys Demo page is available at `/session-demo`. This page provides:

- An explanation of session keys and their benefits
- A wallet connection interface
- A session key management component
- Example functionality for executing transactions using session keys

## Integration Components

### 1. Session Keys Utility (`src/utils/sessionKeys.ts`)

This file contains utility functions and constants for session key management:

- `generateSessionKey`: Creates a new session key pair
- `SESSION_EXPIRY_TIME`: Default expiry time for sessions (24 hours)
- `ATTENSYS_CONTRACT_ADDRESS`: Contract address for demo transactions

### 2. Session Keys Hook (`src/hooks/useSessionKeys.ts`)

A custom React hook that provides session key management functionality:

- `createSession()`: Creates and activates a new session
- `clearSession()`: Revokes the current session
- Session state management (active session, session account, etc.)
- Automatic session expiry handling

### 3. Session Key Manager Component (`src/components/session/SessionKeyManager.tsx`)

A reusable component for session key management that provides:

- UI for creating and managing sessions
- Compact mode for header integration
- Full mode for dedicated pages
- Real-time session expiry timer
- Transaction execution functionality

## Integration Points

1. **Header Integration**: The `SessionKeyManager` component (compact mode) is included in the application header for easy access.

2. **Demo Page**: The `/session-demo` route provides a complete demonstration of session key functionality.

3. **Wallet Connection**: Session keys work with the existing wallet connection flow using Argent X smart account, Argent Mobile or Web wallet.

## Usage Instructions

### For Users

1. Connect your Argent X smart account, Argent Mobile or Web wallet 
2. Create a session by clicking the "Create Session" button
3. Approve the session creation transaction in your wallet
4. Once active, the session allows the application to execute transactions without additional signatures
5. Monitor the remaining session time via the expiry timer
6. Clear the session manually if needed

### For Developers

1. Import and use the `useSessionKeys` hook in components that need session key functionality
2. Use the `SessionKeyManager` component for UI integration
3. Execute transactions through the session account when available

## Limitations

- Only compatible with Argent X smart account, Argent Mobile and Web wallet (Argent X standard account is not supported)
- Limited to specific contract functions defined in the session policy
- Maximum transaction value is constrained by session policy

## Future Improvements

- Support for more wallet providers
- Customizable session policies
- Extended transaction types support
- Enhanced error handling and recovery

---

For technical details about the implementation, refer to the source code in `src/utils/sessionKeys.ts`, `src/hooks/useSessionKeys.ts`, and `src/components/session/SessionKeyManager.tsx`. 

More info available at [Argent official docs](https://docs.argent.xyz/aa-use-cases/session-keys).
