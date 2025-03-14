export const nftAbi = [
  {
    interface_name: "attendsys::contracts::AttenSysNft::IAttenSysNft",
    name: "AttenSysNft",
    type: "impl",
  },
  {
    members: [
      {
        name: "low",
        type: "core::integer::u128",
      },
      {
        name: "high",
        type: "core::integer::u128",
      },
    ],
    name: "core::integer::u256",
    type: "struct",
  },
  {
    items: [
      {
        inputs: [
          {
            name: "recipient",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "token_id",
            type: "core::integer::u256",
          },
        ],
        name: "mint",
        outputs: [],
        state_mutability: "external",
        type: "function",
      },
    ],
    name: "attendsys::contracts::AttenSysNft::IAttenSysNft",
    type: "interface",
  },
  {
    interface_name: "openzeppelin_token::erc721::interface::ERC721ABI",
    name: "ERC721Impl",
    type: "impl",
  },
  {
    members: [
      {
        name: "snapshot",
        type: "@core::array::Array::<core::felt252>",
      },
    ],
    name: "core::array::Span::<core::felt252>",
    type: "struct",
  },
  {
    name: "core::bool",
    type: "enum",
    variants: [
      {
        name: "False",
        type: "()",
      },
      {
        name: "True",
        type: "()",
      },
    ],
  },
  {
    members: [
      {
        name: "data",
        type: "core::array::Array::<core::bytes_31::bytes31>",
      },
      {
        name: "pending_word",
        type: "core::felt252",
      },
      {
        name: "pending_word_len",
        type: "core::integer::u32",
      },
    ],
    name: "core::byte_array::ByteArray",
    type: "struct",
  },
  {
    items: [
      {
        inputs: [
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        name: "balance_of",
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            name: "token_id",
            type: "core::integer::u256",
          },
        ],
        name: "owner_of",
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            name: "from",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "to",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "token_id",
            type: "core::integer::u256",
          },
          {
            name: "data",
            type: "core::array::Span::<core::felt252>",
          },
        ],
        name: "safe_transfer_from",
        outputs: [],
        state_mutability: "external",
        type: "function",
      },
      {
        inputs: [
          {
            name: "from",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "to",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "token_id",
            type: "core::integer::u256",
          },
        ],
        name: "transfer_from",
        outputs: [],
        state_mutability: "external",
        type: "function",
      },
      {
        inputs: [
          {
            name: "to",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "token_id",
            type: "core::integer::u256",
          },
        ],
        name: "approve",
        outputs: [],
        state_mutability: "external",
        type: "function",
      },
      {
        inputs: [
          {
            name: "operator",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "approved",
            type: "core::bool",
          },
        ],
        name: "set_approval_for_all",
        outputs: [],
        state_mutability: "external",
        type: "function",
      },
      {
        inputs: [
          {
            name: "token_id",
            type: "core::integer::u256",
          },
        ],
        name: "get_approved",
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            name: "owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "operator",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        name: "is_approved_for_all",
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            name: "interface_id",
            type: "core::felt252",
          },
        ],
        name: "supports_interface",
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [
          {
            type: "core::byte_array::ByteArray",
          },
        ],
        state_mutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [
          {
            type: "core::byte_array::ByteArray",
          },
        ],
        state_mutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            name: "token_id",
            type: "core::integer::u256",
          },
        ],
        name: "token_uri",
        outputs: [
          {
            type: "core::byte_array::ByteArray",
          },
        ],
        state_mutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            name: "tokenId",
            type: "core::integer::u256",
          },
        ],
        name: "ownerOf",
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            name: "from",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "to",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "tokenId",
            type: "core::integer::u256",
          },
          {
            name: "data",
            type: "core::array::Span::<core::felt252>",
          },
        ],
        name: "safeTransferFrom",
        outputs: [],
        state_mutability: "external",
        type: "function",
      },
      {
        inputs: [
          {
            name: "from",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "to",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "tokenId",
            type: "core::integer::u256",
          },
        ],
        name: "transferFrom",
        outputs: [],
        state_mutability: "external",
        type: "function",
      },
      {
        inputs: [
          {
            name: "operator",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "approved",
            type: "core::bool",
          },
        ],
        name: "setApprovalForAll",
        outputs: [],
        state_mutability: "external",
        type: "function",
      },
      {
        inputs: [
          {
            name: "tokenId",
            type: "core::integer::u256",
          },
        ],
        name: "getApproved",
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            name: "owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "operator",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        name: "isApprovedForAll",
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            name: "tokenId",
            type: "core::integer::u256",
          },
        ],
        name: "tokenURI",
        outputs: [
          {
            type: "core::byte_array::ByteArray",
          },
        ],
        state_mutability: "view",
        type: "function",
      },
    ],
    name: "openzeppelin_token::erc721::interface::ERC721ABI",
    type: "interface",
  },
  {
    inputs: [
      {
        name: "base_uri",
        type: "core::byte_array::ByteArray",
      },
      {
        name: "name_",
        type: "core::byte_array::ByteArray",
      },
      {
        name: "symbol",
        type: "core::byte_array::ByteArray",
      },
    ],
    name: "constructor",
    type: "constructor",
  },
  {
    kind: "struct",
    members: [
      {
        kind: "key",
        name: "from",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "key",
        name: "to",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "key",
        name: "token_id",
        type: "core::integer::u256",
      },
    ],
    name: "openzeppelin_token::erc721::erc721::ERC721Component::Transfer",
    type: "event",
  },
  {
    kind: "struct",
    members: [
      {
        kind: "key",
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "key",
        name: "approved",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "key",
        name: "token_id",
        type: "core::integer::u256",
      },
    ],
    name: "openzeppelin_token::erc721::erc721::ERC721Component::Approval",
    type: "event",
  },
  {
    kind: "struct",
    members: [
      {
        kind: "key",
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "key",
        name: "operator",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "approved",
        type: "core::bool",
      },
    ],
    name: "openzeppelin_token::erc721::erc721::ERC721Component::ApprovalForAll",
    type: "event",
  },
  {
    kind: "enum",
    name: "openzeppelin_token::erc721::erc721::ERC721Component::Event",
    type: "event",
    variants: [
      {
        kind: "nested",
        name: "Transfer",
        type: "openzeppelin_token::erc721::erc721::ERC721Component::Transfer",
      },
      {
        kind: "nested",
        name: "Approval",
        type: "openzeppelin_token::erc721::erc721::ERC721Component::Approval",
      },
      {
        kind: "nested",
        name: "ApprovalForAll",
        type: "openzeppelin_token::erc721::erc721::ERC721Component::ApprovalForAll",
      },
    ],
  },
  {
    kind: "enum",
    name: "openzeppelin_introspection::src5::SRC5Component::Event",
    type: "event",
    variants: [],
  },
  {
    kind: "enum",
    name: "attendsys::contracts::AttenSysNft::AttenSysNft::Event",
    type: "event",
    variants: [
      {
        kind: "flat",
        name: "ERC721Event",
        type: "openzeppelin_token::erc721::erc721::ERC721Component::Event",
      },
      {
        kind: "flat",
        name: "SRC5Event",
        type: "openzeppelin_introspection::src5::SRC5Component::Event",
      },
    ],
  },
];
