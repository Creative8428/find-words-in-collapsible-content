"use strict";
const performSearch = () => {
  const isAnyCollapsibleExpanded =
    Array.from(document.querySelectorAll(".collapse.show")).length > 0;
  if (isAnyCollapsibleExpanded) {
    return;
  }

  let searchText = DOMPurify.sanitize(document.querySelector(".form-control").value);
  console.log(searchText);

  const btnsCollapse = Array.from(document.querySelectorAll(".collapse"));
  const errorElement = document.querySelector(".error");
  const emptyInputErrorElement = document.querySelector(".empty-input-error");
  let wordFound = false;

  if (!searchText) {
    emptyInputErrorElement.style.display = "block";
    return;
  } else {
    emptyInputErrorElement.style.display = "none";
  }

  btnsCollapse.forEach((collapsible) => {
    const content = collapsible.textContent.toLowerCase();
    if (content.includes(searchText)) {
      collapsible.classList.add("show");
      const regex = new RegExp(searchText, "gi");
      collapsible.innerHTML = collapsible.innerHTML.replace(
        regex,
        (match) => `<mark>${match}</mark>`
      );
      wordFound = true;

      // Change the icon
      const button = document.querySelector(`[data-bs-target="#${collapsible.id}"]`);
      const icon = button.querySelector("i");
      icon.classList.remove("bi-chevron-down");
      icon.classList.add("bi-chevron-up");
    } else {
      collapsible.classList.remove("show");
    }
  });

  if (!wordFound) {
    errorElement.style.display = "block";
  } else {
    errorElement.style.display = "none";
  }
};

// listens for the show.bs.collapse event, which is fired when the collapsible is about to be shown
const collapsibleButtons = Array.from(document.querySelectorAll('[data-bs-toggle="collapse"]'));

collapsibleButtons.forEach((button) => {
  const collapsibleId = button.getAttribute("data-bs-target").slice(1); // Remove the '#' from the start of the id
  const btnsDataTarget = document.getElementById(collapsibleId);
  const icon = button.querySelector("i");

  btnsDataTarget.addEventListener("show.bs.collapse", () => {
    icon.classList.remove("bi-chevron-down");
    icon.classList.add("bi-chevron-up");
  });

  btnsDataTarget.addEventListener("hide.bs.collapse", () => {
    icon.classList.remove("bi-chevron-up");
    icon.classList.add("bi-chevron-down");
  });
});

const clearSearch = () => {
  document.querySelector(".form-control").value = "";
  const btnsCollapse = Array.from(document.querySelectorAll(".collapse"));
  const errElem = document.querySelector(".error");
  const errNoValueInput = document.querySelector(".empty-input-error");
  btnsCollapse.forEach((collapsible) => {
    collapsible.classList.remove("show");
    const marks = Array.from(collapsible.querySelectorAll("mark"));
    marks.forEach((mark) => {
      mark.outerHTML = mark.textContent;
    });

    // Change the icon back to bi-chevron-down
    const button = document.querySelector(`[data-bs-target="#${collapsible.id}"]`);
    const icon = button.querySelector("i");
    icon.classList.remove("bi-chevron-up");
    icon.classList.add("bi-chevron-down");
  });

  // Hide error messages
  errElem.style.display = "none";
  errNoValueInput.style.display = "none";
};

document.getElementById("button-addon2").addEventListener("click", performSearch);

document.querySelector(".form-control").addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    performSearch();
  }
});

document.getElementById("clear-button").addEventListener("click", clearSearch);
