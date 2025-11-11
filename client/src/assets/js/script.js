// Array of slides
const slides = [
  {
    img: "assests/img/slider/nike-5126389_1280.jpg",
    title: "EXCLUSIVE NIKE SNEAKERS",
    text: "STEP INTO STYLE WITH OUR LATEST SNEAKER COLLECTION",
    btn1: { text: "SHOP NOW", link: "#", class: "btn btn-dark px-4 py-2" },
    btn2: { text: "CONTACT US", link: "#", class: "btn btn-dark text-white px-4 py-2" }
  },
  {
    img: "assests/img/slider/nike-5128118_1280.jpg",
    title: "TRENDING SNEAKERS",
    text: "DISCOVER THE HOTTEST DESIGNS OF THE SEASON",
    btn1: { text: "SHOP NOW", link: "#", class: "btn btn-dark px-4 py-2" },
    btn2: { text: "CONTACT US", link: "#", class: "btn btn-outline-dark px-4 py-2" }
  },
  {
    img: "assests/img/slider/sneakers-8001394_1280.jpg",
    title: "LIMITED EDITION",
    text: "GRAB YOUR EXCLUSIVE PAIR BEFORE THEY SELL OUT",
    btn1: { text: "SHOP NOW", link: "#", class: "btn btn-dark px-4 py-2" },
    btn2: { text: "CONTACT US", link: "#", class: "btn btn-outline-dark px-4 py-2" }
  }
];

// Select containers
const indicators = document.getElementById("carousel-indicators");
const inner = document.getElementById("carousel-inner");

// Generate slides dynamically
slides.forEach((slide, index) => {
  // Indicators
  const indicator = document.createElement("button");
  indicator.type = "button";
  indicator.setAttribute("data-bs-target", "#carouselExampleIndicators");
  indicator.setAttribute("data-bs-slide-to", index);
  indicator.setAttribute("aria-label", `Slide ${index + 1}`);
  if (index === 0) indicator.classList.add("active");
  indicators.appendChild(indicator);

  // Slide Item
  const item = document.createElement("div");
  item.className = `carousel-item ${index === 0 ? "active" : ""}`;
  item.innerHTML = `
    <img src="${slide.img}" class="d-block w-100 carousel-img" alt="${slide.title}">
    <div class="carousel-caption d-flex flex-column justify-content-center h-100">
      <h1 class="fw-bold display-5">${slide.title}</h1>
      <p>${slide.text}</p>
      <div class="mt-3">
        <a href="${slide.btn1.link}" class="${slide.btn1.class}">${slide.btn1.text}</a>
        <a href="${slide.btn2.link}" class="${slide.btn2.class}">${slide.btn2.text}</a>
      </div>
    </div>
  `;
  inner.appendChild(item);
});


// card 
const products = [
  { name: "jordan 4 military", price: "$210.00", img: "assests/img/images.png" },
  { name: "jordan 4 infrared", price: "$230.00", img:"assests/img/images.png" },
  { name: "jordan 4 canvas", price: "$220.00", img:"assests/img/images.png" },
  { name: "jordan 4 myth", price: "$190.00", img:"assests/img/images.png" },
  { name: "jordan 4 retro", price: "$210.00", img:"assests/img/images.png" },
  { name: "jordan 4 urban", price: "$240.00", img:"assests/img/images.png" },
  { name: "jordan 4 maniere", price: "$250.00", img:"assests/img/images.png" },
  { name: "jordan 4 order", price: "$220.00", img:"assests/img/images.png" },
  { name: "jordan 4 university", price: "$270.00", img:"assests/img/images.png" },
  { name: "jordan 4 weed", price: "$190.00", img: "assests/img/images.png" },
  { name: "jordan 4 thunder", price: "$260.00", img: "assests/img/images.png" },
  { name: "jordan 4 canvas", price: "$210.00", img: "assests/img/images.png" }
];

function renderProducts(containerId, productList) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // clear previous content

  productList.forEach((product) => {
    const card = document.createElement("div");
    card.className = "col-md-3 mb-4";

    card.innerHTML = `
      <div class="card shadow-sm border-0 h-100">
        <img src="${product.img}" class="card-img-top" alt="${product.name}">
        <div class="card-body text-center">
          <h5 class="card-title fw-bold">${product.name}</h5>
          <p class="card-text text-success fw-semibold">$${product.price}</p>
          <a href="#" class="btn btn-warning fw-bold text-white">Get Yours</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// on page load
document.addEventListener("DOMContentLoaded", () => {
  renderProducts("product-section-1", products.slice(0,4 )); // first section
  renderProducts("product-section-2", products.slice(4, 8)); // second section with 6 items
  renderProducts("product-section-3", products.slice(8, 12)); // second section with 6 items
});
