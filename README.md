# Crossword Game

An interactive English vocabulary crossword platform built with Next.js, TypeScript, Prisma, and Neon.

The project is designed as a fun vocabulary-learning experience where users can create their own vocabulary lists and automatically generate crossword puzzles for study and review.

### Live Demo

[Crossword Game](https://crossword-green.vercel.app/)

---

# Features

## Custom Vocabulary Import

- Import your own vocabulary list
- Supports:
  - commas
  - spaces
  - line breaks
- Automatically cleans and normalizes input words
- Recommended input size:
  - 30–40 words

---

## Vocabulary Database System

- Prisma + Neon PostgreSQL integration
- Imported vocabulary is persisted in database
- Word bank automatically reloads on refresh
- Re-importing words replaces the previous vocabulary set

---

## Dictionary Integration

Automatically fetches vocabulary information using Free Dictionary API:

- Definitions
- Phonetics
- Pronunciation audio
- Part of speech
- Example sentences

Users can also manually edit definitions directly inside the vocabulary list.

---

# Dynamic Crossword Generation

- Automatically generates crossword puzzles from imported vocabulary
- Randomly selects words from the vocabulary bank
- Creates compact crossword layouts
- Supports both across and down placements
- Multiple generation attempts improve puzzle density and quality
- Automatically trims unused grid space

---

# Gameplay Features

## Reveal System

- Fixed reveal mode:
  - 20% letters revealed

---

## Interactive Crossword

- Fill crossword cells directly
- Mobile-friendly virtual keyboard
- Check / Uncheck answers
- Reveal / Hide answers
- Interactive clue panel
- Pronunciation playback
- Hint system:
  - definition
  - first letter
  - word length
  - part of speech

---

## Vocabulary List Modal

- Alphabetically sorted vocabulary list
- Displays:
  - definition
  - example sentence
  - phonetic
  - pronunciation audio
- Editable definitions with database persistence

---

# Responsive UI

Fully responsive design for desktop and mobile.

## Desktop

- Crossword grid on the left
- Clue panel on the right

## Mobile

- Crossword grid on top
- Clues below
- Touch-friendly virtual keyboard

---

# Puzzle Sharing

## Copy Link Feature

Generated puzzles can be shared through URLs.

Shared links preserve:

- Crossword layout
- Puzzle structure
- Revealed letters
- Crossword state

Puzzle data is serialized and compressed using `lz-string`.

---

# Tech Stack

## Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS

## Backend / Database

- Prisma 7
- Neon PostgreSQL

---

# Libraries

- canvas-confetti
- react-icons
- lz-string
- @prisma/client
- @prisma/adapter-pg

---

# APIs

## Free Dictionary API

Used for:

- Definitions
- Examples
- Pronunciation
- Phonetics
- Parts of speech

---

# Core Systems

## Crossword Generator

The crossword generation engine:

- Dynamically places words into the grid
- Supports across/down intersections
- Scores candidate placements
- Attempts multiple layouts
- Trims unused rows and columns
- Optimizes crossword compactness

---

## Virtual Keyboard

Custom mobile-friendly keyboard system:

- Auto positioning near selected cells
- Auto close on outside click
- Touch optimized
- Responsive behavior

---

## Database Word Management

Vocabulary is persisted through Prisma + Neon:

- Import words
- Replace existing word bank
- Edit definitions
- Persist puzzle vocabulary across refreshes

---

# Performance Optimizations

- Multiple-attempt crossword generation
- Dynamic grid trimming
- Responsive grid scaling
- Optimized rendering
- Database persistence
- Loading states and overlays

---

# Future Improvements

Potential future features:

- Smarter crossword generation algorithm
- User accounts
- Multiple vocabulary sets
- Daily challenges
- Multiplayer classroom mode
- Short share links
- PWA support
- Leaderboard system
- Timed challenge mode
