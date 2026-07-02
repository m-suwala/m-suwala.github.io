let selectedCategory = "all";
let selectedType = "all";
let selectedVibe = "all";

const typeMap = {
  jewellery: [
    { label: "Naszyjniki", value: "necklace" },
    { label: "Pierścionki", value: "ring" },
    { label: "Kolczyki", value: "earrings" },
    { label: "Bransoletki", value: "bracelet" }
  ],
  accessory: [
    { label: "Breloczki", value: "keychain" },
    { label: "Broszki i przypinki", value: "pin" },
    { label: "Wianki", value: "flower-crown" },
    { label: "Spinki do włosów", value: "hairclip" }
  ]
};

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

function highlight(btn) {
  btn.parentElement.querySelectorAll("button")
    .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");
}

function renderTypeFilters() {
  const container = document.getElementById("typeFilters");

  container.innerHTML = "<h3>Typ</h3>";

  if (selectedCategory === "all") {
    container.innerHTML += "<p>Wybierz kategorię</p>";
    return;
  }

  typeMap[selectedCategory].forEach(type => {
    container.innerHTML += `
      <button onclick="setType('${type.value}', this)">
        ${type.label}
      </button>
    `;
  });
}

function filterItems() {
  let items = document.querySelectorAll(".item");

  items.forEach(item => {

    let type = item.dataset.type;
    let category = item.dataset.category;
    let vibe = item.dataset.vibe;

    let matchesCategory =
      selectedCategory === "all" ||
      category === selectedCategory;

    let matchesType =
      selectedType === "all" ||
      type === selectedType;

    let matchesVibe =
      selectedVibe === "all" ||
      vibe.includes(selectedVibe);

    if (matchesCategory && matchesType && matchesVibe) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}