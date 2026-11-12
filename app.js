// Каталог демонстрационных товаров. Цены указаны в узбекских сумах.
const products = [
  {id:1,brand:"SOUTHPOLE",name:"Baggy Denim — Indigo",price:890000,category:"bottoms",tag:"BESTSELLER",art:"SP",style:"visual-1"},
  {id:2,brand:"COOGI",name:"Vintage Knit Sweater",price:2450000,category:"tops",tag:"ICONIC",art:"C",style:"visual-2"},
  {id:3,brand:"ECKŌ UNLTD.",name:"Rhino Graphic Tee",price:680000,category:"tops",tag:"00s CLASSIC",art:"E",style:"visual-3"},
  {id:4,brand:"ED HARDY",name:"Skull Print Hoodie",price:1890000,category:"tops",tag:"STATEMENT",art:"EH",style:"visual-4"},
  {id:5,brand:"AFFLICTION",name:"Vintage Tattoo Tee",price:1150000,category:"tops",tag:"LIMITED",art:"A",style:"visual-5"},
  {id:6,brand:"ROCAWEAR",name:"Utility Cargo Pants",price:1290000,category:"bottoms",tag:"STREET FIT",art:"RW",style:"visual-6"},
  {id:7,brand:"NEW ERA",name:"Classic Fitted Cap",price:520000,category:"accessories",tag:"ESSENTIAL",art:"NY",style:"visual-7"},
  {id:8,brand:"PELLE PELLE",name:"Leather Varsity Jacket",price:3750000,category:"tops",tag:"ARCHIVE PICK",art:"PP",style:"visual-8"}
];

const money = value => new Intl.NumberFormat("ru-RU").format(value) + " сум";
let activeFilter = "all";
let cart = JSON.parse(localStorage.getItem("y2k-cart") || "[]");

const grid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

function renderProducts(){
  const query = searchInput.value.trim().toLowerCase();
  let visible = products.filter(p => {
    const matchesCategory = activeFilter === "all" || p.category === activeFilter;
    const matchesSearch = `${p.brand} ${p.name}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  if(sortSelect.value === "low") visible.sort((a,b)=>a.price-b.price);
  if(sortSelect.value === "high") visible.sort((a,b)=>b.price-a.price);
  grid.innerHTML = visible.map(p => `
    <article class="product-card">
      <div class="product-visual ${p.style}">
        <span class="product-tag">${p.tag}</span>
        <div class="product-art">${p.art}<small>${p.brand}</small></div>
        <button class="quick-add" data-add="${p.id}">+ ДОБАВИТЬ В КОРЗИНУ</button>
      </div>
      <div class="product-meta">
        <div><div class="product-brand">${p.brand}</div><div class="product-name">${p.name}</div></div>
        <div class="product-price">${money(p.price)}</div>
      </div>
    </article>`).join("");
  emptyState.hidden = visible.length !== 0;
}

function saveCart(){
  localStorage.setItem("y2k-cart", JSON.stringify(cart));
  renderCart();
}
function addToCart(id){
  const item = cart.find(p => p.id === id);
  if(item) item.qty += 1;
  else cart.push({...products.find(p => p.id === id), qty:1});
  saveCart();
  showToast("ДОБАВЛЕНО В КОРЗИНУ");
}
function renderCart(){
  const count = cart.reduce((sum,p)=>sum+p.qty,0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartItems").innerHTML = cart.length ? cart.map(p=>`
    <div class="cart-item">
      <div class="cart-thumb">${p.art}</div>
      <div><strong>${p.brand}</strong><small>${p.name} · ${p.qty} шт.</small><small>${money(p.price*p.qty)}</small></div>
      <button class="remove-item" data-remove="${p.id}" aria-label="Удалить ${p.name}">×</button>
    </div>`).join("") : '<p class="empty-state">Твоя корзина пока пуста.</p>';
  document.getElementById("cartTotal").textContent = money(cart.reduce((sum,p)=>sum+p.price*p.qty,0));
}
function showToast(message){
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(()=>toast.classList.remove("show"),1800);
}
function openCart(){
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("overlay").classList.add("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden","false");
}
function closeCart(){
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden","true");
}

document.getElementById("filters").addEventListener("click", e=>{
  const button = e.target.closest("[data-filter]");
  if(!button) return;
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===button));
  renderProducts();
});
grid.addEventListener("click", e=>{
  const button = e.target.closest("[data-add]");
  if(button) addToCart(Number(button.dataset.add));
});
document.getElementById("cartItems").addEventListener("click", e=>{
  const button = e.target.closest("[data-remove]");
  if(!button) return;
  cart = cart.filter(p=>p.id !== Number(button.dataset.remove));
  saveCart();
});
searchInput.addEventListener("input",renderProducts);
sortSelect.addEventListener("change",renderProducts);
document.getElementById("cartTrigger").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
document.getElementById("overlay").addEventListener("click",closeCart);
document.getElementById("checkoutButton").addEventListener("click",()=>{
  if(!cart.length){showToast("КОРЗИНА ПУСТА");return;}
  showToast("ДЕМО-ЗАКАЗ: ОПЛАТА НЕ ПОДКЛЮЧЕНА");
});
document.getElementById("menuToggle").addEventListener("click",()=>{
  document.getElementById("mainNav").classList.toggle("open");
});
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("open")));

renderProducts();
renderCart();
