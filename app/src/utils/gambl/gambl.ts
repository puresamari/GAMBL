export type Gambl = {
  "version": "0.1.0",
  "name": "gambl",
  "instructions": [
    {
      "name": "startGame",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "author",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "makeBet",
      "accounts": [
        {
          "name": "bet",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "author",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authorToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receiverToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "game",
          "type": "publicKey"
        },
        {
          "name": "value",
          "type": "i8"
        },
        {
          "name": "betFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "play",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "wheelOfFortune",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "value",
            "type": "i8"
          }
        ]
      }
    },
    {
      "name": "wheelOfFortuneBet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "author",
            "type": "publicKey"
          },
          {
            "name": "game",
            "type": "publicKey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "value",
            "type": "i8"
          },
          {
            "name": "bet",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "BetValue0Reserved",
      "msg": "The provided value 0 is reserved. Only 1 - 255 is allowed"
    }
  ]
};

export const IDL: Gambl = {
  "version": "0.1.0",
  "name": "gambl",
  "instructions": [
    {
      "name": "startGame",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "author",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "makeBet",
      "accounts": [
        {
          "name": "bet",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "author",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authorToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receiverToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "game",
          "type": "publicKey"
        },
        {
          "name": "value",
          "type": "i8"
        },
        {
          "name": "betFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "play",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "wheelOfFortune",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "value",
            "type": "i8"
          }
        ]
      }
    },
    {
      "name": "wheelOfFortuneBet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "author",
            "type": "publicKey"
          },
          {
            "name": "game",
            "type": "publicKey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "value",
            "type": "i8"
          },
          {
            "name": "bet",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "BetValue0Reserved",
      "msg": "The provided value 0 is reserved. Only 1 - 255 is allowed"
    }
  ]
};
