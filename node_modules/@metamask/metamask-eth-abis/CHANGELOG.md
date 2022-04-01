# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.0.0]
### Changed
- [BREAKING] Harden types on ABI objects ([#6](https://github.com/MetaMask/metamask-eth-abis/pull/6))
  - If you have a function that takes an argument typed via `typeof abiERC1155`, `typeof abiERC20`, or `typeof abiERC721,` that argument must now literally be the ABI object you are referencing instead of a general ABI shape.


## [2.1.0]
### Added
- Add Software License ([#3](https://github.com/MetaMask/metamask-eth-abis/pull/3))

## [2.0.0]
### Added
- Add ERC-20, ERC-721, and ERC-1155 ABIs ([#1](https://github.com/MetaMask/metamask-eth-abis/pull/1))

[Unreleased]: https://github.com/MetaMask/metamask-eth-abis/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/MetaMask/metamask-eth-abis/compare/v2.1.0...v3.0.0
[2.1.0]: https://github.com/MetaMask/metamask-eth-abis/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/MetaMask/metamask-eth-abis/releases/tag/v2.0.0
