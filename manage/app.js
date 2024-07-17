import { h, render } from "preact";
import {
  categories,
  questions,
  nextCategoryId,
  loadCategories,
  loadQuestions,
  addCategory,
  removeCategory,
  addQuestion,
  removeQuestion,
  updateCategory,
  updateQuestion,
} from "./state.js";
import htm from "htm";

const html = htm.bind(h);
loadCategories();
loadQuestions();
// render(html`<${App} />`, window.app);

render(html`<${ManageCategories} />`, document.getElementById("manage-categories"));
render(html`<${ManageQuestions} />`, document.getElementById("manage-questions"));

function ManageCategories() {
  return html`
    <table class="table table-hover table-sm">
      <thead>
        <tr>
          <th>Category</th>
          <th style="width: 60px"></th>
        </tr>
      </thead>
      <tbody>
        ${categories.value.map(
          (category, index) => html`
            <tr>
              <td>
                <input class="form-control form-control-sm" onInput=${(ev) => updateCategory(index, "name", ev.target.value)} value=${category.name} />
              </td>
              <td>
                <button class="btn btn-sm btn-outline-danger h-100" onClick=${() => confirm(`Please confirm that you wish to remove "${category.name}"`) && removeCategory(index)}>Remove</button>
              </td>
            </tr>
          `
        )}
      </tbody>
    </table>
    <button class="btn btn-sm btn-primary me-1" onClick=${() => addCategory({ id: nextCategoryId.value, name: "New Category" })}>Add Category</button>
    <button
      class="btn btn-sm btn-outline-danger me-1"
      onClick=${() => confirm("Please confirm that you wish to reset all categories.") && loadCategories(1)}
      type="button">
      Reset Categories
    </button>
  `;
}

function ManageQuestions() {
  return html`
    <table class="table table-hover table-sm">
      <thead>
        <tr>
          <th>Category</th>
          <th>Question</th>
          <th>Answer</th>
          <th style="width: 60px"></th>
        </tr>
      </thead>
      <tbody>
        ${questions.value.map(
          (question, index) => html`
            <tr>
              <td>
                <select
                  class="form-select form-select-sm"
                  value=${question.category}
                  onChange=${(ev) => updateQuestion(index, "category", ev.target.value)}>
                  <option value="" hidden>Select a category</option>
                  ${categories.value.map((category) => html`<option value=${category.id}>${category.name}</option>`)}
                </select>
              </td>
              <td>
                <textarea
                  class="form-control form-control-sm"
                  rows="6"
                  cols="80"
                  onInput=${(ev) => updateQuestion(index, "question", ev.target.value)}
                  value=${question.question}
                  placeholder="Enter Question"></textarea>
              </td>
              <td>
                <input
                  class="form-control form-control-sm"
                  type="text"
                  onInput=${(ev) => updateQuestion(index, "answer", ev.target.value)}
                  value=${question.answer}
                  placeholder="Enter Answer" />
              </td>
              <td>
                <button class="btn btn-sm btn-outline-danger" onClick=${(ev) => confirm("Please confirm that you wish to remove this question.") && removeQuestion(index)}>Remove</button>
              </td>
            </tr>
          `
        )}
      </tbody>
    </table>

    <button class="btn btn-sm btn-primary me-1" onClick=${() => addQuestion({ category: "", question: "New Question", answer: "New Answer" })}>
      Add Question
    </button>

    <button
      class="btn btn-sm btn-outline-danger"
      onClick=${() => confirm("Please confirm that you wish to reset all questions.") && loadQuestions(1)}
      type="button">
      Reset Questions
    </button>
  `;
}
