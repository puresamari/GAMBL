use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;
use anchor_spl::token::{self, Token, Mint, TokenAccount, Transfer};

declare_id!("9781DbQ5tRn1fUi7KrcnuaQq52138QaJCcQ9coX1ydFF");

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const WHEEL_VALUE_LENGTH: usize = 1;
const BET_LENGTH: usize = 8; // 64 bit

#[account]
pub struct WheelOfFortune {
  pub timestamp: i64,
  pub value: u8
}

// Add a constant on the WheelOfFortune account that provides its total size.
impl WheelOfFortune {
  const LEN: usize = DISCRIMINATOR_LENGTH
    + TIMESTAMP_LENGTH // timestamp
    + WHEEL_VALUE_LENGTH; // value
}

#[account]
pub struct WheelOfFortuneBet {
  pub author: Pubkey,
  pub game: Pubkey, // Which game is being bet on
  pub timestamp: i64,
  pub value: u8, // Wheel value the wallet betted on
  // pub token_account: Pubkey, // Which game is being bet on
  pub bet: u64 // betted amount
}


// Add a constant on the WheelOfFortuneBet account that provides its total size.
impl WheelOfFortuneBet {
  const LEN: usize = DISCRIMINATOR_LENGTH
      + PUBLIC_KEY_LENGTH // author.
      + PUBLIC_KEY_LENGTH // game.
      + TIMESTAMP_LENGTH // timestamp.
      + WHEEL_VALUE_LENGTH // value
      + BET_LENGTH; // betted amount
}


#[program]
pub mod gambl {
  use super::*;
  // TODO: 11 byte renting fee should be payed by owner wallet and not users
  pub fn start_game(ctx: Context<StartGame>) -> ProgramResult {
    // TODO: Block if game is in progress
    let game: &mut Account<WheelOfFortune> = &mut ctx.accounts.game;
    let clock: Clock = Clock::get().unwrap();

    game.timestamp = clock.unix_timestamp;
    game.value = 0;
    msg!("GAME: {}", game.value);

    Ok(())
  }

  // TODO: Needs to collect the 11 byte rent fee
  pub fn make_bet(ctx: Context<MakeBet>, game: Pubkey, value: u8, bet_fee: u64) -> ProgramResult {
    
    token::transfer(ctx.accounts.transfer_ctx(), bet_fee)?;
    ctx.accounts.author_token.reload()?;
    ctx.accounts.receiver_token.reload()?;

    let bet: &mut Account<WheelOfFortuneBet> = &mut ctx.accounts.bet;
    let author: &Signer = &ctx.accounts.author;
    let clock: Clock = Clock::get().unwrap();

    if value == 0 {
      return Err(ErrorCode::BetValue0Reserved.into())
    }
    
    bet.author = *author.key;
    bet.timestamp = clock.unix_timestamp;
    bet.game = game;
    bet.bet = bet_fee;
    bet.value = value;
    
    Ok(())
  }

  // TODO: This is janky again
  pub fn play(ctx: Context<PlayGame>) -> ProgramResult {
    let game: &mut Account<WheelOfFortune> = &mut ctx.accounts.game;
    let clock: Clock = Clock::get().unwrap();

    let rand_pub_key: [u8; 32] = game.key().to_bytes();
    
    // // TODO: only needs 9 bits but 16 is for safety because idk...
    let mut number: u32 = (clock.unix_timestamp % 254) as u32;
    for n in rand_pub_key {
      // Just throw as many uncontrollable variations in the mix as possible
      number = ((game.timestamp % 254) as u32 + number + n as u32) % 254;
    }
    // // TODO: I created a very janky random number generator since the rand package doesn't work for some reason. Please make the solution better!!
    game.value = (number % 254 + 1 - 128) as u8;

    Ok(())
  }
  
}

#[derive(Accounts)]
pub struct StartGame<'info> {
  // TODO: Somehow make the system wallet pay instead of the user lol
  #[account(init, payer = author, space = WheelOfFortune::LEN)]
  pub game: Account<'info, WheelOfFortune>,

  #[account(mut)]
  pub author: Signer<'info>,

  #[account(address = system_program::ID)]
  pub system_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct MakeBet<'info> {
  #[account(init, payer = author, space = WheelOfFortuneBet::LEN)]
  pub bet: Account<'info, WheelOfFortuneBet>,
  
  #[account(mut)]
  pub author: Signer<'info>,
  #[account(mut)]
  pub author_token: Account<'info, TokenAccount>,

  // // TODO: This should always be either the account owner or the account itself if possible and therefore not a transaction info
  #[account(mut)]
  pub receiver_token: Account<'info, TokenAccount>,
  
  #[account(address = system_program::ID)]
  pub system_program: AccountInfo<'info>,

  // TODO: Somehow have the mint baked in. it should always be GAMBL
  pub mint: Account<'info, Mint>,
  pub token_program: Program<'info, Token>,
}


impl<'info> MakeBet<'info> {
  fn transfer_ctx(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
    CpiContext::new(
      self.token_program.to_account_info(),
      Transfer {
        from: self.author_token.to_account_info(),
        to: self.receiver_token.to_account_info(),
        authority: self.author.to_account_info()
      }
    )
  }
  // Maybe later at some point we'll implement so that a token associated account is created for the bet account so we can make sure the tokens are actually there
//   fn initialize_account_ctx(&self) -> CpiContext<'_, '_, '_, 'info, InitializeAccount<'info>> {
//     CpiContext::new(
//       self.token_program.to_account_info(),
//       InitializeAccount {
//         rent: self.bet.to_account_info(),
//         account: self.bet.to_account_info(),
//         mint: self.mint.to_account_info(),
//         authority: self.bet.to_account_info(),
//         // from: self.author_token.to_account_info(),
//         // to: self.receiver_token.to_account_info(),
//         // authority: self.author.to_account_info()
//       }
//     )
//   }
}

#[derive(Accounts)]
pub struct PlayGame<'info> {
  #[account(mut)]
  pub game: Account<'info, WheelOfFortune>,
  
  #[account(address = system_program::ID)]
  pub system_program: AccountInfo<'info>,
}

#[error]
pub enum ErrorCode {
    #[msg("The provided value 0 is reserved. Only 1 - 255 is allowed")]
    BetValue0Reserved,
}