/* =============================================================
   Pharmacy Real Shop - Frontend App
   ใช้กับ index.html หน้าร้านหลัก
   - แสดงสินค้า / หมวดหมู่ / ค้นหา
   - Product Detail Modal
   - Wishlist / Cart Drawer
   - Checkout + วิธีรับสินค้า
   - QR Payment Mockup
   - สร้างออเดอร์ให้ Backoffice อ่านจาก localStorage ได้
   ============================================================= */

(function () {
  "use strict";

  /* =============================================================
     1) localStorage Keys
     ต้องตรงกับ Backoffice admin.js / products.html
     ============================================================= */
  const PRODUCT_KEY = "pcot_products_v2";
  const CAT_KEY = "pcot_categories_v2";
  const ORDER_KEY = "pcot_orders_v2";
  const CART_KEY = "pcot_cart_v2";
  const WISHLIST_KEY = "pcot_wishlist_v2";

  /* =============================================================
     2) Order Status
     เพิ่ม "พร้อมรับสินค้า" สำหรับออเดอร์รับด้วยตนเอง
     ============================================================= */
  const ORDER_STATUS_FLOW = [
    "รอชำระเงิน",
    "กำลังเตรียมสินค้า",
    "พร้อมรับสินค้า",
    "กำลังจัดส่ง",
    "จัดส่งสำเร็จ",
  ];

  const ORDER_STATUS_CLASS = {
    "รอชำระเงิน": "status-pending",
    "กำลังเตรียมสินค้า": "status-preparing",
    "พร้อมรับสินค้า": "status-ready-pickup",
    "กำลังจัดส่ง": "status-shipping",
    "จัดส่งสำเร็จ": "status-completed",
    "ยกเลิก": "status-cancelled",
  };

  /* =============================================================
     3) Default Data
     ใช้เติมข้อมูลเริ่มต้นเมื่อ localStorage ยังไม่มีสินค้า/หมวดหมู่
     ============================================================= */
  const DEFAULT_CATEGORIES = [
    { id: "books", name: "หนังสือเรียน", icon: "fa-solid fa-book-open" },
    { id: "coats", name: "เสื้อกาวน์", icon: "fa-solid fa-shirt" },
    { id: "patches", name: "อาร์ม", icon: "fa-solid fa-shield-halved" },
    { id: "souvenirs", name: "ของที่ระลึก", icon: "fa-solid fa-gift" },
  ];

  const DEFAULT_PRODUCTS = [
    {
      id: "product-book-001",
      name: "ตำราวิชาการเภสัชศาสตร์ เล่ม 1",
      category: "books",
      categoryName: "หนังสือเรียน",
      price: 420,
      stock: 12,
      badge: "BEST",
      image: "assets/products/book.png",
      desc: "หนังสือเรียนและตำราวิชาการสำหรับนักศึกษาเภสัชศาสตร์ ใช้ประกอบการเรียนและอ้างอิงความรู้ทางวิชาชีพ",
    },
    {
      id: "product-coat-men-001",
      name: "เสื้อกาวน์เภสัชกรชาย",
      category: "coats",
      categoryName: "เสื้อกาวน์",
      price: 850,
      stock: 8,
      badge: "NEW",
      image: "assets/products/gm.png",
      colors: ["ขาว"],
      sizes: ["S", "M", "L", "XL"],
      desc: "เสื้อกาวน์ชาย ปักตราสภาเภสัชกรรม เนื้อผ้าคุณภาพดี เหมาะสำหรับใช้งานในสถานพยาบาลและงานวิชาชีพ",
    },
    {
      id: "product-coat-women-001",
      name: "เสื้อกาวน์เภสัชกรหญิง",
      category: "coats",
      categoryName: "เสื้อกาวน์",
      price: 850,
      stock: 10,
      badge: "NEW",
      image: "assets/products/gf.png",
      colors: ["ขาว"],
      sizes: ["S", "M", "L", "XL"],
      desc: "เสื้อกาวน์หญิง ทรงสุภาพ ปักตราสภาเภสัชกรรม เหมาะสำหรับเภสัชกร นักศึกษา และบุคลากรด้านสุขภาพ",
    },
    {
      id: "product-patch-001",
      name: "อาร์มสภาเภสัชกรรม",
      category: "patches",
      categoryName: "อาร์ม",
      price: 180,
      stock: 25,
      badge: "HOT",
      image: "assets/products/arm.png",
      colors: ["มาตรฐาน"],
      sizes: ["1 ชิ้น", "2 ชิ้น", "5 ชิ้น"],
      desc: "อาร์มปักตราสภาเภสัชกรรม สำหรับติดเสื้อกาวน์ งานปักละเอียด สีคมชัด ใช้งานคู่กับเครื่องแบบวิชาชีพ",
    },
  ];

  const THAI_ADDRESS_DATA = {
    กรุงเทพมหานคร: {
      จตุจักร: {
        ลาดยาว: "10900",
        จันทรเกษม: "10900",
      },
      บางกะปิ: {
        หัวหมาก: "10240",
        คลองจั่น: "10240",
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
      },
      เมืองปทุมธานี: {
        บางปรอก: "12000",
        บางเดื่อ: "12000",
      },
    },
  };

  /* =============================================================
     4) App State
     ============================================================= */
  let currentCategory = "all";
  let currentSearch = "";
  let currentProduct = null;
  let currentQty = 1;
  let selectedColor = "";
  let selectedSize = "";
  let pendingOrder = null;

  /* =============================================================
     5) Utilities
     ============================================================= */
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  function getStore(key, fallback = []) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      console.error("อ่าน localStorage ไม่สำเร็จ", key, error);
      return fallback;
    }
  }

  function setStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("บันทึก localStorage ไม่สำเร็จ", key, error);
      alert("บันทึกข้อมูลไม่สำเร็จ localStorage อาจเต็ม กรุณาลบรูปที่มีขนาดใหญ่หรือข้อมูลเก่าออก");
      return false;
    }
  }

  function createId(prefix = "id") {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return `${prefix}-${window.crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function baht(value) {
    return `฿${Number(value || 0).toLocaleString("th-TH")}`;
  }

  function fmtDate(value) {
    if (!value) return "-";
    return new Date(value).toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function imageSrc(src) {
    if (!src) return "assets/products/book.jpg";
    if (String(src).startsWith("data:image")) return src;
    if (String(src).startsWith("http")) return src;
    return src;
  }

  function statusBadge(status = "กำลังเตรียมสินค้า") {
    return `<span class="status-badge ${ORDER_STATUS_CLASS[status] || "status-preparing"}">${escapeHtml(status)}</span>`;
  }

  function deliveryLabel(type) {
    if (type === "pickup") return "รับด้วยตนเอง";
    if (type === "registered") return "จัดส่งที่อยู่ที่ลงทะเบียนไว้";
    if (type === "custom") return "เลือกที่อยู่เอง";
    return "-";
  }

  function hideElement(el) {
    if (el) el.classList.add("hidden");
  }

  function showElement(el) {
    if (el) el.classList.remove("hidden");
  }

  function toast(message) {
    alert(message);
  }

  /* =============================================================
     6) Initial localStorage
     ถ้า products เป็น [] จากเวอร์ชันเก่า จะเติมสินค้าเริ่มต้นให้ใหม่
     ============================================================= */
  function seedStoreIfNeeded() {
    const categories = getStore(CAT_KEY, []);
    const products = getStore(PRODUCT_KEY, []);

    if (!categories.length) {
      setStore(CAT_KEY, DEFAULT_CATEGORIES);
    }

    if (!products.length) {
      setStore(
        PRODUCT_KEY,
        DEFAULT_PRODUCTS.map((product) => ({
          ...product,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
      );
    }
  }

  function getCategories() {
    return getStore(CAT_KEY, DEFAULT_CATEGORIES);
  }

  function getProducts() {
    return getStore(PRODUCT_KEY, DEFAULT_PRODUCTS);
  }

  function getCart() {
    return getStore(CART_KEY, []);
  }

  function getWishlist() {
    return getStore(WISHLIST_KEY, []);
  }

  function getOrders() {
    return getStore(ORDER_KEY, []);
  }

  /* =============================================================
     7) Category Count
     ตัวเลข "รายการ" คำนวณจากจำนวนสินค้าจริงใน localStorage
     ============================================================= */
  function getCategoryCount(categoryId) {
    const products = getProducts();
    if (categoryId === "all") return products.length;
    return products.filter((product) => product.category === categoryId).length;
  }

  function buildCategories() {
    const storedCategories = getCategories();
    const iconMap = {
      books: "fa-solid fa-book-open",
      coats: "fa-solid fa-shirt",
      patches: "fa-solid fa-shield-halved",
      souvenirs: "fa-solid fa-gift",
    };

    return [
      {
        id: "all",
        name: "ทั้งหมด",
        icon: "fa-solid fa-border-all",
        count: getCategoryCount("all"),
      },
      ...storedCategories.map((cat) => ({
        ...cat,
        icon: cat.icon || iconMap[cat.id] || "fa-solid fa-box",
        count: getCategoryCount(cat.id),
      })),
    ];
  }

  /* =============================================================
     8) Render Categories
     ============================================================= */
  function renderCategories() {
    const catList = $("#catList");
    if (!catList) return;

    const categories = buildCategories();

    catList.innerHTML = categories
      .map(
        (cat) => `
          <button class="cat ${currentCategory === cat.id ? "active" : ""}" type="button" data-category="${escapeHtml(cat.id)}">
            <i class="${escapeHtml(cat.icon)}"></i>
            <div>
              <strong>${escapeHtml(cat.name)}</strong>
              <span>${Number(cat.count || 0)} รายการ</span>
            </div>
          </button>
        `,
      )
      .join("");
  }

  /* =============================================================
     9) Render Products
     ============================================================= */
  function getFilteredProducts() {
    const keyword = currentSearch.trim().toLowerCase();

    return getProducts().filter((product) => {
      const matchCategory = currentCategory === "all" || product.category === currentCategory;
      const searchTarget = `${product.name || ""} ${product.categoryName || ""} ${product.desc || ""}`.toLowerCase();
      const matchSearch = !keyword || searchTarget.includes(keyword);
      return matchCategory && matchSearch;
    });
  }

  function renderProducts() {
    const productGrid = $("#productGrid");
    if (!productGrid) return;

    const products = getFilteredProducts();

    if (!products.length) {
      productGrid.innerHTML = `<div class="order" style="grid-column:1/-1">ไม่พบสินค้า</div>`;
      return;
    }

    productGrid.innerHTML = products
      .map((product) => {
        const isOut = Number(product.stock || 0) <= 0;
        const colors = (product.colors || []).slice(0, 3);
        const sizes = (product.sizes || []).slice(0, 3);

        return `
          <article class="card" data-product-id="${escapeHtml(product.id)}">
            <div class="pic">
              <img src="${escapeHtml(imageSrc(product.image))}" alt="${escapeHtml(product.name)}" data-action="open-product" data-id="${escapeHtml(product.id)}">
              <span class="badge">${isOut ? "OUT" : escapeHtml(product.badge || "NEW")}</span>
              <button class="heart" type="button" data-action="wishlist" data-id="${escapeHtml(product.id)}" aria-label="Wishlist">
                <i class="fa-regular fa-heart"></i>
              </button>
            </div>

            <div class="content">
              <h3>${escapeHtml(product.name)}</h3>
              <p class="desc">${escapeHtml(product.desc || "")}</p>

              <div class="meta">
                ${colors.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join("")}
                ${sizes.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join("")}
              </div>

              <div class="bottom">
                <span class="price">${baht(product.price)}</span>
                <button class="cart" type="button" data-action="quick-cart" data-id="${escapeHtml(product.id)}" ${isOut ? "disabled" : ""} aria-label="เพิ่มลงตะกร้า">
                  <i class="fa-solid fa-cart-shopping"></i>
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  /* =============================================================
     10) Product Modal
     ============================================================= */
  function setOptions(containerId, values, activeValue, onClick) {
    const container = $(containerId);
    if (!container) return;

    const list = values.length ? values : ["มาตรฐาน"];

    container.innerHTML = list
      .map(
        (item) => `
          <button class="option ${item === activeValue ? "active" : ""}" type="button" data-value="${escapeHtml(item)}">
            ${escapeHtml(item)}
          </button>
        `,
      )
      .join("");

    container.addEventListener(
      "click",
      (event) => {
        const button = event.target.closest(".option");
        if (!button) return;
        onClick(button.dataset.value);
        $$(".option", container).forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
      },
      { once: true },
    );
  }

  function openProduct(productId) {
    const product = getProducts().find((item) => item.id === productId);
    if (!product) return;

    currentProduct = product;
    currentQty = 1;
    selectedColor = (product.colors || ["มาตรฐาน"])[0] || "มาตรฐาน";
    selectedSize = (product.sizes || ["มาตรฐาน"])[0] || "มาตรฐาน";

    const modal = $("#productModal");
    if (!modal) return;

    const modalImg = $("#modalImg");
    const modalName = $("#modalName");
    const modalDesc = $("#modalDesc");
    const modalPrice = $("#modalPrice");
    const modalBadge = $("#modalBadge");
    const qty = $("#qty");

    if (modalImg) modalImg.src = imageSrc(product.image);
    if (modalName) modalName.textContent = product.name || "";
    if (modalDesc) modalDesc.textContent = product.desc || "";
    if (modalPrice) modalPrice.textContent = baht(product.price);
    if (modalBadge) modalBadge.textContent = product.badge || "NEW";
    if (qty) qty.textContent = currentQty;

    setOptions("#colorOptions", product.colors || [], selectedColor, (value) => {
      selectedColor = value;
    });

    setOptions("#sizeOptions", product.sizes || [], selectedSize, (value) => {
      selectedSize = value;
    });

    modal.classList.add("show");
  }

  function closeProduct() {
    const modal = $("#productModal");
    if (modal) modal.classList.remove("show");
  }

  /* =============================================================
     11) Wishlist
     ============================================================= */
  function addWishlist(productId) {
    const product = getProducts().find((item) => item.id === productId);
    if (!product) return;

    const wishlist = getWishlist();
    const exists = wishlist.some((item) => item.id === product.id);

    if (!exists) {
      setStore(WISHLIST_KEY, [product, ...wishlist]);
    }

    renderWishlist();
    updateCounts();
  }

  function renderWishlist() {
    const wishlistGrid = $("#wishlistGrid");
    if (!wishlistGrid) return;

    const wishlist = getWishlist();

    wishlistGrid.innerHTML =
      wishlist
        .map(
          (product) => `
            <article class="card">
              <div class="pic">
                <img src="${escapeHtml(imageSrc(product.image))}" alt="${escapeHtml(product.name)}" data-action="open-product" data-id="${escapeHtml(product.id)}">
                <span class="badge">${escapeHtml(product.badge || "NEW")}</span>
              </div>
              <div class="content">
                <h3>${escapeHtml(product.name)}</h3>
                <p class="desc">${escapeHtml(product.desc || "")}</p>
                <div class="bottom">
                  <span class="price">${baht(product.price)}</span>
                  <button class="cart" type="button" data-action="quick-cart" data-id="${escapeHtml(product.id)}">
                    <i class="fa-solid fa-cart-shopping"></i>
                  </button>
                </div>
              </div>
            </article>
          `,
        )
        .join("") || `<div class="order" style="grid-column:1/-1">ยังไม่มีสินค้าใน Wishlist</div>`;
  }

  /* =============================================================
     12) Cart
     ============================================================= */
  function addToCart(product, qty = 1, color = "", size = "") {
    if (!product) return;

    if (Number(product.stock || 0) <= 0) {
      toast("สินค้าหมดชั่วคราว");
      return;
    }

    const cart = getCart();
    const optionColor = color || (product.colors || ["มาตรฐาน"])[0] || "มาตรฐาน";
    const optionSize = size || (product.sizes || ["มาตรฐาน"])[0] || "มาตรฐาน";

    const exists = cart.find(
      (item) => item.id === product.id && item.color === optionColor && item.size === optionSize,
    );

    if (exists) {
      exists.qty += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price || 0),
        image: product.image,
        color: optionColor,
        size: optionSize,
        qty,
      });
    }

    setStore(CART_KEY, cart);
    renderCart();
    updateCounts();
  }

  function removeCartItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    setStore(CART_KEY, cart);
    renderCart();
    updateCounts();
  }

  function cartTotal() {
    return getCart().reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1), 0);
  }

  function renderCart() {
    const cartItems = $("#cartItems");
    const cartTotalEl = $("#cartTotal");
    if (!cartItems) return;

    const cart = getCart();

    cartItems.innerHTML =
      cart
        .map(
          (item, index) => `
            <div class="cart-item">
              <img src="${escapeHtml(imageSrc(item.image))}" alt="${escapeHtml(item.name)}">
              <div>
                <b>${escapeHtml(item.name)}</b><br>
                <small>${escapeHtml(item.color || "-")} / ${escapeHtml(item.size || "-")} / จำนวน ${Number(item.qty || 1)}</small><br>
                <strong>${baht(Number(item.price || 0) * Number(item.qty || 1))}</strong>
              </div>
              <button type="button" data-action="remove-cart" data-index="${index}">ลบ</button>
            </div>
          `,
        )
        .join("") || `<p class="hint">ยังไม่มีสินค้าในตะกร้า</p>`;

    if (cartTotalEl) cartTotalEl.textContent = baht(cartTotal());
  }

  function openCart() {
    const drawer = $("#cartDrawer");
    if (drawer) drawer.classList.add("show");
    renderCart();
  }

  function closeCart() {
    const drawer = $("#cartDrawer");
    if (drawer) drawer.classList.remove("show");
  }

  /* =============================================================
     13) Checkout + Delivery
     ============================================================= */
  function getDeliveryFee(type) {
    return type === "pickup" ? 0 : 60;
  }

  function selectedDeliveryType() {
    const checked = $("input[name='deliveryType']:checked");
    return checked ? checked.value : "pickup";
  }

  function registeredAddress() {
    return "ภก. สมชาย รักษาดี, 081-234-5678, 99/15 หมู่ 3 ถนนงามวงศ์วาน แขวงลาดยาว เขตจตุจักร กรุงเทพมหานคร 10900";
  }

  function pickupAddress() {
    return "สำนักงานเลขาธิการสภาเภสัชกรรม อาคารมหิตลาธิเบศร ชั้น 8 กระทรวงสาธารณสุข เลขที่ 88/19 หมู่ 4 ถนนติวานนท์ ตำบลตลาดขวัญ อำเภอเมือง จังหวัดนนทบุรี 11000";
  }

  function customAddress() {
    const name = $("#shipName")?.value.trim() || $("#customerName")?.value.trim() || "-";
    const phone = $("#shipPhone")?.value.trim() || $("#customerPhone")?.value.trim() || "-";
    const house = $("#shipHouse")?.value.trim() || "";
    const moo = $("#shipMoo")?.value.trim() ? `หมู่ ${$("#shipMoo").value.trim()}` : "";
    const road = $("#shipRoad")?.value.trim() ? `ถนน${$("#shipRoad").value.trim()}` : "";
    const province = $("#shipProvince")?.value || "";
    const district = $("#shipDistrict")?.value || "";
    const subdistrict = $("#shipSubdistrict")?.value || "";
    const zip = $("#shipZip")?.value || "";

    return [name, phone, house, moo, road, subdistrict, district, province, zip].filter(Boolean).join(" ");
  }

  function getDeliveryInfo() {
    const type = selectedDeliveryType();

    if (type === "pickup") {
      return {
        type,
        label: deliveryLabel(type),
        fee: 0,
        address: pickupAddress(),
      };
    }

    if (type === "registered") {
      return {
        type,
        label: deliveryLabel(type),
        fee: 60,
        address: registeredAddress(),
      };
    }

    return {
      type,
      label: deliveryLabel(type),
      fee: 60,
      address: customAddress(),
    };
  }

  function renderCheckoutSummary() {
    const itemsEl = $("#checkoutSummaryItems");
    const subtotalEl = $("#checkoutSubtotal");
    const shippingEl = $("#checkoutShipping");
    const grandEl = $("#checkoutGrandTotal");
    if (!itemsEl) return;

    const cart = getCart();
    const delivery = getDeliveryInfo();
    const subtotal = cartTotal();
    const grandTotal = subtotal + delivery.fee;

    itemsEl.innerHTML =
      cart
        .map(
          (item) => `
            <div class="summary-product">
              <span>${escapeHtml(item.name)}<small>${escapeHtml(item.color || "-")} / ${escapeHtml(item.size || "-")} x ${Number(item.qty || 1)}</small></span>
              <b>${baht(Number(item.price || 0) * Number(item.qty || 1))}</b>
            </div>
          `,
        )
        .join("") || `<p class="hint">ยังไม่มีสินค้า</p>`;

    if (subtotalEl) subtotalEl.textContent = baht(subtotal);
    if (shippingEl) shippingEl.textContent = delivery.fee ? baht(delivery.fee) : "ฟรี";
    if (grandEl) grandEl.textContent = baht(grandTotal);
  }

  function showCheckout() {
    if (!getCart().length) {
      toast("กรุณาเพิ่มสินค้าลงตะกร้าก่อน");
      return;
    }

    showTab("checkout");
    closeCart();
    renderCheckoutSummary();
    $("#checkout")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function buildOrder(paymentStatus = "รอชำระเงิน") {
    const cart = getCart();
    const delivery = getDeliveryInfo();
    const subtotal = cartTotal();
    const total = subtotal + delivery.fee;
    const customerName = $("#customerName")?.value.trim() || "-";
    const customerPhone = $("#customerPhone")?.value.trim() || "-";
    const customerEmail = $("#customerEmail")?.value.trim() || "-";

    return {
      id: createId("PCOT").replace("PCOT-", `PCOT-${new Date().getFullYear()}-`),
      createdAt: new Date().toISOString(),
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        note: "",
      },
      items: cart.map((item) => ({ ...item })),
      delivery,
      subtotal,
      shippingFee: delivery.fee,
      total,
      payment: $("#payment")?.value || "โอนเงิน / QR Payment",
      paymentStatus,
      status: paymentStatus === "ชำระเงินเรียบร้อย" ? "กำลังเตรียมสินค้า" : "รอชำระเงิน",
      tracking: "",
    };
  }

  function saveOrder(order) {
    const orders = getOrders();
    setStore(ORDER_KEY, [order, ...orders]);
    setStore(CART_KEY, []);
    pendingOrder = null;
    renderCart();
    renderOrders();
    updateCounts();
  }

  function openQrModal(order) {
    const modal = $("#qrPaymentModal");
    if (!modal) return false;

    pendingOrder = order;

    const qrOrderId = $("#qrOrderId");
    const qrTotal = $("#qrTotal");
    const qrCustomer = $("#qrCustomer");
    const qrDelivery = $("#qrDelivery");

    if (qrOrderId) qrOrderId.textContent = order.id;
    if (qrTotal) qrTotal.textContent = baht(order.total);
    if (qrCustomer) qrCustomer.textContent = order.customer.name;
    if (qrDelivery) qrDelivery.textContent = order.delivery.label;

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    return true;
  }

  function closeQrModal() {
    const modal = $("#qrPaymentModal");
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  function handleCheckoutSubmit(event) {
    event.preventDefault();

    if (!getCart().length) {
      toast("ไม่มีสินค้าในตะกร้า");
      return;
    }

    const payment = $("#payment")?.value || "";
    const isQr = payment.includes("QR") || payment.includes("โอนเงิน");
    const order = buildOrder(isQr ? "รอชำระเงิน" : "รอชำระเงิน");

    if (isQr) {
      const opened = openQrModal(order);
      if (!opened) {
        saveOrder({ ...order, paymentStatus: "ชำระเงินเรียบร้อย", status: "กำลังเตรียมสินค้า" });
        toast("ชำระเงินเรียบร้อย");
        showTab("orders");
      }
      return;
    }

    saveOrder(order);
    toast("สร้างคำสั่งซื้อเรียบร้อยแล้ว");
    showTab("orders");
  }

  /* =============================================================
     14) Address Select
     ============================================================= */
  function fillSelect(select, values, placeholder) {
    if (!select) return;
    select.innerHTML = [`<option value="">${placeholder}</option>`, ...values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)].join("");
  }

  function initAddressSelects() {
    const province = $("#shipProvince");
    const district = $("#shipDistrict");
    const subdistrict = $("#shipSubdistrict");
    const zip = $("#shipZip");
    if (!province || !district || !subdistrict || !zip) return;

    fillSelect(province, Object.keys(THAI_ADDRESS_DATA), "เลือกจังหวัด");
    fillSelect(district, [], "เลือกอำเภอ / เขต");
    fillSelect(subdistrict, [], "เลือกตำบล / แขวง");

    province.addEventListener("change", () => {
      const districts = Object.keys(THAI_ADDRESS_DATA[province.value] || {});
      fillSelect(district, districts, "เลือกอำเภอ / เขต");
      fillSelect(subdistrict, [], "เลือกตำบล / แขวง");
      zip.value = "";
    });

    district.addEventListener("change", () => {
      const subs = Object.keys(THAI_ADDRESS_DATA[province.value]?.[district.value] || {});
      fillSelect(subdistrict, subs, "เลือกตำบล / แขวง");
      zip.value = "";
    });

    subdistrict.addEventListener("change", () => {
      zip.value = THAI_ADDRESS_DATA[province.value]?.[district.value]?.[subdistrict.value] || "";
    });
  }

  function updateDeliveryUI() {
    const type = selectedDeliveryType();

    $$(".delivery-option").forEach((item) => {
      const input = $("input[type='radio']", item);
      item.classList.toggle("active", input && input.value === type);
    });

    hideElement($("#pickupDetail"));
    hideElement($("#registeredDetail"));
    hideElement($("#customDetail"));

    if (type === "pickup") showElement($("#pickupDetail"));
    if (type === "registered") showElement($("#registeredDetail"));
    if (type === "custom") showElement($("#customDetail"));

    renderCheckoutSummary();
  }

  /* =============================================================
     15) My Orders
     ============================================================= */
  function renderOrders() {
    const ordersEl = $("#myOrders");
    if (!ordersEl) return;

    const orders = getOrders();

    ordersEl.innerHTML =
      orders
        .map((order) => {
          const steps = ORDER_STATUS_FLOW.filter((status) => {
            if (order.delivery?.type === "pickup") return status !== "กำลังจัดส่ง";
            return status !== "พร้อมรับสินค้า";
          });
          const currentIndex = steps.indexOf(order.status);

          return `
            <article class="order">
              <div class="order-grid">
                <div>
                  <h3>${escapeHtml(order.id)}</h3>
                  <p class="hint">${fmtDate(order.createdAt)}</p>
                  ${statusBadge(order.status)}
                  <p class="payment-line"><b>การชำระเงิน:</b> ${escapeHtml(order.paymentStatus || "รอชำระเงิน")}</p>
                  ${order.tracking ? `<p class="tracking-no"><b>Tracking:</b> ${escapeHtml(order.tracking)}</p>` : ""}
                  ${order.customer?.note ? `<p class="order-note">หมายเหตุ: ${escapeHtml(order.customer.note)}</p>` : ""}

                  <div class="timeline">
                    ${steps
                      .map(
                        (step, index) => `<span class="step ${index <= currentIndex ? "done" : ""}">${escapeHtml(step)}</span>`,
                      )
                      .join("")}
                  </div>
                </div>

                <div>
                  <b>${escapeHtml(order.delivery?.label || deliveryLabel(order.delivery?.type))}</b>
                  <p class="hint">${escapeHtml(order.delivery?.address || "-")}</p>
                  <p><b>ยอดรวม:</b> ${baht(order.total)}</p>
                </div>
              </div>
            </article>
          `;
        })
        .join("") || `<div class="order">ยังไม่มีออเดอร์</div>`;
  }

  /* =============================================================
     16) Tabs / Page State
     ============================================================= */
  function showTab(tab) {
    const categorySection = $("#categorySection");
    const productsSection = $("#products");
    const wishlistPanel = $("#wishlistPanel");
    const myOrdersPanel = $("#myOrdersPanel");
    const checkout = $("#checkout");
    const searchCard = $(".search-card");

    hideElement(wishlistPanel);
    hideElement(myOrdersPanel);
    hideElement(checkout);

    if (tab === "all") {
      showElement(searchCard);
      showElement(categorySection);
      showElement(productsSection);
    }

    if (tab === "wishlist") {
      hideElement(searchCard);
      hideElement(categorySection);
      hideElement(productsSection);
      showElement(wishlistPanel);
      renderWishlist();
    }

    if (tab === "orders") {
      hideElement(searchCard);
      hideElement(categorySection);
      hideElement(productsSection);
      showElement(myOrdersPanel);
      renderOrders();
    }

    if (tab === "checkout") {
      hideElement(searchCard);
      hideElement(categorySection);
      hideElement(productsSection);
      showElement(checkout);
      renderCheckoutSummary();
    }

    if (tab === "cart") {
      openCart();
      tab = "all";
    }

    $$("[data-store-tab]").forEach((button) => {
      button.classList.toggle("active", button.dataset.storeTab === tab);
    });
  }

  /* =============================================================
     17) Counts
     ============================================================= */
  function updateCounts() {
    const cartCount = getCart().reduce((sum, item) => sum + Number(item.qty || 1), 0);
    const wishlistCount = getWishlist().length;

    ["#cartCount", "#cartTabCount"].forEach((selector) => {
      const el = $(selector);
      if (el) el.textContent = cartCount;
    });

    const wishlistEl = $("#wishlistCount");
    if (wishlistEl) wishlistEl.textContent = wishlistCount;
  }

  /* =============================================================
     18) Event Binding
     ============================================================= */
  function bindEvents() {
    document.addEventListener("click", (event) => {
      const tabButton = event.target.closest("[data-store-tab]");
      if (tabButton) {
        showTab(tabButton.dataset.storeTab);
        return;
      }

      const categoryButton = event.target.closest("[data-category]");
      if (categoryButton) {
        currentCategory = categoryButton.dataset.category;
        renderCategories();
        renderProducts();
        return;
      }

      const actionButton = event.target.closest("[data-action]");
      if (actionButton) {
        const action = actionButton.dataset.action;
        const id = actionButton.dataset.id;

        if (action === "open-product") openProduct(id);
        if (action === "wishlist") addWishlist(id);
        if (action === "quick-cart") {
          const product = getProducts().find((item) => item.id === id);
          addToCart(product);
        }
        if (action === "remove-cart") removeCartItem(Number(actionButton.dataset.index));
      }

      if (event.target.closest("[data-close]")) {
        closeProduct();
      }

      if (event.target.closest("[data-close-qr]")) {
        closeQrModal();
      }
    });

    const searchInput = $("#searchInput");
    const searchBtn = $("#searchBtn");
    const showAll = $("#showAll");

    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        currentSearch = searchInput ? searchInput.value : "";
        renderProducts();
      });
    }

    if (searchInput) {
      searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          currentSearch = searchInput.value;
          renderProducts();
        }
      });
    }

    if (showAll) {
      showAll.addEventListener("click", () => {
        currentCategory = "all";
        currentSearch = "";
        if (searchInput) searchInput.value = "";
        renderCategories();
        renderProducts();
      });
    }

    const openCartBtn = $("#openCart");
    const closeCartBtn = $("#closeCart");
    const goCheckoutBtn = $("#goCheckout");
    const checkoutForm = $("#checkoutForm");
    const confirmQrPayment = $("#confirmQrPayment");
    const minus = $("#minus");
    const plus = $("#plus");
    const addCartModal = $("#addCartModal");
    const wishModal = $("#wishModal");

    if (openCartBtn) openCartBtn.addEventListener("click", openCart);
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
    if (goCheckoutBtn) goCheckoutBtn.addEventListener("click", showCheckout);
    if (checkoutForm) checkoutForm.addEventListener("submit", handleCheckoutSubmit);

    if (confirmQrPayment) {
      confirmQrPayment.addEventListener("click", () => {
        if (!pendingOrder) return;
        const paidOrder = {
          ...pendingOrder,
          paymentStatus: "ชำระเงินเรียบร้อย",
          status: "กำลังเตรียมสินค้า",
        };
        saveOrder(paidOrder);
        closeQrModal();
        toast("ชำระเงินเรียบร้อย");
        showTab("orders");
      });
    }

    if (minus) {
      minus.addEventListener("click", () => {
        if (currentQty > 1) currentQty -= 1;
        const qty = $("#qty");
        if (qty) qty.textContent = currentQty;
      });
    }

    if (plus) {
      plus.addEventListener("click", () => {
        currentQty += 1;
        const qty = $("#qty");
        if (qty) qty.textContent = currentQty;
      });
    }

    if (addCartModal) {
      addCartModal.addEventListener("click", () => {
        addToCart(currentProduct, currentQty, selectedColor, selectedSize);
        closeProduct();
      });
    }

    if (wishModal) {
      wishModal.addEventListener("click", () => {
        if (currentProduct) addWishlist(currentProduct.id);
      });
    }

    $$("input[name='deliveryType']").forEach((input) => {
      input.addEventListener("change", updateDeliveryUI);
    });

    ["#shipName", "#shipPhone", "#shipHouse", "#shipMoo", "#shipRoad", "#shipProvince", "#shipDistrict", "#shipSubdistrict"].forEach(
      (selector) => {
        const el = $(selector);
        if (el) el.addEventListener("input", renderCheckoutSummary);
        if (el) el.addEventListener("change", renderCheckoutSummary);
      },
    );
  }

  /* =============================================================
     19) Init
     ============================================================= */
  document.addEventListener("DOMContentLoaded", () => {
    seedStoreIfNeeded();
    initAddressSelects();
    renderCategories();
    renderProducts();
    renderWishlist();
    renderCart();
    renderOrders();
    updateCounts();
    updateDeliveryUI();
    bindEvents();
  });
})();
