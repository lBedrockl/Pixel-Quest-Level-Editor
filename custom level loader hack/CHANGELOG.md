# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.1] Bedrock update
## Changed
- Fixed art mistake in one of the bg layers

## [2.0.0]
## Changed
- MAJOR Consistent dashes that last exactly 7 frames
- Improved sample level to showcase 10 idols, and added background

## Fixed
- Tutorial bubbles will only appear on the original levels
- The game doesn't crash even with every level empty and skipped

## [1.0.0]
First working version
### Added
- Level name is shown on the Level select menu, HUD, and Game over menu
- Special characters that are similar to existing ones, like / and \\
- Background is the same color of the sky, to beautify bigger vertical levels
- W key can confirm menus additionally to the space key
- You can have up to 99 custom levels at the same time
- A bin file: ttBIGGER's sample level
- ttBIGGER name on the Credits
- hack version shown on the left bottom corner of the Title menu

### Fixed
- Black characters being rendered on longer sentences when quality higher than "low"
- Special character that were mapped wrong
- Sprite for the lasers is now crisp (enhanced by Bedrock)

### Changed
- Total levels counting and level ordering is centralized
- Levels as stored as XML, not as ByteArrays
- In the Level select menu, the level number takes less space
- Idols are shown numerically, so an unlimited number can be used on the Level select menu, HUD, and Game over menu
- HUD buttons moved to the left
- Empty levels are skipped, so you don't need to always replace them consecutively
- Exiting a level, or finishing it, returns to level select menu instead of the main menu
- bin level file names are just numbered instead of being separated into easy/medium/hard

### Removed
- Tutorial levels, the first 5 levels are considered regular
- Level lock
- Page lock
- Score on the Game over menu and Level select menu
- Best Time on the Level select menu
- Story on lvl 1, 17, 33, and after beating the last level
- All original levels were removed

## In-Game Time hack
This had as a base the IGT hack by roblox8192, found at https://www.speedrun.com/pq/resources
### Added
- In game timer