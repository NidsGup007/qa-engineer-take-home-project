# Cypress UI + API Automation

Cypress tests for the Customers app, written in TypeScript and integrated into the application's own `package.json` (a single `npm install` covers both the app and the test suite).

## Layout

```
cypress/
├─ e2e/
│  ├─ ui/                      # UI tests (Page Object Model)
│  │  ├─ add-customer.cy.ts
│  │  ├─ edit-customer.cy.ts
│  │  ├─ view-customer.cy.ts
│  │  ├─ remove-customer.cy.ts
│  │  └─ customer-lifecycle.cy.ts
│  └─ api/
│     └─ customers-api.cy.ts   # Bonus: POST/GET/PUT/DELETE coverage
├─ fixtures/                   # JSON fixtures
├─ pages/                      # Page Objects (CustomersPage, CustomerModal, ConfirmDeleteModal)
├─ selectors/                  # Centralized data-testid map
├─ support/                    # commands.ts, e2e.ts, factories.ts, types.ts
└─ tsconfig.json
```

## Run

```bash
# from project root
npm install

# start the app (vite + express) in one terminal:
npm run dev

# in another terminal:
npm run cy:open          # interactive runner
npm run cy:run           # headless (all suites)
npm run cy:run:ui        # headless UI tests only
npm run cy:run:api       # headless API tests only
```

`cypress.config.ts` sets `baseUrl=http://localhost:5173` and `env.apiUrl=http://localhost:5173/api` (Vite proxies `/api/*` to the Express server on port 3000).

## Notes

- Selectors are centralized in `cypress/selectors/customer.selectors.ts` and mirror the `data-testid` values in `src/`. Update them in one place if the app changes.
- `cy.apiCreateCustomer()` / `cy.apiDeleteCustomer()` custom commands seed and clean up via the API so each test is independent of UI state.
- Faker is used in `support/factories.ts` to generate unique customers per run.
