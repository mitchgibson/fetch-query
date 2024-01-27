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
  <style>
    .loader {
      border: 6px solid #f3f3f3;
      border-top: 6px solid #3498db;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
  <div>
    <h1 style="margin-bottom: 140px;">Fetch Query Example</h1>
    <div style="display: flex; flex-direction: row; gap: 8px;">
      <div class="">
        <button id="query" type="button">Query</button>
      </div>
      <div class="">
        <button id="nextiteration" type="button">Next Iteration</button>
      </div>
      <div class="">
        <button id="previousiteration" type="button">Previous Interation</button>
      </div>
      <div class="">
        <button id="nextpage" type="button">Next Page</button>
      </div>
      <div class="">
        <button id="previouspage" type="button">Previous Page</button>
      </div>
    </div>
    
    <div style="margin-top: 40px; display: flex; flex-direction: column; align-items: center; gap: 8px; min-height: 100px;">
    ${
      query.loading
        ? `<div class="loader"></div>`
        : `
          <div>Page: ${query.getSearchParams().page}</div>
          <div>Error: ${JSON.stringify(query.error)}</div>
          <div>Data: ${JSON.stringify(query.data)}</div>`
    }
    </div>
  </div>
`;

  let id: number;

  function redraw() {
    clearInterval(id);
    id = setInterval(() => {
      clearInterval(id);
      draw();
    }, 700);
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
