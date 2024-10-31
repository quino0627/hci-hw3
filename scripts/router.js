const routes = {
  "/": {
    title: "메인 페이지",
    template: "main.html",
    script: "main.js",
  },
  "/reserve": {
    title: "예약 화면",
    template: "reserve.html",
    script: "reserve.js",
  },
  "/cancel": {
    title: "예약 취소 화면",
    template: "cancel.html",
    script: "cancel.js",
  },
  "/detail/:number": {
    title: "예약 상세 화면",
    template: "detail.html",
    script: "detail.js",
  },
  "/modify": {
    title: "예약 변경 화면",
    template: "modify.html",
    script: "modify.js",
  },
  "/modify/:number": {
    title: "예약 변경 화면 상세",
    template: "modify-detail.html",
    script: "modify-detail.js",
  },
};

function parsePathParams(routePath, currentPath) {
  const routeParts = routePath.split("/");
  const currentParts = currentPath.split("/");

  if (routeParts.length !== currentParts.length) {
    return null;
  }

  const params = {};

  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith(":")) {
      const paramName = routeParts[i].slice(1);
      params[paramName] = currentParts[i];
    } else if (routeParts[i] !== currentParts[i]) {
      return null;
    }
  }

  return params;
}

function findMatchingRoute(pathname) {
  if (routes[pathname]) {
    return { ...routes[pathname], params: {} };
  }

  for (const [routePath, routeConfig] of Object.entries(routes)) {
    const params = parsePathParams(routePath, pathname);
    if (params) {
      return { ...routeConfig, params };
    }
  }

  return null;
}

function router() {
  let view = findMatchingRoute(location.pathname);
  console.log(view);

  if (view) {
    document.title = view.title;
    fetch(`/pages/${view.template}`)
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((content) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");
        const bodyContent = doc.querySelector("body").innerHTML;
        document.getElementById("app").innerHTML = bodyContent;

        if (view.script) {
          return import(`../scripts/${view.script}`);
        }
      })
      .then((module) => {
        if (module && typeof module.default === "function") {
          module.default(view.params);
        }
      })
      .catch((error) => {
        console.error("라우팅 오류:", error);
        document.getElementById("app").innerHTML =
          "<h1>페이지 로딩 중 오류가 발생했습니다</h1>";
      });
  } else {
    document.title = "페이지를 찾을 수 없습니다";
    document.getElementById("app").innerHTML =
      "<h1>404 - 페이지를 찾을 수 없습니다</h1>";
  }
}

function navigateTo(url) {
  history.pushState(null, null, url);
  router();
}

function registerBrowserBackAndForth() {
  window.addEventListener("popstate", router);
}

function registerButtonClick() {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.getAttribute("data-link"));
    }
  });
}

export { router, navigateTo, registerBrowserBackAndForth, registerButtonClick };
