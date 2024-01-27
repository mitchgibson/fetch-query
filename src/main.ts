import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { FetchQuery } from "./fetch-query/fetch-query.ts";
import { FetchQueryIterator } from "./fetch-query/fetch-query-iterator.ts";
import { ExamplePager } from "./ExamplePager.ts";

const query = new FetchQuery<any>("https://jsonplaceholder.typicode.com/todos/1");
query.setSearchParams({ page: 1 });
const iterator = new FetchQueryIterator<any>(query, {
  next: (query) => {
    const page = query.getSearchParams().page as number;
    query.updateSearchParams({ page: page + 1 });
    return query;
  },
  previous: (query) => {
    const page = query.getSearchParams().page as number;
    query.setSearchParams({ page: page - 1 });
    return query;
  },
});

const pager = new ExamplePager(query);

function draw() {
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
    <div class="card">
      <button id="nextiteration" type="button">Next Iteration</button>
    </div>
    <div class="card">
      <button id="previousiteration" type="button">Previous Interation</button>
    </div>
    <div class="card">
      <button id="nextpage" type="button">Next Page</button>
    </div>
    <div class="card">
      <button id="previouspage" type="button">Previous Page</button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
    <div>Page: ${query.getSearchParams().page}</div>
    <div>Loading: ${query.loading}</div>
    <div>Error: ${JSON.stringify(query.error)}</div>
    <div>Data: ${JSON.stringify(query.data)}</div>
  </div>
`;

  let id: number;

  function redraw() {
    clearInterval(id);
    id = setInterval(() => {
      clearInterval(id);
      draw();
    }, 1000);
    draw();
  }

  document.querySelector<HTMLButtonElement>("#query")!.addEventListener("click", () => {
    query.query();
    redraw();
  });

  document.querySelector<HTMLButtonElement>("#nextiteration")!.addEventListener("click", () => {
    iterator.next();
    redraw();
  });

  document.querySelector<HTMLButtonElement>("#previousiteration")!.addEventListener("click", () => {
    iterator.previous();
    redraw();
  });

  document.querySelector<HTMLButtonElement>("#nextpage")!.addEventListener("click", () => {
    pager.next();
    redraw();
  });

  document.querySelector<HTMLButtonElement>("#previouspage")!.addEventListener("click", () => {
    pager.previous();
    redraw();
  });
}

draw();
