# Development

## Environment

### Local

- `$ solana config set --url localhost`
- Run local ledger `$ solana-test-validator` or `$ solana-test-validator --reset for a new ledger`

## Compile
- `$ anchor build` or `$ npm run build`

## Deploy
- `$ anchor deploy` or `$ npm run deploy`

# Learning

[This](https://lorisleiva.com/create-a-solana-dapp-from-scratch) is by far the best tutorial in the world 

# Functionallity

## Accounts

```rust
pub struct WheelOfFortune {
    pub timestamp: i64
    pub value: i8
}

pub struct WheelOfFortuneBet {
    pub author: Pubkey,
    pub game: Pubkey, // Which game is being bet on
    pub timestamp: i64,
    pub value: i8
}
```

## Process

1. a game / WheelOfFortune account is instanciated by a user (fn: start_game)
    - This is a transaction with a instruction to create a new game. (
    - The rent for the game is 2 years to make the transaction exempt and the fee is carried by the owner (meaning ME!!)
        - currently the account is 11 bytes which is around 0,001 SOL for 2 years rent.
    - The game will initiate with 0 as value as this is the non-played state.
    - If a game is already running (value is not 0) a new game is not allowed to be created and the transaction will be rolled back.
2. a user can instanciate a bet WheelOfFortuneBet with the value the user is betting on.
    - Currently the bet is always 1 GAMBL coin TODO: this needs to be variable.
    - With instanciate a bet the betted GAMBL coins are transfered to the program owner (meaning ME!!)
    - The size of a bet account is 81 bytes which translates to 0,0015 SOL for 2 years / rent except.
    - The full fee of a bet is the rent exempt costs of the bet account (81 bytes) aswell as the rent exempt game account (11 bytes) itself.
      - This ensures that the game runs autonomous as the rent will always be payed.
      - This fee could theoretically be dropped to half a game account rent exempt since at least 2 people are needed for a game but this counts as **profit** for us.
    - If the game is not active (value > 0) the an error is thrown and the transaction is rolled back
3. Any user can at any point initiate the rolling of the WheelOfFortune game.
    - This is necessary since we can't schedule this automatically on the block chain as of right now.
    - Rolling does not create an account and is therefore free of charge.
    - The program will generate a random number 1-255 (0 is reserved for the non-played state).
    - After a value is determined the payout is calculated. TODO: Create nice math formulas for this.
      - If only one player bet correctly they get the full pool.
      - If more than one player bet on the correct value the split is calculated between them depending on their initial bet.
        - Each winning players percentage is caluclated by cumulating all winners bet and dividing it by their specific amount.
        - The players percentage is then calculated against the full pool to determine their winnings.
    - Each winners winnings is the tranferred to their wallet.
3. => Step 1

# TODOS

- [] Block game creation if a game is active
- [] Block betting on old games
- [] Make the program owner (me) pay for game creation
- [] Increase the fee of a bet to make up for game creation fee
- [] Include the whole GAMBL token transfer functionallity
