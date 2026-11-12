const WHATSAPP_NUMBER = ""; // Add your business WhatsApp number with country code, e.g. 91XXXXXXXXXX
const starterProducts = [
  {id:1,name:"Everyday Black Shirt",price:899,description:"A versatile style for everyday wear.",image:""},
  {id:2,name:"Classic Casual Tee",price:499,description:"A simple essential for your wardrobe.",image:""},
  {id:3,name:"Urban Denim",price:1299,description:"Easy-to-style denim for casual looks.",image:""}
];

const STORAGE_KEY = "menzowear_demo_products";
let products = loadProducts();

function loadProducts(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || starterProducts; }
  catch { return starterProducts; }
}
function saveProducts(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); }
function renderProducts(){
  const grid = document.getElementById("product-grid");
  document.getElementById("product-count").textContent = `${products.length} products`;
  grid.innerHTML = "";
  products.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    const image = product.image ? `<img class="product-image" src="${escapeAttr(product.image)}" alt="${escapeAttr(product.name)}" onerror="this.outerHTML='<div class=\'placeholder\'>MENZOWEAR</div>'">` : `<div class="placeholder">MENZOWEAR</div>`;
    const message = encodeURIComponent(`Hello MENZOWEAR, I am interested in ${product.name} (₹${product.price}).`);
    const orderHref = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${message}` : `https://wa.me/?text=${message}`;
    card.innerHTML = `${image}<div class="product-info"><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.description || "")}</p><div class="price">₹${Number(product.price).toLocaleString("en-IN")}</div><a class="order-link" target="_blank" rel="noopener" href="${orderHref}">ORDER ON WHATSAPP →</a></div>`;
    grid.appendChild(card);
  });
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function escapeAttr(value){return escapeHtml(value);}
document.getElementById("product-form").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const price = Number(document.getElementById("price").value);
  const image = document.getElementById("image").value.trim();
  const description = document.getElementById("description").value.trim();
  if(!name || !Number.isFinite(price) || price <= 0) return;
  products.unshift({id:Date.now(),name,price,image,description});
  saveProducts();
  renderProducts();
  event.target.reset();
  alert("Product added in this browser. Note: this demo change is not published for other visitors.");
});
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
