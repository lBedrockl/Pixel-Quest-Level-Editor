# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.2.0] - 2025-04-13

### Added
- Snow when tileset is lostgifts
- Main menu has the hack name in large font
- Support for multiple tilesets on the help menu
- Text kerning
- Drowning animation for lost gifts and default tileset, with stats
- Stats for death by 'Bottomless Pit'

### Changed
- The the main menu has the background of the tileset of the most recent played map (or the first map when no lvl has been played)
- All menus updated to the lost gifts format
- External websites now redirect to speedrun.com
- Reused the menus backgrounds
- The first level now includes lava and 'drowning vines'

## [3.1.0] - 2025-04-08

### Added
- Lost Gifts image assets
- Support for multiple tilesets. Added lostgifts tileset
- Sample level showcasing what's new: Winter Crusher

### Changed
- Crushers collide with each other
- All 'CollisionRectangle' renamed to 'hitbox'
- Image assets organized into specific folders to support multiple tilesets

### Removed
- Unused level object sawBladeArm

### Fixed
- Quitting no longer freezes the game after going from a level with a long name to one with a short name and vice-versa


## [3.0.0] - 2025-04-05

### Added
- This changelog is a different file from main
- Logger and LOG_LEVEL to help debugging
- Small font has all ASCII printable characters (character code 32-127), plus © and the symbol � for the unknown chars
- Diacritis of all ISO-8859-1 (Latin1) are stripped to its equivalent ASCII character
- The game remembers if the sounds are muted or not: if you close the game muted, it will open muted
- Level author
- Sample levels showcasing what's new: 'RED light, GREEN light', 'Boundless' and 'The platforms ran away with my idols!'

### Changed
- The level object 'Crusher' is now always referenced as such, instead of 'Column' or 'Pillar'
- The level object 'VerticalLaserTurret' is now always referenced as such, instead of 'VerticalTurret' or 'TurretNorthSouth'. The image is just 'VerticalTurret'
- The level object 'HorizontalBulletTurret' is now always referenced as such, instead of 'HorizontalTurret' or 'TurretEastWest'. The image is just 'HorizontalTurret'
- Assets are now divided into folders by type
- Crusher now has 8 frames instead of 15
- Fonts renamed to small/medium/large and the assets moved to a 'font' folder
- Level assets moved to a 'level' folder
- Streamlined getting a tile on a tilesheet. Texts and Levels load faster now
- Level local data is saved and loaded in a more explicit way
- Levels created with the editor will keep localData even if you change their order
- Level Select menu, Game Over menu and GUI will ajdust to shorter or longer level name + author name combinations
- Maps without a name will appear as 'Untitled Map'
- Level select is now a 3x3 grid instead of 4x4 to display more info
- Level number moved to the corner on the Game Over menu
- First sample level renamed to: Lots of Keys 'n Idols

### Removed
- Score and level object points
- Guide button when playing a level
- BufferTime to help debugging. Speedrun trace info shows only on level complete

### Fixed
- Visual of MediumPlatformPNG is no longer distorted
- Stompers now disapear at the bottom of the screen and don't break the game
- Lvls 40 to 49 were being created 3 times
- A crusher going up now has the same behavior as the one going down, and only makes the screen shake if the collision is on screen
- Crusher now hit the border of the screen and don't break the game
- Crusher now doesn't have height limit
- Longer texts now display correctly without needing to set quality to low
- Bottomless pit now kills Rex and don't break the game
- Rex can now bonk an open ceiling and don't break the game
- Vertical platform now can go up or down offscreen and don't break the game
- Saw now can go up or down offscreen and don't break the game
- VerticalLaserTurret now can shoot up or down offscreen and don't break the game

## [2.1.0] - 2025-03-10

### Added
- Merge with Speedrun v1.1.0
- Dates on the changelog

### Changed
- GameOver screen now accommodates both the "Time Since" and the level name better

### Removed
- Time Since can no longer be started at lvl 6
- Time no longer displayed on GameOver screen upon death

## [2.0.1] - 2024-01-31

### Changed
- Fixed art mistake in one of the bg layers

## [2.0.0] - 2023-12-05

### Changed
- MAJOR Consistent dashes that last exactly 7 frames
- Improved sample level to showcase 10 idols, and added background

### Fixed
- Tutorial bubbles will only appear on the original levels
- The game doesn't crash even with every level empty and skipped

## [1.0.0] - 2023-12-05

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

## In-Game Time hack - 2022-02-26
This had as a base the IGT hack by roblox8192, found at https://www.speedrun.com/pq/resources
### Added
- In game timer
