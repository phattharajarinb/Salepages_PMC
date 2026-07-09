// =============================================================
// Pharmacy Real Shop - Frontend
// =============================================================

// ---------- Storage keys ----------
const PRODUCT_KEY = "pcot_products_v2";
const CART_KEY = "pcot_cart_v2";
const ORDER_KEY = "pcot_orders_v2";
const WISH_KEY = "pcot_wishlist_v2";

// ---------- สถานะคำสั่งซื้อแบบย่อ ให้เหมือนเว็บขายสินค้าจริง ----------
const ORDER_STATUS_FLOW = [
  "รอชำระเงิน",
  "กำลังเตรียมสินค้า",
  "พร้อมรับสินค้า", // สำหรับลูกค้าที่เลือก "รับด้วยตนเอง"
  "กำลังจัดส่ง",
  "จัดส่งสำเร็จ"
];

const ORDER_STATUS_CLASS = {
  รอชำระเงิน: "status-pending",
  กำลังเตรียมสินค้า: "status-preparing",
  พร้อมรับสินค้า: "status-ready-pickup",
  กำลังจัดส่ง: "status-shipping",
  จัดส่งสำเร็จ: "status-completed",
  ยกเลิก: "status-cancelled",
};

// ---------- สินค้าตั้งต้น ----------
const seedProducts = [
  {
    id: "p1",
    name: "ตำราวิชาการเภสัชศาสตร์ เล่ม 1",
    category: "books",
    categoryName: "หนังสือเรียน",
    price: 420,
    stock: 30,
    badge: "BEST",
    image: "assets/products/book.jpg",
    desc: "หนังสือเรียนและตำราวิชาการสำหรับนักศึกษาเภสัชศาสตร์ ใช้ประกอบการเรียนและทบทวนความรู้วิชาชีพ",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p2",
    name: "เสื้อกาวน์เภสัชกรชาย",
    category: "coats",
    categoryName: "เสื้อกาวน์",
    price: 850,
    stock: 18,
    badge: "NEW",
    image: "assets/products/coat-men.jpg",
    desc: "เสื้อกาวน์ชาย ปักตราสภาเภสัชกรรม เนื้อผ้าสุภาพ ใส่สบาย เหมาะสำหรับงานวิชาชีพ",
    colors: ["ขาว"],
    sizes: ["S", "M", "L", "XL"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "p3",
    name: "เสื้อกาวน์เภสัชกรหญิง",
    category: "coats",
    categoryName: "เสื้อกาวน์",
    price: 850,
    stock: 20,
    badge: "NEW",
    image: "assets/products/coat-women.jpg",
    desc: "เสื้อกาวน์หญิง ปักตราสภาเภสัชกรรม ทรงสุภาพสำหรับงานวิชาชีพและสถานพยาบาล",
    colors: ["ขาว"],
    sizes: ["S", "M", "L", "XL"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "p4",
    name: "อาร์มสภาเภสัชกรรม",
    category: "patches",
    categoryName: "อาร์ม",
    price: 180,
    stock: 50,
    image: "assets/products/patch.jpg",
    desc: "อาร์มปักตราสภาเภสัชกรรม สำหรับติดเสื้อกาวน์ งานปักละเอียด สีคมชัด",
    colors: ["เขียว"],
    sizes: ["1 ชิ้น", "2 ชิ้น", "5 ชิ้น"],
    createdAt: new Date().toISOString(),
  },
];

// ---------- หมวดหมู่ที่แสดงหน้าเว็บ ----------
const categories = [
  ["all", "ทั้งหมด", "6 รายการ", "fa-border-all"],
  ["books", "หนังสือเรียน", "1 รายการ", "fa-book-open"],
  ["coats", "เสื้อกาวน์", "2 รายการ", "fa-shirt"],
  ["patches", "อาร์ม", "1 รายการ", "fa-shield-halved"],
  ["souvenirs", "ของที่ระลึก", "2 รายการ", "fa-gift"],
];

// ---------- ข้อมูลจังหวัด/อำเภอ/ตำบลตัวอย่างสำหรับฟอร์มเลือกที่อยู่เอง ----------
// หมายเหตุ: ในระบบจริงควรดึงข้อมูลจังหวัดทั้งหมดจากฐานข้อมูลหรือ API กลาง
const ADDRESS_DATA = {
  กรุงเทพมหานคร: {
    จตุจักร: {
      ลาดยาว: "10900",
      จันทรเกษม: "10900",
      เสนานิคม: "10900",
    },
    บางกะปิ: {
      หัวหมาก: "10240",
      คลองจั่น: "10240",
    },
    บางเขน: {
      อนุสาวรีย์: "10220",
      ท่าแร้ง: "10220",
    },
  },

  นนทบุรี: {
    เมืองนนทบุรี: {
      ตลาดขวัญ: "11000",
      บางกระสอ: "11000",
    },
    ปากเกร็ด: {
      ปากเกร็ด: "11120",
      บางพูด: "11120",
    },
  },

  ปทุมธานี: {
    คลองหลวง: {
      คลองหนึ่ง: "12120",
      คลองสอง: "12120",
      คลองสาม: "12120",
    },
    เมืองปทุมธานี: {
      บางปรอก: "12000",
      บางเดื่อ: "12000",
    },
  },

  สมุทรปราการ: {
    เมืองสมุทรปราการ: {
      ปากน้ำ: "10270",
      ท้ายบ้าน: "10280",
    },
    บางพลี: {
      บางพลีใหญ่: "10540",
      บางแก้ว: "10540",
    },
  },

  สมุทรสาคร: {
    เมืองสมุทรสาคร: {
      มหาชัย: "74000",
      ท่าฉลอม: "74000",
    },
    กระทุ่มแบน: {
      ตลาดกระทุ่มแบน: "74110",
      อ้อมน้อย: "74130",
    },
  },

  พระนครศรีอยุธยา: {
    เมืองพระนครศรีอยุธยา: {
      ประตูชัย: "13000",
      หัวรอ: "13000",
    },
    บางปะอิน: {
      บ้านกรด: "13160",
      เชียงรากน้อย: "13180",
    },
  },

  ชลบุรี: {
    เมืองชลบุรี: {
      บางปลาสร้อย: "20000",
      บ้านสวน: "20000",
    },
    ศรีราชา: {
      ศรีราชา: "20110",
      สุรศักดิ์: "20110",
    },
  },

  เชียงใหม่: {
    เมืองเชียงใหม่: {
      ศรีภูมิ: "50200",
      สุเทพ: "50200",
    },
    สันทราย: {
      หนองหาร: "50290",
      สันทรายน้อย: "50210",
    },
  },

  นครราชสีมา: {
    เมืองนครราชสีมา: {
      ในเมือง: "30000",
      หัวทะเล: "30000",
    },
    ปากช่อง: {
      ปากช่อง: "30130",
      หมูสี: "30130",
    },
  },

  ขอนแก่น: {
    เมืองขอนแก่น: {
      ในเมือง: "40000",
      ศิลา: "40000",
    },
    บ้านไผ่: {
      ในเมือง: "40110",
      บ้านไผ่: "40110",
    },
  },
};

// ---------- ที่อยู่สมาชิกตัวอย่าง ใช้จำลองกรณีผู้ใช้ Login อยู่แล้ว ----------
const REGISTERED_ADDRESS = {
  name: "ภก. สมชาย รักษาดี",
  phone: "081-234-5678",
  address: "99/15 หมู่ 3 ถนนงามวงศ์วาน แขวงลาดยาว เขตจตุจักร กรุงเทพมหานคร 10900",
};

// ---------- Helper functions ----------
const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);
const baht = (n) => `฿${Number(n).toLocaleString()}`;
function getStore(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.warn(`localStorage key ${key} อ่านไม่ได้ จึงใช้ค่าเริ่มต้นแทน`, error);
    return fallback;
  }
}

function setStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------- สร้างข้อมูลเริ่มต้นครั้งแรก ----------
// ถ้า localStorage เคยถูกบันทึกเป็น array ว่างจากเวอร์ชันก่อน สินค้าจะไม่ขึ้น
// จึงเติม seedProducts ให้ใหม่เฉพาะกรณีไม่มีสินค้าเลยเท่านั้น
const currentProducts = getStore(PRODUCT_KEY, []);
if (!currentProducts.length) setStore(PRODUCT_KEY, seedProducts);
if (!localStorage.getItem(CART_KEY)) setStore(CART_KEY, []);
if (!localStorage.getItem(ORDER_KEY)) setStore(ORDER_KEY, []);
if (!localStorage.getItem(WISH_KEY)) setStore(WISH_KEY, []);

let activeCategory = "all";
let currentProduct = null;
let selectedColor = "";
let selectedSize = "";
let selectedQty = 1;

// เก็บออเดอร์ชั่วคราวระหว่างเปิด QR Payment Mockup
let pendingQrOrder = null;

// ---------- แสดง Badge สถานะพร้อมสี ----------
function statusBadge(status) {
  const cls = ORDER_STATUS_CLASS[status] || "status-preparing";
  return `<span class="status-badge ${cls}">${status}</span>`;
}

function statusIndex(status) {
  if (status === "ยกเลิก") return -1;
  return ORDER_STATUS_FLOW.indexOf(status);
}

// ---------- สร้างการ์ดสินค้า ----------
function productCard(p) {
  return `
    <article class="card">
      <div class="pic">
        <img src="${p.image}" alt="${p.name}" data-view="${p.id}">
        <span class="badge">${p.badge || "NEW"}</span>
        <button class="heart" data-wish="${p.id}" aria-label="เพิ่ม Wishlist">
          <i class="fa-regular fa-heart"></i>
        </button>
      </div>

      <div class="content">
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>

        <div class="meta">
          ${(p.colors || [])
            .slice(0, 3)
            .map((x) => `<span class="chip">${x}</span>`)
            .join("")}
          ${(p.sizes || [])
            .slice(0, 3)
            .map((x) => `<span class="chip">${x}</span>`)
            .join("")}
        </div>

        <div class="bottom">
          <div class="price">${baht(p.price)}</div>
          <button class="cart" data-cart="${p.id}" aria-label="เพิ่มลงตะกร้า">
            <i class="fa-solid fa-cart-shopping"></i>
          </button>
        </div>
      </div>
    </article>`;
}

function bindCards() {
  $$("[data-view]").forEach((img) => (img.onclick = () => openProduct(img.dataset.view)));
  $$("[data-cart]").forEach((btn) => (btn.onclick = () => quickAddCart(btn.dataset.cart)));
  $$("[data-wish]").forEach((btn) => (btn.onclick = () => addWishlist(btn.dataset.wish)));
}

function renderCategories() {
  $("#catList").innerHTML = categories
    .map(
      (c) => `
    <button class="cat ${activeCategory === c[0] ? "active" : ""}" data-cat="${c[0]}">
      <i class="fa-solid ${c[3]}"></i>
      <div><strong>${c[1]}</strong><span>${c[2]}</span></div>
    </button>`,
    )
    .join("");

  $$(".cat").forEach(
    (b) =>
      (b.onclick = () => {
        activeCategory = b.dataset.cat;
        showShop();
        renderCategories();
        renderProducts();
      }),
  );
}

function renderProducts() {
  const productGrid = $("#productGrid");
  if (!productGrid) return;

  const searchInput = $("#searchInput");
  const kw = searchInput ? searchInput.value.trim().toLowerCase() : "";
  let list = getStore(PRODUCT_KEY, seedProducts);

  // ป้องกันกรณี localStorage เก็บสินค้าเป็น array ว่าง ทำให้หน้าเว็บไม่แสดงสินค้า
  if (!list.length) {
    list = seedProducts;
    setStore(PRODUCT_KEY, seedProducts);
  }

  if (activeCategory !== "all") list = list.filter((p) => p.category === activeCategory);
  if (kw)
    list = list.filter((p) =>
      [p.name, p.desc, p.categoryName].join(" ").toLowerCase().includes(kw),
    );

  productGrid.innerHTML =
    list.map(productCard).join("") || `<div class="order">ไม่พบสินค้า</div>`;
  bindCards();
}

// ---------- สลับ Section หน้าเว็บ ----------
function showShop() {
  $("#products").classList.remove("hidden");
  $("#categorySection").classList.remove("hidden");
  $("#wishlistPanel").classList.add("hidden");
  $("#myOrdersPanel").classList.add("hidden");
  $("#checkout").classList.add("hidden");
  setActiveTab("all");
}

function setActiveTab(name) {
  $$("[data-store-tab]").forEach((b) => b.classList.toggle("active", b.dataset.storeTab === name));
}

function showWishlist() {
  setActiveTab("wishlist");
  $("#products").classList.add("hidden");
  $("#categorySection").classList.add("hidden");
  $("#myOrdersPanel").classList.add("hidden");
  $("#checkout").classList.add("hidden");
  $("#wishlistPanel").classList.remove("hidden");

  const ids = getStore(WISH_KEY);
  const list = getStore(PRODUCT_KEY).filter((p) => ids.includes(p.id));
  $("#wishlistGrid").innerHTML =
    list.map(productCard).join("") || `<div class="order">ยังไม่มีสินค้าใน Wishlist</div>`;
  bindCards();
}

function showMyOrders() {
  setActiveTab("orders");
  $("#products").classList.add("hidden");
  $("#categorySection").classList.add("hidden");
  $("#wishlistPanel").classList.add("hidden");
  $("#checkout").classList.add("hidden");
  $("#myOrdersPanel").classList.remove("hidden");
  renderMyOrders();
}

function renderMyOrders() {
  const orders = getStore(ORDER_KEY);

  $("#myOrders").innerHTML =
    orders
      .map(
        (o) => `
    <div class="order">
      <div class="order-grid">
        <div>
          <h3>${o.id}</h3>
          <p>วันที่สั่ง: ${new Date(o.createdAt).toLocaleString("th-TH")}</p>
          <p>ชื่อผู้รับ: ${o.customer.name}</p>
          <p>ยอดรวม: <b>${baht(o.total)}</b></p>
          ${statusBadge(o.status)}
          ${o.paymentStatus ? `<p class="payment-line">สถานะชำระเงิน: <b>${o.paymentStatus}</b></p>` : ""}
          <p>วิธีรับสินค้า: <b>${deliveryLabel(o.delivery?.type)}</b></p>
          ${o.delivery?.address ? `<p class="tracking-no">${o.delivery.address}</p>` : ""}
          ${o.customer?.note ? `<p class="order-note">หมายเหตุจากร้าน: ${o.customer.note}</p>` : ""}
          ${o.tracking ? `<p class="tracking-no">เลขพัสดุ: <b>${o.tracking}</b></p>` : ""}
        </div>
        <div>
          ${o.items.map((i) => `<p>${i.name} (${i.color} ${i.size}) × ${i.qty}</p>`).join("")}
          <div class="timeline">
            ${ORDER_STATUS_FLOW.map((s, idx) => `<span class="step ${idx <= statusIndex(o.status) ? "done" : ""}">${s}</span>`).join("")}
          </div>
        </div>
      </div>
    </div>`,
      )
      .join("") || `<div class="order">ยังไม่มีออเดอร์</div>`;
}

// ---------- Product Modal ----------
function openProduct(id) {
  currentProduct = getStore(PRODUCT_KEY).find((p) => p.id === id);
  if (!currentProduct) return;

  selectedColor = currentProduct.colors?.[0] || "";
  selectedSize = currentProduct.sizes?.[0] || "";
  selectedQty = 1;

  $("#modalImg").src = currentProduct.image;
  $("#modalBadge").textContent = currentProduct.badge || "NEW";
  $("#modalName").textContent = currentProduct.name;
  $("#modalDesc").textContent = currentProduct.desc;
  $("#modalPrice").textContent = baht(currentProduct.price);
  $("#qty").textContent = selectedQty;

  renderModalOptions();
  $("#productModal").classList.add("show");
}

function renderModalOptions() {
  $("#colorOptions").innerHTML = (currentProduct.colors || [])
    .map(
      (c) => `
    <button class="option ${c === selectedColor ? "active" : ""}" data-color="${c}">${c}</button>`,
    )
    .join("");

  $("#sizeOptions").innerHTML = (currentProduct.sizes || [])
    .map(
      (s) => `
    <button class="option ${s === selectedSize ? "active" : ""}" data-size="${s}">${s}</button>`,
    )
    .join("");

  $$("[data-color]").forEach(
    (b) =>
      (b.onclick = () => {
        selectedColor = b.dataset.color;
        renderModalOptions();
      }),
  );

  $$("[data-size]").forEach(
    (b) =>
      (b.onclick = () => {
        selectedSize = b.dataset.size;
        renderModalOptions();
      }),
  );
}

// ---------- Checkout delivery helpers ----------
function deliveryLabel(type) {
  if (type === "pickup") return "รับด้วยตนเอง";
  if (type === "registered") return "จัดส่งที่อยู่ที่ลงทะเบียนไว้";
  if (type === "custom") return "เลือกที่อยู่เอง";
  return "-";
}

function getDeliveryType() {
  return document.querySelector('input[name="deliveryType"]:checked')?.value || "pickup";
}

function deliveryFee(type = getDeliveryType()) {
  return type === "pickup" ? 0 : 60;
}

function renderAddressSelects() {
  const province = $("#shipProvince");
  const district = $("#shipDistrict");
  const subdistrict = $("#shipSubdistrict");
  const zip = $("#shipZip");
  if (!province || !district || !subdistrict || !zip) return;

  province.innerHTML = Object.keys(ADDRESS_DATA)
    .map((x) => `<option>${x}</option>`)
    .join("");

  function fillDistricts() {
    const districts = Object.keys(ADDRESS_DATA[province.value] || {});
    district.innerHTML = districts.map((x) => `<option>${x}</option>`).join("");
    fillSubdistricts();
  }

  function fillSubdistricts() {
    const subs = Object.keys(ADDRESS_DATA[province.value]?.[district.value] || {});
    subdistrict.innerHTML = subs.map((x) => `<option>${x}</option>`).join("");
    zip.value = ADDRESS_DATA[province.value]?.[district.value]?.[subdistrict.value] || "";
  }

  province.onchange = fillDistricts;
  district.onchange = fillSubdistricts;
  subdistrict.onchange = () => {
    zip.value = ADDRESS_DATA[province.value]?.[district.value]?.[subdistrict.value] || "";
  };

  fillDistricts();
}

function setDeliveryType(type) {
  $$('input[name="deliveryType"]').forEach((r) => (r.checked = r.value === type));
  $$(".delivery-option").forEach((card) =>
    card.classList.toggle("active", card.dataset.deliveryCard === type),
  );
  $("#pickupDetail")?.classList.toggle("hidden", type !== "pickup");
  $("#registeredDetail")?.classList.toggle("hidden", type !== "registered");
  $("#customDetail")?.classList.toggle("hidden", type !== "custom");
  renderCheckoutSummary();
}

function renderCheckoutSummary() {
  const cart = getStore(CART_KEY);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = deliveryFee();

  if ($("#checkoutSummaryItems")) {
    $("#checkoutSummaryItems").innerHTML =
      cart
        .map(
          (i) => `
      <div class="summary-product">
        <span>${i.name}<small>${i.color} ${i.size} × ${i.qty}</small></span>
        <b>${baht(i.price * i.qty)}</b>
      </div>`,
        )
        .join("") || `<p class="hint">ยังไม่มีสินค้าในตะกร้า</p>`;
  }
  if ($("#checkoutSubtotal")) $("#checkoutSubtotal").textContent = baht(subtotal);
  if ($("#checkoutShipping"))
    $("#checkoutShipping").textContent = shipping ? baht(shipping) : "ฟรี";
  if ($("#checkoutGrandTotal")) $("#checkoutGrandTotal").textContent = baht(subtotal + shipping);
}

function buildDeliveryPayload() {
  const type = getDeliveryType();
  if (type === "pickup") {
    return {
      type,
      fee: 0,
      address:
        "สำนักงานเลขาธิการสภาเภสัชกรรม อาคารมหิตลาธิเบศร ชั้น 8 กระทรวงสาธารณสุข เลขที่ 88/19 หมู่ 4 ถนนติวานนท์ ตำบลตลาดขวัญ อำเภอเมือง จังหวัดนนทบุรี 11000",
    };
  }
  if (type === "registered") {
    return { type, fee: 60, ...REGISTERED_ADDRESS };
  }

  const name = $("#shipName").value.trim() || $("#customerName").value.trim();
  const phone = $("#shipPhone").value.trim() || $("#customerPhone").value.trim();
  const house = $("#shipHouse").value.trim();
  const moo = $("#shipMoo").value.trim();
  const road = $("#shipRoad").value.trim();
  const province = $("#shipProvince").value;
  const district = $("#shipDistrict").value;
  const subdistrict = $("#shipSubdistrict").value;
  const zip = $("#shipZip").value;

  if (!house) {
    alert("กรุณากรอกบ้านเลขที่ / อาคาร / ห้อง");
    return null;
  }

  const address = `${house}${moo ? ` หมู่ ${moo}` : ""}${road ? ` ถนน${road}` : ""} ตำบล/แขวง${subdistrict} อำเภอ/เขต${district} จังหวัด${province} ${zip}`;
  return { type, fee: 60, name, phone, address, province, district, subdistrict, zip };
}

// ---------- Cart ----------
function addCartItem(p, qty, color, size) {
  const cart = getStore(CART_KEY);
  const found = cart.find((i) => i.id === p.id && i.color === color && i.size === size);

  if (found) found.qty += qty;
  else cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, qty, color, size });

  setStore(CART_KEY, cart);
  updateCounts();
}

function quickAddCart(id) {
  const p = getStore(PRODUCT_KEY).find((x) => x.id === id);
  if (!p) return;
  addCartItem(p, 1, p.colors?.[0] || "", p.sizes?.[0] || "");
  openCart();
}

function addCurrentToCart() {
  if (!currentProduct) return;
  addCartItem(currentProduct, selectedQty, selectedColor, selectedSize);
  $("#productModal").classList.remove("show");
  openCart();
}

function addWishlist(id) {
  const w = getStore(WISH_KEY);
  if (!w.includes(id)) w.push(id);
  setStore(WISH_KEY, w);
  updateCounts();
  alert("เพิ่มลง Wishlist แล้ว");
}

function updateCounts() {
  const cartCount = getStore(CART_KEY).reduce((s, i) => s + i.qty, 0);
  const wishCount = getStore(WISH_KEY).length;
  $("#cartCount").textContent = cartCount;
  $("#cartTabCount").textContent = cartCount;
  $("#wishlistCount").textContent = wishCount;
}

function openCart() {
  renderCart();
  $("#cartDrawer").classList.add("show");
  setActiveTab("cart");
}

function renderCart() {
  const cart = getStore(CART_KEY);
  $("#cartItems").innerHTML =
    cart
      .map(
        (i, idx) => `
    <div class="cart-item">
      <img src="${i.image}" alt="${i.name}">
      <div>
        <b>${i.name}</b><br>
        <small>${i.color} ${i.size}</small><br>
        ${baht(i.price)} × ${i.qty}
      </div>
      <button onclick="removeCart(${idx})">ลบ</button>
    </div>`,
      )
      .join("") || `<p>ยังไม่มีสินค้าในตะกร้า</p>`;

  $("#cartTotal").textContent = baht(cart.reduce((s, i) => s + i.price * i.qty, 0));
}

window.removeCart = (idx) => {
  const cart = getStore(CART_KEY);
  cart.splice(idx, 1);
  setStore(CART_KEY, cart);
  renderCart();
  updateCounts();
};

// ---------- Checkout: เตรียมข้อมูลคำสั่งซื้อจากตะกร้า ----------
function buildOrderDraft() {
  const cart = getStore(CART_KEY);
  const delivery = buildDeliveryPayload();
  if (!delivery) return null;

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const paymentMethod = $("#payment").value;

  return {
    id: `PCOT-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
    customer: {
      name: $("#customerName").value,
      phone: $("#customerPhone").value,
      email: $("#customerEmail").value,
      payment: paymentMethod,
      note: "",
    },
    paymentMethod,
    paymentStatus: paymentMethod.includes("QR") ? "รอชำระเงิน" : "รอชำระเงิน",
    paidAt: "",
    delivery,
    items: cart,
    subtotal,
    shippingFee: delivery.fee,
    total: subtotal + delivery.fee,
    status: "รอชำระเงิน",
    tracking: "",
    timeline: ORDER_STATUS_FLOW,
  };
}

// ---------- บันทึกออเดอร์ลง localStorage เพื่อให้ Backoffice อ่านได้ทันที ----------
function saveOrder(order) {
  const orders = getStore(ORDER_KEY);
  orders.unshift(order);
  setStore(ORDER_KEY, orders);
  setStore(CART_KEY, []);

  updateCounts();
  renderCart();
  $("#checkoutForm").reset();
  setDeliveryType("pickup");
}

// ---------- เปิด QR Payment Mockup ----------
function openQrPayment(order) {
  pendingQrOrder = order;

  $("#qrOrderId").textContent = order.id;
  $("#qrTotal").textContent = baht(order.total);
  $("#qrCustomer").textContent = order.customer.name || "-";
  $("#qrDelivery").textContent = deliveryLabel(order.delivery?.type);

  $("#qrPaymentModal").classList.add("show");
  $("#qrPaymentModal").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

// ---------- ปิด QR Payment Mockup ----------
function closeQrPayment() {
  $("#qrPaymentModal").classList.remove("show");
  $("#qrPaymentModal").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// ---------- กดยืนยันชำระเงิน QR แล้วบันทึกออเดอร์จริง ----------
function confirmQrPayment() {
  if (!pendingQrOrder) return;

  const paidOrder = {
    ...pendingQrOrder,
    status: "กำลังเตรียมสินค้า",
    paymentStatus: "ชำระเงินเรียบร้อย",
    paidAt: new Date().toISOString(),
  };

  saveOrder(paidOrder);
  pendingQrOrder = null;
  closeQrPayment();

  alert(`ชำระเงินเรียบร้อย เลขออเดอร์ ${paidOrder.id}`);
  showMyOrders();
}

// ---------- Checkout: สร้างคำสั่งซื้อ หรือเปิด QR Payment ----------
function submitOrder(e) {
  e.preventDefault();

  const cart = getStore(CART_KEY);
  if (!cart.length) return alert("กรุณาเลือกสินค้าก่อน");

  const order = buildOrderDraft();
  if (!order) return;

  // ถ้าเลือก QR Payment ให้แสดงมอกอัป QR ก่อน ยังไม่บันทึกออเดอร์จนกว่าจะกดยืนยันชำระเงิน
  if (order.paymentMethod.includes("QR")) {
    openQrPayment(order);
    return;
  }

  // วิธีชำระเงินอื่น ๆ จำลองเป็นออเดอร์รอชำระเงิน
  saveOrder(order);
  alert(`สั่งซื้อสำเร็จ เลขออเดอร์ ${order.id}`);
  showMyOrders();
}

// ---------- Bind events ----------
function bindEvents() {
  $("#searchBtn").onclick = renderProducts;
  $("#searchInput").oninput = renderProducts;

  $("#showAll").onclick = () => {
    activeCategory = "all";
    $("#searchInput").value = "";
    renderCategories();
    renderProducts();
  };

  $("#openCart").onclick = openCart;
  $("#closeCart").onclick = () => $("#cartDrawer").classList.remove("show");

  $("#goCheckout").onclick = () => {
    $("#cartDrawer").classList.remove("show");
    setActiveTab("cart");
    $("#products").classList.add("hidden");
    $("#categorySection").classList.add("hidden");
    $("#wishlistPanel").classList.add("hidden");
    $("#myOrdersPanel").classList.add("hidden");
    $("#checkout").classList.remove("hidden");
    renderCheckoutSummary();
    location.hash = "checkout";
  };

  renderAddressSelects();
  $$(".delivery-option").forEach(
    (card) => (card.onclick = () => setDeliveryType(card.dataset.deliveryCard)),
  );
  $$('input[name="deliveryType"]').forEach(
    (radio) => (radio.onchange = () => setDeliveryType(radio.value)),
  );
  setDeliveryType("pickup");

  $("#checkoutForm").onsubmit = submitOrder;

  // ปุ่มใน QR Payment Mockup
  $("#confirmQrPayment").onclick = confirmQrPayment;
  $$('[data-close-qr]').forEach((el) => (el.onclick = closeQrPayment));

  $$("[data-close]").forEach(
    (x) => (x.onclick = () => $("#productModal").classList.remove("show")),
  );

  $("#plus").onclick = () => {
    selectedQty++;
    $("#qty").textContent = selectedQty;
  };

  $("#minus").onclick = () => {
    if (selectedQty > 1) selectedQty--;
    $("#qty").textContent = selectedQty;
  };

  $("#addCartModal").onclick = addCurrentToCart;
  $("#wishModal").onclick = () => currentProduct && addWishlist(currentProduct.id);

  $$("[data-store-tab]").forEach(
    (b) =>
      (b.onclick = () => {
        const t = b.dataset.storeTab;
        if (t === "all") showShop();
        if (t === "wishlist") showWishlist();
        if (t === "orders") showMyOrders();
        if (t === "cart") openCart();
      }),
  );
}

renderCategories();
renderProducts();
updateCounts();
bindEvents();
