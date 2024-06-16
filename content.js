(() => {
  let oldElementStyle = null;
  let on = true;
  const selfVideoElementJsName = "Qiayqc";

  window.addEventListener(
    "keydown",
    (e) => {
      // Control + h
      if (e.ctrlKey && e.code === "KeyH") {
        if (on) {
          on = false;
          const elm = document.querySelector("[data-hidden-by-extension=true]");
          if (elm) {
            console.log("fix style", oldElementStyle);
            elm.style = oldElementStyle;
            elm.style.display = "block";
          }
        } else {
          on = true;
          hide(document);
        }
      }
    },
    false
  );

  const isSelfVideoElement = (node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }

    return node.getAttribute("jsname") === selfVideoElementJsName;
  };

  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((record) => {
      Array.from(record.addedNodes)
        .filter((node) => isSelfVideoElement(node))
        .forEach((element) => {
          const styleObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.attributeName === "style") {
                const target = mutation.target;
                if (target.style.getPropertyValue("display") !== "none") {
                  oldElementStyle = target.style;
                  // console.log("oldElementStyle", oldElementStyle);
                }
                if (!on) {
                  return;
                }
                target.style.display = "none";
                target.dataset.hiddenByExtension = "true";
              }
            }
          });

          styleObserver.observe(element, {
            attributes: true,
          });
        });
    });
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
  });

  documentPictureInPicture.addEventListener("enter", (event) => {
    const pipWindow = event.window;
    console.log("Video player has entered the pip window");

    // 以下動かないのでsetTimeoutで無理やり対応
    // pipWindow.document.addEventListener("DomContentLoaded", () => {
    //   console.log("loaded");
    //   observer.observe(pipWindow.document, {
    //     childList: true,
    //     subtree: true,
    //   });
    // });
    setTimeout(() => {
      hide(pipWindow.document);
    }, 100);
  });

  const hide = (document) => {
    const element = document.querySelector(
      `[jsname="${selfVideoElementJsName}"]`
    );

    if (element) {
      element.style.display = "none";
    }
  };
})();
