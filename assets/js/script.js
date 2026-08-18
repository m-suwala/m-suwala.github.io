let selectedCategory = "all";
let selectedType = "all";
let selectedVibe = "all";
let searchQuery = "";

const counter = document.getElementById("resultsCounter");
const noResults = document.getElementById("noResults");

// ------------------------ subcategories

const typeMap = {
  jewellery: [
    { label: "naszyjniki", value: "necklace" },
    { label: "pierścionki", value: "ring" },
    { label: "kolczyki", value: "earrings" },
    { label: "bransoletki", value: "bracelet" }
  ],
  accessory: [
    { label: "breloczki", value: "keychain" },
    { label: "broszki i przypinki", value: "pin" },
    { label: "wianki", value: "flower-crown" },
    { label: "spinki do włosów", value: "hairclip" }
  ],
  ceramics: [
    { label: "miski i talerze", value: "plate" },
    { label: "kubki i czarki", value: "cup" },
    { label: "wazony", value: "vase" },
    { label: "podstawki dekoracyjne", value: "tray" },
  ],
  decoration: [
    { label: "pinezki", value: "drawing-pin" },
    { label: "kwiaty", value: "flower" },
    { label: "figurki", value: "figurine" },
    { label: "zakładki", value: "bookmark" },
    { label: "ozdoby do doniczek", value: "pot-decor" },
    { label: "magnesy", value: "magnet" },
    { label: "obrazy", value: "painting" }
  ],

};

// ------------------------ helpers

function highlight(btn) {
  const group = btn.parentElement;

  group.querySelectorAll("button").forEach(b =>
    b.classList.remove("active")
  );

  btn.classList.add("active");
}

// ------------------------ filters

function setCategory(value, btn) {
  selectedCategory = value;
  selectedType = "all";

  highlight(btn);
  renderTypeFilters();
  filterItems();
}

function setType(value, btn) {
  selectedType = value;
  highlight(btn);
  filterItems();
}

function setVibe(value, btn) {
  selectedVibe = value;
  highlight(btn);
  filterItems();
}

function renderTypeFilters() {
  const container = document.getElementById("typeFilters");

  container.innerHTML = "<h3>Podkategoria</h3>";

  if (selectedCategory === "all") {
    container.innerHTML += "<p>Wybierz kategorię</p>";
    return;
  }

  container.innerHTML += `
    <button data-type="all" class="active">wszystkie</button>
  `;

  const types = typeMap[selectedCategory] || [];

  types.forEach(type => {
    container.innerHTML += `
      <button data-type="${type.value}">
        ${type.label}
      </button>
    `;
  });

  container.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      setType(btn.dataset.type, btn);
    });
  });
}

function filterItems() {
  const items = Array.from(document.querySelectorAll(".item"));
  let visibleCount = 0;

  requestAnimationFrame(() => {
    items.forEach((item) => {
      const name = (item.dataset.name || "").toLowerCase();
      const type = item.dataset.type;
      const category = item.dataset.category;
      const vibe = item.dataset.vibe || "";

      const matchesSearch =
        searchQuery === "" || name.includes(searchQuery);

      const matchesCategory =
        selectedCategory === "all" || category === selectedCategory;

      const matchesType =
        selectedType === "all" || type === selectedType;

      const matchesVibe =
        selectedVibe === "all" || vibe.includes(selectedVibe);

      const visible =
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        matchesVibe;

      if (visible) {
        item.style.display = "";
        item.style.animationDelay = `${visibleCount * 40}ms`;
        visibleCount++;
      } else {
        item.style.display = "none";
      }
    });

    if (visibleCount === 0) {
      counter.textContent = "Brak produktów";
      noResults.style.display = "block";
    } else {
      noResults.style.display = "none";

      counter.textContent =
        visibleCount === 1
          ? "1 produkt"
          : `${visibleCount} produktów`;
    }
  });
}

// ------------------------ modal

let currentImages = [];
let currentIndex = 0;

function openModal(el) {
  const id = el.dataset.id;

  history.pushState(null, "", `#produkt-${id}`);
  currentImages = JSON.parse(el.dataset.images || "[]");
  currentIndex = 0;

  document.getElementById("modalImage").src =
    currentImages[0] || "";

  document.getElementById("modalTitle").textContent =
    el.dataset.name || "";

  document.getElementById("modalPrice").textContent =
    `${el.dataset.price} zł`;

  document.getElementById("modalDescription").textContent =
    el.dataset.description || "";

  const galleryButtons = document.querySelectorAll(".gallery button");

  galleryButtons.forEach(button => {
    button.style.display = currentImages.length > 1 ? "flex" : "none";
  });

  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";

  const galleryButtons = document.querySelectorAll(".gallery button");

  galleryButtons.forEach(button => {
    button.style.display = "none";
  });

  history.pushState("", document.title, window.location.pathname);
}

function nextImage() {
  if (currentImages.length <= 1) return;

  currentIndex = (currentIndex + 1) % currentImages.length;

  document.getElementById("modalImage").src =
    currentImages[currentIndex];
}

function prevImage() {
  if (currentImages.length <= 1) return;

  currentIndex =
    (currentIndex - 1 + currentImages.length) %
    currentImages.length;

  document.getElementById("modalImage").src =
    currentImages[currentIndex];
}

window.addEventListener("click", (event) => {
  const modal = document.getElementById("modal");

  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

// ------------------------ search

document.getElementById("searchInput").addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase().trim();
  filterItems();
});

// ------------------------ scroll to top

document.getElementById("scrollButton").addEventListener("click", (e) => {
  e.preventDefault();

  document.getElementById("produkty").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

function scrollToTop() {
  document.getElementById("produkty").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

const toTopBtn = document.getElementById("toTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    toTopBtn.classList.add("show");
  } else {
    toTopBtn.classList.remove("show");
  }
});

// ------------------------ events

document.querySelectorAll("#categoryFilters button").forEach(btn => {
  btn.addEventListener("click", () => {
    setCategory(btn.dataset.category, btn);
  });
});

document.querySelectorAll("#vibeFilters button").forEach(btn => {
  btn.addEventListener("click", () => {
    setVibe(btn.dataset.vibe, btn);
  });
});

// ------------------------ init

document.addEventListener("DOMContentLoaded", () => {
  renderTypeFilters();
  filterItems();

  openProductFromHash();
});

function openProductFromHash() {
  const hash = window.location.hash;

  if (!hash.includes("#produkt-")) return;

  const id = hash.replace("#produkt-", "");

  const el = document.querySelector(`[data-id="${id}"]`);

  if (el) {
    openModal(el);
  }
}