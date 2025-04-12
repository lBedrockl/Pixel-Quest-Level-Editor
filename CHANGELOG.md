# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.5.0] unreleased
### Added
- Added drown volume used for the drown animation in Lost Gifts, but will also work for custom death animation on any tileset

### Changed
- Box place now uses right click to not conflict with copy paste

### Fixed
- Paste now doesn't show or work while box place active
- Holding shift and ctrl does show red now

## [1.4.9]
### Added
- You can now copy paste using box place, cut and copy also works, doesn't work for volumes or objects "yet"
- The copied section has an outline
- Objects now also have a correct outline

### Changed
- Controls menu is now a drop down

### Fixed
- While box placing it will no longer cancel if mouse is moved off canvas
- You can now use right click to cancel a box place
- Right click and middle mouse can no longer draw to canvas, fixed bad code

## [1.4.8]
### Fixed
- All importing bugs are gone, yippe
- bin file name now stores the author name if defined ex: `My Level by Bedrock.bin`

## [1.4.7]
### Fixed
- Importing now changes tileset, I forgot to add that with the saving of it
- Clearing the canvas now changes the tileset back to Original

## [1.4.6]
### Added
- Bin files now store which tileset you exported with
- You can now add an author name to the level

### Fixed
- The level name is now required to download, silly mistake I made

## [1.4.51]
### Fixed
- Bug where importing cut off the sides and level name

## [1.4.5]
### Added
- Custom Tileset stuff wip

### Fixed
- CRLF bin files now work

### Changed
- Level name max length increased from 36 to 53 chars

## [1.4.4]
### Fixed
- Favicon was missing, moved to tileset folder

## [1.4.3]
### Added
- Outline to canvas
- Option to use ingame bg, changeable in tilesets

### Changed
- Background of canvas is now an image, improving performance
- Help text makes a tiny bit more sense

### Fixed
- When changing to layer via clicking containers the layer colors update correctly
- script fix for color of checkmark, its dynamic now, thank god
- Clicking off of selection containers is fully fixed, event listeners were on wrong thing oops

## [1.4.2]
### Added
- Custom colors per tileset, This was a pain to make

## [1.4.1]
### Added
- New hover visual for tile picker

### Fixed
- You can now scroll all the way to the side when the width is maxed at 100% zoom
- More robust tileset switcher
- The tile picker shouldn't be outside the box anymore

## [1.4.0]
### Added
- Dynamic tilesets
- New tileset dropdown

### Changed
- Interactable things more reactive

### Removed
- Losts gifts button

## [1.3.2]
### Added
- Little info popup for room size

### Changed
- Room size is now by tile
- Loading bin loads name into input
- Clear canvas resets room size
- Clear canvas and room size buttons look better
- Room size now shows in input boxes, updates on import
- When importing auto sets to all layer

### Fixed
- Losts gifts button doesnt reset anymore

## [1.3.1]
### Added
- Title links to GitHub page

### Changed
- Lost gifts toggle more noticeable

### Fixed
- Levels importing wrong, due to rounding

## [1.3.0]
### Added
- Lost gifts toggle
- Favicon

### Changed
- Better looking checkboxes
- Cleaned up platform sprites
- Tab now shows correct name

## [1.2.4]
### Changed
- When holding shift box is Red
- Box place outline is Lime
- Normal hover shows box where tile goes, and its Cyan
- Tilesheet now has cyan behind so transparent tiles are easier to see

### Fixed
- Should auto clear the cache

## [1.2.3]
### Added
- Box place visual upgrade

### Fixed
- Object placement fixed, oops
- No drag place while box place is on
- Clicking on the same tile will not reset it to first one

### Removed
- Red canvas for box place

## [1.2.2]
### Added
- Box placement
- Box remove
- Visual indication when in box place mode

### Changed
- Platforms are now crisp in the editor and indicate where the volume should be

### Fixed
- Auto resize canvas when importing

## [1.2.1]
### Added
- Room size now scales by .5
- Resizing the rooms *Bigger* will now not erase old tiles, this means importing levels and making the editor bigger now works
- Checkbox to show volumes on all layers

### Fixed
- Canvas tiling fixed
- Bin importing can be done multiple times without reloading the page
- Saw arrows now show where they reflect from

## [1.2.0]
### Added
- Bin importing
- Canvas tiled bg

### Removed
- Saving to browser

## [1.1.0]
### Added
- MINOR Project version is displayed by the title

## [1.0.0]
- First working version
