use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("9781DbQ5tRn1fUi7KrcnuaQq52138QaJCcQ9coX1ydFF");

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const WHEEL_VALUE_LENGTH: usize = 1;

#[account]
pub struct WheelOfFortune {
  pub timestamp: i64,
  pub value: i8
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
  pub value: i8
}


// Add a constant on the WheelOfFortuneBet account that provides its total size.
impl WheelOfFortuneBet {
  const LEN: usize = DISCRIMINATOR_LENGTH
      + PUBLIC_KEY_LENGTH // author.
      + PUBLIC_KEY_LENGTH // game.
      + TIMESTAMP_LENGTH // timestamp.
      + WHEEL_VALUE_LENGTH; // value.
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

    Ok(())
  }

  // TODO: Should be able to determine the amount to bet
  // TODO: Needs to collect the 11 byte rent fee
  pub fn make_bet(ctx: Context<MakeBet>, game: Pubkey, value: i8) -> ProgramResult {
    let bet: &mut Account<WheelOfFortuneBet> = &mut ctx.accounts.bet;
    let author: &Signer = &ctx.accounts.author;
    let clock: Clock = Clock::get().unwrap();

    if value == 0 {
      return Err(ErrorCode::BetValue0Reserved.into())
    }

    bet.author = *author.key;
    bet.timestamp = clock.unix_timestamp;
    bet.game = game;
    
    Ok(())
  }

  // TODO: Block finished games from being played again.
  pub fn play(ctx: Context<PlayGame>) -> ProgramResult {
    let game: &mut Account<WheelOfFortune> = &mut ctx.accounts.game;
    let clock: Clock = Clock::get().unwrap();

    // TODO: I created a very janky random number generator since the rand package doesn't work for some reason. Please make the solution better!!

    game.value = ((clock.unix_timestamp / 4312) % 254 + 1) as i8;

    Ok(())
  }

  // pub fn send_tweet(ctx: Context<SendTweet>, topic: String, content: String) -> ProgramResult {
  //   let tweet: &mut Account<Tweet> = &mut ctx.accounts.tweet;
  //   let author: &Signer = &ctx.accounts.author;
  //   let clock: Clock = Clock::get().unwrap();

  //   if topic.chars().count() > 50 {
  //     return Err(ErrorCode::TopicTooLong.into())
  //   }

  //   if content.chars().count() > 280 {
  //     return Err(ErrorCode::ContentTooLong.into())
  //   }

  //   tweet.author = *author.key;
  //   tweet.timestamp = clock.unix_timestamp;
  //   tweet.topic = topic;
  //   tweet.content = content;

  //   Ok(())
  // }
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
  
  #[account(address = system_program::ID)]
  pub system_program: AccountInfo<'info>,
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