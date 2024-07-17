import { h, render } from "preact";
import {
  categories,
  game,
  loadCategories,
  loadQuestions,
  updateRollValue,
  updatePlayerName,
  updatePlayerPosition,
  updateCanRoll,
  askQuestion,
  nextPlayer,
  addScore,
  setWinner,
} from "./state.js";
import htm from "htm";

const html = htm.bind(h);
loadCategories();
loadQuestions();

render(html`<${GameBoard} />`, document.getElementById("game-board"));

function PlayerTokens({ rowIndex, columnIndex }) {
  return game.value.playerPositions.map(
    (pos, i) =>
      (pos[0] == rowIndex && pos[1] == columnIndex && html`<div class="token token-${i}">${i + 1}</div>`) || null
  );
}

function Dice({ value }) {
  const paths = [
    null,
    "M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM224 224a32 32 0 1 1 0 64 32 32 0 1 1 0-64z",
    "M0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM352 352a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM128 192a32 32 0 1 0 0-64 32 32 0 1 0 0 64z",
    "M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm64 96a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm64 128a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm128 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64z",
    "M0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zm160 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM128 384a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM352 160a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM320 384a32 32 0 1 0 0-64 32 32 0 1 0 0 64z",
    "M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm64 96a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM96 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM224 224a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm64-64a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32 160a32 32 0 1 1 0 64 32 32 0 1 1 0-64z",
    "M0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zm160 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM128 288a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm32 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM320 192a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm32 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM320 384a32 32 0 1 0 0-64 32 32 0 1 0 0 64z",
  ];
  return html`<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path d="${paths[value]}" fill="#0050d8" />
  </svg>`;
}

function GameBoard() {
  const gameCategories = categories.value.slice(0, 4);

  if (game.value.winner !== null) return html`<h1 class="display-5">${game.value.playerNames[game.value.winner]} Wins!</h1>`;
  return html`<table class="text-light fw-semibold">
    ${game.value.board.map(
      (row, rowIndex) =>
        html`<tr>
          ${row.map((cell, columnIndex) => {
            switch (cell.type) {
              case "roll-again":
                return html`<td
                  class="cell bg-dark ${!game.value.canRoll && 'cursor-pointer'}"
                  onClick=${() => {
                    if (game.value.canRoll) return;
                    updatePlayerPosition(game.value.currentPlayer, [rowIndex, columnIndex]);
                    updateCanRoll(true);
                  }}>
                  Roll Again
                  <${PlayerTokens} rowIndex=${rowIndex} columnIndex=${columnIndex} />
                </td>`;
              case "question":
                return html`<td
                  class="cell bg-category-${cell.category} ${!game.value.canRoll && 'cursor-pointer'}"
                  onClick=${() => {
                    if (game.value.canRoll) return;
                    updatePlayerPosition(game.value.currentPlayer, [rowIndex, columnIndex]);
                    if (askQuestion(cell.category)) {
                      updateCanRoll(true);
                    } else {
                      nextPlayer();
                    }
                  }}>
                  <${PlayerTokens} rowIndex=${rowIndex} columnIndex=${columnIndex} />
                </td>`;
              case "hq":
                return html`<td
                  class="cell bg-category-${cell.category} ${!game.value.canRoll && 'cursor-pointer'}"
                  onClick=${() => {
                    if (game.value.canRoll) return;
                    updatePlayerPosition(game.value.currentPlayer, [rowIndex, columnIndex]);
                    if (askQuestion(cell.category)) {
                      addScore(game.value.currentPlayer, cell.category)
                      updateCanRoll(true)
                    } else {
                      nextPlayer()
                    }
                  }}>
                  HQ
                  <${PlayerTokens} rowIndex=${rowIndex} columnIndex=${columnIndex} />
                </td>`;
              case "home":
                return html`<td
                  class="cell bg-dark ${!game.value.canRoll && 'cursor-pointer'}"
                  onClick=${() => {
                    if (game.value.canRoll) return;
                    updatePlayerPosition(game.value.currentPlayer, [rowIndex, columnIndex]);
                    if (askQuestion(1)) {
                      setWinner(game.value.currentPlayer);
                    } else {
                      nextPlayer();
                    }
                  }}>
                  Home
                  <${PlayerTokens} rowIndex=${rowIndex} columnIndex=${columnIndex} />
                </td>`;
              case "score-quadrant":
                return html`<td class="quadrant-cell" rowspan=${cell.height} colspan=${cell.width}>
                  <div class="d-flex justify-content-between align-items-center flex-column">
                    <input
                      type="text"
                      class="form-control form-control-sm text-center fw-semibold mb-2"
                      style="width: 80px"
                      value=${game.value.playerNames[cell.player]}
                      onInput=${(ev => updatePlayerName(cell.player, ev.target.value))}
                      placeholder=${`Player ` + cell.player + 1} />
                    <div class="mb-2">
                      ${gameCategories.map(
                        (_, categoryIndex) => html`
                          <div
                            class="mini-cell bg-category-${categoryIndex + 1} ${game.value.playerScores[
                              cell.player
                            ][categoryIndex]
                              ? "visible"
                              : "invisible"}"></div>
                        `
                      )}
                    </div>
                    <div
                      style="height: 32px;"
                      class=${game.value.currentPlayer === cell.player ? "visible" : "invisible"}>
                      ${game.value.canRoll
                        ? html`<button class="btn btn-sm btn-primary fw-semibold" onClick=${() => updateRollValue()}>
                            Roll
                          </button>`
                        : html`<${Dice} value=${game.value.rollValue} />`}
                    </div>
                  </div>
                </td>`;
            }
          })}
        </tr>`
    )}
  </table>`;
}
