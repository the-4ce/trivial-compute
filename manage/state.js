import { signal, computed } from "@preact/signals";
import { loadData, saveData, clearData } from "../data/data.js";

export const categories = signal([]);
export const questions = signal([]);
export const nextCategoryId = computed(() => 1 + categories.value.reduce((max, category) => Math.max(max, category.id), 0));

export async function loadCategories(reset) {
  if (reset)
    clearData("categories");
  categories.value = await loadData("categories");
}

export function saveCategories() {
  saveData("categories", categories.value);
}

export function replaceCategory(index, category) {
  const clone = structuredClone(categories.value);
  clone[index] = category;
  categories.value = clone;
  saveCategories();
}

export function updateCategory(index, key, value) {
  replaceCategory(index, { ...categories.value[index], [key]: value });
}

export function addCategory(category) {
  const clone = structuredClone(categories.value);
  clone.push(category);
  categories.value = clone;
  saveCategories();
}

export function removeCategory(index) {
  const categoriesClone = structuredClone(categories.value);
  categoriesClone.splice(index, 1);

  const questionsClone = structuredClone(questions.value);
  for (let question of questionsClone) {
    if (+question.category == +categories.value[index].id) {
      question.category = "";
    }
  }

  categories.value = categoriesClone;
  questions.value = questionsClone;

  saveCategories();
  saveQuestions();
}

export async function loadQuestions(reset) {
  if (reset)
    clearData("questions");
  questions.value = await loadData("questions");
}

export function saveQuestions() {
  saveData("questions", questions.value);
}

export function replaceQuestion(index, question) {
  const clone = structuredClone(questions.value);
  clone[index] = question;
  questions.value = clone;
  saveQuestions();
}

export function updateQuestion(index, key, value) {
  replaceQuestion(index, { ...questions.value[index], [key]: value });
}

export function addQuestion(question) {
  const clone = structuredClone(questions.value);
  clone.push(question);
  questions.value = clone;
  saveQuestions();
}

export function removeQuestion(index) {
  const clone = structuredClone(questions.value);
  clone.splice(index, 1);
  questions.value = clone;
  saveQuestions();
}
