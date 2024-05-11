# Wordle Clone

Welcome to Wordle Clone, a simple word-guessing game inspired by the popular Wordle game.

## Features

- **Guessing Game**: Guess the hidden 5-letter word within 6 attempts.
- **On-screen Keyboard**: Access an on-screen keyboard that is clickable for easier input while playing the game.
- **Feedback**: Receive feedback on your guesses with board and keyboard highlighting to help you narrow down the correct word.
- **Responsive Design**: Play the game on various devices.
- **Dark Mode Toggle**: Switch between light and dark mode for better readability in different environments.
- **High Contrast Toggle**: Toggle high contrast mode for improved visibility of letter colours.
- **Game Progress in Local Storage**: Game progress is stored locally, so you can continue where you left off.
- **App State in Local Storage**: Application state is stored locally, to maintain dark-mode and contrast settings.
- **Stats in Local Storage**: User stats are stored locally, so you can see your total games, win%, guess distribution, etc.

## Utility components built

- **Tooltip**: Enhances UX with hover-over details for elements.
- **Toggle**: Enables easy switching between two binary states.
- **Modal**: Prompts user actions or alerts with overlay dialogs.
- **Toast-Notification**: Brief, non-intrusive alerts for user feedback.

## Technologies Used

- **React.js:** Used for building the interactive components and managing the application state.
- **HTML:** Markup language for structuring the web page.
- **SCSS:** Used for styling, providing a more maintainable and structured approach to CSS.
- **TypeScript:** Adds static typing to JavaScript, enhancing code readability and maintainability.

## Usage

- Type in your guess for each word or use your mouse to click on letters on the on-screen keyboard
- Hit "Enter" on your keyboard or the "ENTER" key on the on-screen keyboard to submit your guess.
- Receive feedback on your guess:
  - Green: Correct letter and position. (Orange in high-contrast mode)
  - Yellow: Correct letter but wrong position. (Blue in high-contrast mode)
  - Gray: Letter not in the hidden word.
- Keep guessing until you guess the word or run out of attempts.
