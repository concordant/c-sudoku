# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security

## [1.1.0] - 2021-07-22
### Added

- Provide a service worker file in public repository
- Add a callback to receive notifications when a crdt is updated

### Changed

- Group the MVMap updates during a reset/reconnection
- Remove frequent pooling but keep a backup call when it has not received a new version for a while

## [1.0.1] - 2021-05-17
### Changed
- Update documentation

### Fixed
- Fix concurrency between edits and remote updates
