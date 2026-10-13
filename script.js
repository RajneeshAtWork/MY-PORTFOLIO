"use strict";

// Existing portfolio interactions, consolidated into one script.
// Category button labels are mapped to the data-category slugs in index.html.
const toggleActive = (element) => element?.classList.toggle("active");

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
sidebarBtn?.addEventListener("click", () => toggleActive(sidebar));

// Team-member modal
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");
function closeModal() {
  modalContainer?.classList.remove("active");
  overlay?.classList.remove("active");
}
document.querySelectorAll("[data-testimonials-item]").forEach(item => {
  item.addEventListener("click", () => {
    const avatar = item.querySelector("[data-testimonials-avatar]");
    const title = item.querySelector("[data-testimonials-title]");
    const description = item.querySelector("[data-testimonials-text]");
    if (!modalContainer || !overlay || !avatar || !title || !description) return;
    if (modalImg) { modalImg.src = avatar.src; modalImg.alt = avatar.alt; }
    if (modalTitle) modalTitle.textContent = title.textContent;
    if (modalText) modalText.innerHTML = description.innerHTML;
    modalContainer.classList.add("active");
    overlay.classList.add("active");
  });
});
modalCloseBtn?.addEventListener("click", closeModal);
overlay?.addEventListener("click", closeModal);
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});

// Project filters: both desktop buttons and mobile custom select.
const portfolio = document.querySelector('article[data-page="projects"]');
if (portfolio) {
  const categoryMap = {
    "all": "all",
    "web design": "web-design",
    "applications": "applications",
    "ui/ux/graphics design": "ui/ux/graphics-design"
  };
  const desktopButtons = [...portfolio.querySelectorAll("[data-filter-btn]")];
  const mobileButtons = [...portfolio.querySelectorAll("[data-select-item]")];
  const filterItems = [...portfolio.querySelectorAll("[data-filter-item]")];
  const select = portfolio.querySelector("[data-select]");
  const selectValue = portfolio.querySelector("[data-select-value]");
  function filterProjects(label) {
    const normalized = label.trim().toLowerCase().replace(/\\s+/g, " ");
    const category = categoryMap[normalized];
    if (!category) return;
    filterItems.forEach(item => {
      item.classList.toggle("active", category === "all" || item.dataset.category === category);
    });
    desktopButtons.forEach(button => {
      const active = button.textContent.trim().toLowerCase() === normalized;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (selectValue) selectValue.textContent = label;
    select?.classList.remove("active");
    select?.setAttribute("aria-expanded", "false");
  }
  desktopButtons.forEach(button => button.addEventListener("click", () => {
    filterProjects(button.textContent.trim());
  }));
  mobileButtons.forEach(button => button.addEventListener("click", () => {
    filterProjects(button.textContent.trim());
  }));
  select?.setAttribute("aria-expanded", "false");
  select?.addEventListener("click", () => {
    const opened = select.classList.toggle("active");
    select.setAttribute("aria-expanded", String(opened));
  });
  document.addEventListener("click", event => {
    if (select && !select.closest(".filter-select-box")?.contains(event.target)) {
      select.classList.remove("active");
      select.setAttribute("aria-expanded", "false");
    }
  });
  filterProjects("All");
}

// Contact form: enable submission only when HTML validation passes.
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
const updateFormState = () => { if (form && formBtn) formBtn.disabled = !form.checkValidity(); };
formInputs.forEach(input => input.addEventListener("input", updateFormState));
updateFormState();

// Page navigation: compare data-page with button text, without relying on innerHTML.
const navigationLinks = [...document.querySelectorAll("[data-nav-link]")];
const pages = [...document.querySelectorAll("article[data-page]")];
navigationLinks.forEach(link => link.addEventListener("click", () => {
  const pageName = link.textContent.trim().toLowerCase();
  pages.forEach(page => page.classList.toggle("active", page.dataset.page === pageName));
  navigationLinks.forEach(button => button.classList.toggle("active", button === link));
  window.scrollTo({ top: 0, behavior: "auto" });
}));

// Modern project category filters
(() => {
 const root=document.querySelector('article[data-page="projects"]');if(!root)return;
 const buttons=[...root.querySelectorAll('[data-modern-filter]')];
 const groups=[...root.querySelectorAll('[data-project-group]')];
 function show(category){buttons.forEach(b=>{const active=b.dataset.modernFilter===category;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});groups.forEach(g=>g.hidden=category!=='all'&&g.dataset.projectGroup!==category);}
 buttons.forEach(b=>b.addEventListener('click',()=>show(b.dataset.modernFilter)));
 root.querySelectorAll('[data-show-category]').forEach(b=>b.addEventListener('click',()=>{show(b.dataset.showCategory);root.querySelector('.modern-filters')?.scrollIntoView({behavior:'smooth',block:'start'});}));show('all');
})();
