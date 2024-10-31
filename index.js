import {
  router,
  registerButtonClick,
  registerBrowserBackAndForth,
} from "./scripts/router.js";

document.addEventListener("DOMContentLoaded", () => {
  registerButtonClick();
  registerBrowserBackAndForth();
  router();
});
