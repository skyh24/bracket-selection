# Bracket Selection

A VSCode extension that enhances bracket selection with visual cues and smart double-click behavior.

## Features

- **Smart Double-Click Selection**: Double-click on any bracket `{`, `}`, `[`, `]` or the spaces around them to select all content between the matching brackets
- **Visual Indicators**: Brackets are underlined for easy identification
- **Multi-line Support**: Works with code blocks spanning multiple lines
- **Nested Bracket Support**: Correctly handles nested brackets and finds the matching pair
- **Flexible Selection**: 
  - Works with both opening and closing brackets
  - Supports clicking on spaces around brackets
  - Handles nested structures intelligently

![Demo](images/demo.gif)

## Usage

1. Double-click on any bracket (`{`, `}`, `[`, `]`) or the spaces around it
2. The content between the matching brackets will be selected
3. Works across multiple lines and with nested structures

## Supported Brackets

- Curly braces: `{ }`
- Square brackets: `[ ]`

## Installation

1. Install through VS Code Marketplace
2. Or download the VSIX file and install manually:
   - Open VS Code
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - Type "Install from VSIX"
   - Select the downloaded VSIX file

## Requirements

- VS Code version 1.74.0 or higher

## Known Issues

- None at this time. Please report any issues on GitHub.

## Release Notes

### 1.0.0

- Initial release
- Smart bracket selection with visual indicators
- Support for curly braces and square brackets
- Multi-line and nested bracket support

## Contributing

Feel free to submit issues and enhancement requests on GitHub.

## License

This extension is licensed under the [MIT License](LICENSE).

## Author

Created by Skyhigh 