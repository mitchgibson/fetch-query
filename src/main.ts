import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { FetchQuery } from "./fetch-query.ts";

const query = new FetchQuery<any>("https://jsonplaceholder.typicode.com/todos/1");

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="query" type="button">Query</button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
    <div>Loading: ${query.loading}</div>
    <div>Error: ${JSON.stringify(query.error)}</div>
    <div>Data: ${JSON.stringify(query.data)}</div>
  </div>
`;

query.onDataChange((data) => {
  console.log("data", data);
});

query.onErrorChange((error) => {
  console.log("error", error);
});

query.onLoadingChange((loading) => {
  console.log("loading", loading);
});

let queryData: FetchQuery<any>;

function draw() {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div>Loading: ${queryData.loading}</div>
    <div>Error: ${JSON.stringify(queryData.error)}</div>
    <div>Data: ${JSON.stringify(queryData.data)}</div>
  `;
}

let id: number;

document.querySelector<HTMLButtonElement>("#query")!.addEventListener("click", () => {
  if (id) clearInterval(id);
  id = setInterval(() => {
    draw();
  }, 3000);


  for (let i = 0; i < 5; i++) {
    queryData = query.query();
  }
  draw();
});
