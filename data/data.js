/**
 * Parses a CSV string into a 2D array.
 * @param {string} str - The CSV string to parse.
 * @returns {string[][]} The parsed CSV data as a 2D array or array of objects.
 * @throws {Error} If there are unmatched quotes in the CSV string.
 */
export function parseCSV(str, headers = false) {
  let arr = [];
  let quote = false;
  let row = 0;
  let col = 0;

  for (let c = 0; c < str.length; c++) {
    let cc = str[c];
    let nc = str[c + 1];

    arr[row] = arr[row] || [];
    arr[row][col] = arr[row][col] || "";

    if (cc == '"' && quote && nc == '"') {
      arr[row][col] += cc;
      ++c;
      continue;
    }
    if (cc == '"') {
      quote = !quote;
      continue;
    }
    if (!quote) {
      if (cc == ",") {
        ++col;
        continue;
      }
      if (cc == "\r") {
        continue
      }
      if (cc == "\n") {
        ++row;
        col = 0;
        continue;
      }
    }
    arr[row][col] += cc;
  }

  if (headers) {
    const headers = arr.shift();
    return arr.map(row => Object.fromEntries(headers.map((header, i) => [header, parseValue(row[i])])));
  }

  return arr;
}

export function parseValue(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  if (!isNaN(value)) return parseFloat(value);
  return value;
}

export async function loadRemoteCsv(url) {
  const response = await fetch(url);
  const text = await response.text();
  return parseCSV(text, true);
}

export async function loadData(name) {
  let storage = localStorage.getItem(name);
  if (storage) {
    return JSON.parse(storage);
  } else {
    try {
      const data = await loadRemoteCsv(`../data/${name}.csv`);
      localStorage.setItem(name, JSON.stringify(data));
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

export function saveData(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}

export function clearData(name) {
  localStorage.removeItem(name);
}