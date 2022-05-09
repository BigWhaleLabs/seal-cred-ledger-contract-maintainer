# SealCred Ledger contract maintainer

Maintains the actuallity of the SealCred Ledger Merkle tree roots.

## Installation and local launch

1. Clone this repo: `git clone https://github.com/BigWhaleLabs/seal-cred-ledger-contract-maintainer`
2. Create `.env` with the environment variables listed below
3. Run `yarn` in the root folder
4. Run `yarn develop`

And you should be good to go! Feel free to fork and submit pull requests.

## Environment variables

| Name                         | Description                       |
| ---------------------------- | --------------------------------- |
| `ETH_NETWORK`                | Ethereum network                  |
| `INFURA_PROJECT_ID`          | Infura project id                 |
| `CONTRACT_ADDRESS`           | Dosu invites contract address     |
| `CONTRACT_OWNER_PRIVATE_KEY` | Private key of the contract owner |

Also, please, consider looking at `.env.sample`.
