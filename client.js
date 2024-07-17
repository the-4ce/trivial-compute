import { h, render } from "preact";
import { signal } from "@preact/signals";
import htm from "htm";

const html = htm.bind(h);

const count = signal(0);
const app = html`<button onClick=${() => count.value++}>${count}</button>`;
render(app, window.app);
