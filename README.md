# Crossword Game

A responsive English vocabulary crossword game built with Next.js and TypeScript.

The project is designed as an interactive classroom game where students can learn English vocabulary through crossword puzzles instead of traditional memorization.

Link at: https://crossword-green.vercel.app/

---

# Features

## Dynamic Crossword Generation

- Automatically generates crossword puzzles from dynamic English vocabulary data
- Randomized themes for each game
- Supports different difficulty levels:
  - Easy → 60% letters revealed
  - Hard → 40% letters revealed
  - Crazy → 20% letters revealed

- Crossword layout is generated programmatically

---

## Responsive UI

- Fully responsive design
- Desktop layout:
  - Crossword on the left
  - Clues on the right

- Mobile layout:
  - Crossword on top
  - Clues below

- Optimized virtual keyboard for touch devices

---

## Interactive Gameplay

- Fill crossword cells directly
- Virtual keyboard support
- Check / Uncheck answers
- Show / Hide answers
- Dynamic clue panel
- Word pronunciation playback
- Completion modal with confetti animation

---

## Shareable Puzzle Links

- Copy Link feature
- Shared links restore:
  - Same crossword layout
  - Same revealed letters
  - Same difficulty
  - Same theme

- Puzzle data is compressed into URL parameters

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

## APIs

### Datamuse API

Used for generating related English words based on themes.

### Free Dictionary API

Used for:

- Definitions
- Phonetics
- Pronunciation audio
- Part of speech

---

# Main Functionalities

## Crossword Generator

The crossword system:

- Dynamically places words into a grid
- Crops unused grid areas
- Generates playable crossword layouts
- Supports clue indexing and directions

---

## Reveal System

Different difficulty levels reveal different percentages of letters.

The revealed cells are preserved when sharing puzzle links.

---

## Virtual Keyboard

Custom virtual keyboard system:

- Mobile friendly
- Auto positioning near selected cells
- Auto close when clicking outside
- Supports touch devices

---

## Puzzle Sharing

Puzzle state is serialized and compressed into URL parameters.

Shared puzzles preserve:

- Crossword structure
- Revealed letters
- Difficulty
- Theme

---

# Performance Optimizations

- LocalStorage word cache
- API fallback system
- Dynamic rendering optimization
- Responsive grid scaling

---

# Future Improvements

Potential future features:

- Better crossword generation algorithm
- Multiplayer classroom mode
- Supabase backend for short share links
- PWA support
- Classroom leaderboard system
- Timed challenge mode

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
