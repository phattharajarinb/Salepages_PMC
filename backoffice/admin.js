// =============================================================
// Backoffice Shared Script
// -------------------------------------------------------------
// ใช้ร่วมกันทุกหน้าใน backoffice
// ข้อมูลทั้งหมดเก็บใน localStorage เพื่อทดลองใช้งานแบบ Static Website
// ถ้าทำระบบจริง ควรเปลี่ยนเป็น API + Database
// =============================================================

// ---------- localStorage keys: ต้องตรงกับหน้าร้าน js/app.js ----------
const PRODUCT_KEY = "pcot_products_v2";
const ORDER_KEY = "pcot_orders_v2";
const CAT_KEY = "pcot_categories_v2";

// ---------- Helper: selector ----------
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

// ---------- Helper: localStorage ----------
function getStore(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (error) {
    console.error(`อ่าน localStorage ไม่ได้: ${key}`, error);
    return fallback;
  }
}

function setStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`บันทึก localStorage ไม่ได้: ${key}`, error);
    alert("บันทึกข้อมูลไม่สำเร็จ อาจเกิดจากรูปภาพมีขนาดใหญ่เกินไป กรุณาลองเลือกรูปที่เล็กลง");
    return false;
  }
}

// ---------- Helper: format ----------
function baht(number) {
  return `฿${Number(number || 0).toLocaleString("th-TH")}`;
}

function fmtDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleString("th-TH");
}

// ---------- Helper: ป้องกัน HTML แทรกตอน render string ----------
function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ---------- Helper: สร้าง id โดยไม่พึ่ง crypto.randomUUID อย่างเดียว ----------
function createId(prefix = "id") {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// ---------- Helper: อ่านรูปภาพเป็น Base64 แบบบีบอัด ----------
// ใช้ Canvas ลดขนาดภาพก่อนเก็บลง localStorage เพื่อป้องกันบันทึกไม่สำเร็จเพราะรูปใหญ่เกินไป
function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      reject(new Error("ไฟล์ที่เลือกไม่ใช่รูปภาพ"));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const maxSize = 900;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, width, height);

        // JPEG คุณภาพ 0.82 เพียงพอสำหรับแสดงสินค้า และประหยัดพื้นที่ localStorage
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };

      image.onerror = () => reject(new Error("อ่านรูปภาพไม่สำเร็จ"));
      image.src = reader.result;
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// ---------- Helper: path รูปภาพสำหรับหน้า Backoffice ----------
// ข้อมูลสินค้าใน localStorage เก็บ path แบบหน้าร้าน เช่น assets/products/book.jpg
// แต่ Backoffice อยู่ในโฟลเดอร์ backoffice จึงต้องเติม ../ ตอนแสดงรูป
function adminImageSrc(imagePath = "") {
  if (!imagePath) return "../assets/products/book.jpg";
  if (imagePath.startsWith("data:")) return imagePath;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  if (imagePath.startsWith("../")) return imagePath;
  if (imagePath.startsWith("assets/")) return `../${imagePath}`;
  return imagePath;
}

// ---------- ข้อมูลหมวดหมู่ตั้งต้น ----------
const defaultCats = [
  { id: "books", name: "หนังสือเรียน" },
  { id: "coats", name: "เสื้อกาวน์" },
  { id: "patches", name: "อาร์ม" },
  { id: "souvenirs", name: "ของที่ระลึก" },
];

// ---------- สินค้าตั้งต้น: ใช้กรณีเปิด Backoffice ก่อนหน้าร้าน ----------
const defaultProducts = [
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
    colors: ["เขียว"],
    sizes: ["เล่ม 1", "เล่ม 2", "ชุดรวม"],
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
    badge: "HOT",
    image: "assets/products/patch.jpg",
    desc: "อาร์มปักตราสภาเภสัชกรรม สำหรับติดเสื้อกาวน์ งานปักละเอียด สีคมชัด",
    colors: ["เขียว"],
    sizes: ["1 ชิ้น", "2 ชิ้น", "5 ชิ้น"],
    createdAt: new Date().toISOString(),
  },
];

// ---------- Seed ข้อมูลครั้งแรก ----------
if (!localStorage.getItem(CAT_KEY)) setStore(CAT_KEY, defaultCats);
if (!getStore(PRODUCT_KEY, []).length) setStore(PRODUCT_KEY, defaultProducts);
if (!localStorage.getItem(ORDER_KEY)) setStore(ORDER_KEY, []);

// ---------- Shell Layout ของ Backoffice ----------
function shell(title) {
  return `
    <aside class="side">
      <div class="brand">
        <!-- เปลี่ยนโลโก้ Backoffice ได้ที่ src ด้านล่าง -->
        <img src="../assets/Logo.png" alt="สภาเภสัชกรรม">
        <div>
          <strong>Backoffice</strong>
          <small>Pharmacy Store Admin</small>
        </div>
      </div>

      <nav class="menu">
        <a href="dashboard.html"><i class="fa-solid fa-chart-line"></i> Dashboard</a>
        <a href="products.html"><i class="fa-solid fa-box"></i> จัดการสินค้า</a>
        <a href="categories.html"><i class="fa-solid fa-layer-group"></i> หมวดหมู่สินค้า</a>
        <a href="options.html"><i class="fa-solid fa-sliders"></i> Size / Color</a>
        <a href="orders.html"><i class="fa-solid fa-file-invoice"></i> คำสั่งซื้อ</a>
        <a href="shipping.html"><i class="fa-solid fa-truck-fast"></i> สถานะจัดส่ง</a>
        <a href="customers.html"><i class="fa-solid fa-users"></i> ลูกค้า</a>
        <a href="../index.html"><i class="fa-solid fa-house"></i> กลับหน้าร้าน</a>
      </nav>
    </aside>

    <main class="main">
      <div class="topbar">
        <h1>${escapeHtml(title)}</h1>
        <button class="btn light" type="button" data-open-store>เปิดหน้าร้าน</button>
      </div>

      <div id="app"></div>
    </main>
  `;
}

// ---------- เริ่ม Layout แต่ละหน้าอย่างปลอดภัย ไม่ใช้ global id ----------
function initAdminPage(title) {
  const rootEl = document.getElementById("root");
  if (!rootEl) return null;

  rootEl.innerHTML = shell(title);
  navActive();

  const openStoreBtn = rootEl.querySelector("[data-open-store]");
  if (openStoreBtn) {
    openStoreBtn.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
  }

  return document.getElementById("app");
}

// ---------- Active menu ----------
function navActive() {
  const path = location.pathname.split("/").pop() || "dashboard.html";
  $$(".menu a").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === path);
  });
}

// ---------- Status badge ----------
function statusBadge(status = "กำลังเตรียมสินค้า") {
  const classMap = {
    "รอชำระเงิน": "status-pending",
    "กำลังเตรียมสินค้า": "status-preparing",
    "พร้อมรับสินค้า": "status-ready-pickup", // สำหรับรับด้วยตนเอง
    "กำลังจัดส่ง": "status-shipping",
    "จัดส่งสำเร็จ": "status-completed",
    "ยกเลิก": "status-cancelled",
  };

  return `
    <span class="status-badge ${classMap[status] || "status-preparing"}">
      ${escapeHtml(status)}
    </span>
  `;
}
