# Crossword Game

An interactive English vocabulary crossword game built with Next.js and TypeScript.

The project is designed as a fun classroom-style learning experience where students can improve vocabulary through crossword puzzles instead of traditional memorization.

### Live Demo

[Crossword Game Live Demo](https://crossword-green.vercel.app/)

---

# Features

## Dynamic Crossword Generation

- Programmatically generates crossword puzzles from dynamic English vocabulary data
- Randomized vocabulary selection for every game
- Automatically creates compact crossword layouts
- Supports both horizontal and vertical word placement
- Multiple generation attempts are used to improve crossword quality and density
- Unused grid areas are automatically trimmed for a cleaner layout

### Difficulty Modes

- **Easy** → 60% letters revealed
- **Hard** → 40% letters revealed
- **Crazy** → 20% letters revealed

---

## Responsive UI

- Fully responsive design for desktop and mobile

- Desktop layout:
  - Crossword grid on the left
  - Clue panel on the right

- Mobile layout:
  - Crossword grid on top
  - Clues below

- Optimized touch-friendly virtual keyboard

---

## Interactive Gameplay

- Fill crossword cells directly
- Mobile virtual keyboard support
- Check / Uncheck answers
- Show / Hide answers
- Interactive clue panel
- Word pronunciation playback
- Completion modal with confetti animation

---

## Shareable Puzzle Links

- Copy Link feature

- Shared links preserve:
  - Exact crossword layout
  - Revealed letters
  - Difficulty level
  - Puzzle structure

- Puzzle state is serialized and compressed into URL parameters using `lz-string`

---

# Tech Stack

## Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS

## Libraries

- canvas-confetti
- react-icons
- lz-string

---

# APIs

## Datamuse API

Used for generating related English vocabulary dynamically.

## Free Dictionary API

Used for:

- Definitions
- Phonetics
- Pronunciation audio
- Part of speech

---

# Main Functionalities

## Crossword Generator

The crossword generation system:

- Dynamically places words into a crossword grid
- Supports across and down placements
- Scores candidate placements to create denser layouts
- Automatically trims unused outer rows and columns
- Runs multiple generation attempts to improve puzzle quality

---

## Reveal System

Different difficulty modes reveal different percentages of letters.

Revealed cells are preserved when sharing puzzle links.

---

## Virtual Keyboard

Custom virtual keyboard system:

- Mobile friendly
- Auto positioning near selected cells
- Auto close when clicking outside
- Touch optimized

---

## Puzzle Sharing

Puzzle state is serialized and compressed into URL parameters.

Shared puzzles preserve:

- Crossword structure
- Revealed letters
- Difficulty
- Exact layout positioning

---

# Performance Optimizations

- LocalStorage word cache
- API fallback system
- Crossword layout trimming
- Multiple-attempt crossword generation
- Responsive grid scaling
- Dynamic rendering optimization

---

# Future Improvements

Potential future features:

- Smarter crossword generation algorithm
- Multiplayer classroom mode
- Supabase backend for short share links
- PWA support
- Classroom leaderboard system
- Timed challenge mode
- Daily challenge puzzles

---

# Local Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build production version:

```bash
npm run build
```

---

# Deployment

The project can be deployed directly to:

- Vercel
- Netlify
- Cloudflare Pages

No backend server is required for the current version.

---

# License

MIT
