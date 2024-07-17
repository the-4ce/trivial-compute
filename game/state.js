import { signal, computed } from "@preact/signals";
import { loadData, saveData } from "../data/data.js";

export const defaultGameState = {
  currentCategory: null,
  currentPlayer: 0,
  winner: null,
  canRoll: true,
  rollValue: null,
  playerNames: [
    "Alpha",
    "Bravo",
    "Charlie",
    "Delta",
  ],
  playerScores: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  playerPositions: [
    [4, 4],
    [4, 4],
    [4, 4],
    [4, 4],
  ],
  board: [
    [
      { category: null, type: "roll-again" },
      { category: 1, type: "question" },
      { category: 2, type: "question" },
      { category: 3, type: "question" },
      { category: 4, type: "hq" },
      { category: 1, type: "question" },
      { category: 2, type: "question" },
      { category: 3, type: "question" },
      { category: null, type: "roll-again" },
    ],
    [
      { category: 4, type: "question" },
      { category: null, type: "score-quadrant", player: 0, width: 3, height: 3 },
      { category: 1, type: "question" },
      { category: null, type: "score-quadrant", player: 1, width: 3, height: 3  },
      { category: 4, type: "question" },
    ],
    [
      { category: 3, type: "question" },
      { category: 2, type: "question" },
      { category: 1, type: "question" },
    ],
    [
      { category: 2, type: "question" },
      { category: 3, type: "question" },
      { category: 2, type: "question" },
    ],
    [
      { category: 1, type: "hq" },
      { category: 2, type: "question" },
      { category: 3, type: "question" },
      { category: 4, type: "question" },
      { category: null, type: "home" },
      { category: 2, type: "question" },
      { category: 1, type: "question" },
      { category: 4, type: "question" },
      { category: 3, type: "hq" },
    ],
    [
      { category: 4, type: "question" },
      { category: null, type: "score-quadrant", player: 2, width: 3, height: 3 },
      { category: 1, type: "question" },
      { category: null, type: "score-quadrant", player: 3, width: 3, height: 3 },
      { category: 4, type: "question" },
    ],
    [
      { category: 3, type: "question" },
      { category: 4, type: "question" },
      { category: 1, type: "question" },
    ],
    [
      { category: 2, type: "question" },
      { category: 3, type: "question" },
      { category: 2, type: "question" },
    ],
    [
      { category: null, type: "roll-again" },
      { category: 1, type: "question" },
      { category: 4, type: "question" },
      { category: 3, type: "question" },
      { category: 2, type: "hq" },
      { category: 1, type: "question" },
      { category: 4, type: "question" },
      { category: 3, type: "question" },
      { category: null, type: "roll-again" },
    ]
  ],
}

export const categories = signal([]);
export const questions = signal([]);
export const game = signal(defaultGameState);

export async function loadCategories() {
  categories.value = await loadData("categories");
}

export async function loadQuestions(reset) {
  questions.value = await loadData("questions");
}

export function updatePlayerPosition(playerIndex, position) {
  const clone = structuredClone(game.value);
  clone.playerPositions[playerIndex] = position;
  game.value = clone;
}

export function updateRollValue() {
  const clone = structuredClone(game.value);
  const roll = Math.floor(Math.random() * 6) + 1;
  clone.rollValue = roll;
  clone.canRoll = false;
  game.value = clone;
}

export function updateCanRoll(value) {
  const clone = structuredClone(game.value);
  clone.canRoll = value;
  game.value = clone;
}

export function askQuestion(category) {
  const validQuestions = questions.value.filter(q => q.category == category);
  if (validQuestions.length === 0) {
    return false;
  }
  const question = validQuestions[Math.floor(Math.random() * validQuestions.length)];
  const promptText = [
    categories.value[question.category - 1].name,
    question.question
  ].join('\n\n');
  const answer = prompt(promptText);
  if (answer === null) return false;
  const correct = answer.toLowerCase().trim() === question.answer.toLowerCase().trim();
  if (correct) {
    alert("Correct!");
  } else {
    alert(`Incorrect. Moving to next player.`);
  }
  return correct;
}

export function nextPlayer() {
  const clone = structuredClone(game.value);
  clone.currentPlayer = (clone.currentPlayer + 1) % 4;
  clone.rollValue = null;
  clone.canRoll = true;
  game.value = clone;
}

export function addScore(playerIndex, category) {
  const clone = structuredClone(game.value);
  clone.playerScores[playerIndex][category - 1]++;
  game.value = clone;
}

export function setWinner(playerIndex) {
  const score = game.value.playerScores[playerIndex].slice(0, 4);
  if (score.every(s => s >= 1)) {
    const clone = structuredClone(game.value);
    clone.winner = playerIndex;
    game.value = clone;
  } else {
    alert("Collect all categories first!");
  }
}

export function updatePlayerName(playerIndex, name) {
  const clone = structuredClone(game.value);
  clone.playerNames[playerIndex] = name;
  game.value = clone;
}