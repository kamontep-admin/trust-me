
const products = [
    {
        id: 1,
        name: "หูฟังไร้สาย",
        category: "อุปกรณ์ไอที",
        price: 599,
        score: 92,
        emoji: "🎧",
        color: "#eee9ff",
        desc: "หูฟังไร้สายสำหรับฟังเพลงและใช้งานทั่วไป",
        features: ["เชื่อมต่อ Bluetooth", "พกพาสะดวก", "เหมาะกับฟังเพลง"]
    },
    {
        id: 2,
        name: "เมาส์ไร้สาย",
        category: "อุปกรณ์ไอที",
        price: 299,
        score: 88,
        emoji: "🖱️",
        color: "#e7f7f0",
        desc: "เมาส์ไร้สายขนาดกะทัดรัด ใช้งานง่าย",
        features: ["เชื่อมต่อไร้สาย", "ขนาดกะทัดรัด", "เหมาะกับคอมพิวเตอร์"]
    },
    {
        id: 3,
        name: "คีย์บอร์ด Mechanical",
        category: "อุปกรณ์ไอที",
        price: 890,
        score: 85,
        emoji: "⌨️",
        color: "#fff0f5",
        desc: "คีย์บอร์ดสำหรับพิมพ์งานและเล่นเกม",
        features: ["ปุ่มกด Mechanical", "ดีไซน์ทันสมัย", "เหมาะกับเล่นเกม"]
    },
    {
        id: 4,
        name: "กระบอกน้ำ",
        category: "ไลฟ์สไตล์",
        price: 199,
        score: 90,
        emoji: "🥤",
        color: "#e8f5ff",
        desc: "กระบอกน้ำพกพาสำหรับใช้ในชีวิตประจำวัน",
        features: ["พกพาสะดวก", "ใช้ได้ทุกวัน", "เหมาะกับไปเรียน"]
    },
    {
        id: 5,
        name: "กระเป๋าสะพาย",
        category: "ไลฟ์สไตล์",
        price: 490,
        score: 83,
        emoji: "🎒",
        color: "#fff5df",
        desc: "กระเป๋าสะพายสำหรับพกพาสิ่งของจำเป็น",
        features: ["พื้นที่จัดเก็บของ", "ใช้งานได้หลายโอกาส", "ดีไซน์เรียบง่าย"]
    },
    {
        id: 6,
        name: "โคมไฟตั้งโต๊ะ",
        category: "ไลฟ์สไตล์",
        price: 350,
        score: 87,
        emoji: "💡",
        color: "#fcecff",
        desc: "โคมไฟตั้งโต๊ะสำหรับอ่านหนังสือหรือทำงาน",
        features: ["เหมาะกับอ่านหนังสือ", "วางบนโต๊ะได้", "ใช้ในห้องนอน"]
    }
];

let selectedCategory = "ทั้งหมด";
let compareIds = [];

function money(price) {
    return "฿" + price.toLocaleString("th-TH");
}

// แสดงสินค้า
function productCard(product) {
    return `
        <article class="product-card">
            <div class="product-visual"
                 style="background:${product.color}">
                <span class="product-emoji">${product.emoji}</span>
            </div>

            <div class="product-info">
                <small>${product.category}</small>
                <h3>${product.name}</h3>

                <div class="product-bottom">
                    <strong class="price">${money(product.price)}</strong>
                    <span class="score-pill">
                        ✦ ${product.score}% คุ้มค่า
                    </span>
                </div>

                <div class="product-actions">
                    <button onclick="showProduct(${product.id})">
                        ดูรายละเอียด
                    </button>

                    <button onclick="toggleCompare(${product.id})">
                        + เปรียบเทียบ
                    </button>
                </div>
            </div>
        </article>
    `;
}

function renderProducts(elementId, list) {
    const element = document.getElementById(elementId);

    if (!element) return;

    element.innerHTML = list.length
        ? list.map(productCard).join("")
        : `<div class="empty">ไม่พบสินค้าที่ค้นหา</div>`;
}

// ค้นหาจากหน้าแรก
function searchHome(event) {
    event.preventDefault();

    const keyword = document.getElementById("homeSearch").value;

    location.href = "evaluate.html?q=" + encodeURIComponent(keyword);
}

// แสดงรายละเอียดสินค้า
function showProduct(id) {
    const product = products.find(p => p.id === id);

    if (!product) return;

    const modal = document.getElementById("productModal");
    if (!modal) return;

    document.getElementById("productModalContent").innerHTML = `
        <div class="detail-emoji"
             style="font-size:60px;text-align:center;
             background:${product.color};padding:20px;
             border-radius:15px">
            ${product.emoji}
        </div>

        <span class="tag">${product.category}</span>

        <h2>${product.name}</h2>

        <h2 style="color:#239c79">
            ${product.score}% คะแนนตัวอย่าง
        </h2>

        <h3>${money(product.price)}</h3>

        <p>${product.desc}</p>

        <b>คุณสมบัติ</b>

        <ul>
            ${product.features.map(item => `<li>${item}</li>`).join("")}
        </ul>

        <button class="btn btn-primary"
                onclick="toggleCompare(${product.id});
                closeModal('productModal')">
            + เพิ่มเพื่อเปรียบเทียบ
        </button>
    `;

    modal.classList.add("open");
}

// ปิดหน้าต่างรายละเอียด
function closeModal(id) {
    document.getElementById(id)?.classList.remove("open");
}

// เลือกสินค้าเปรียบเทียบ
function toggleCompare(id) {
    if (compareIds.includes(id)) {
        compareIds = compareIds.filter(item => item !== id);
    } else {
        if (compareIds.length >= 3) {
            alert("เปรียบเทียบได้สูงสุด 3 รายการ");
            return;
        }

        compareIds.push(id);
    }

    updateCompare();
}

function updateCompare() {
    const pills = document.getElementById("comparePills");
    const count = document.getElementById("compareCount");
    const button = document.getElementById("compareNow");

    if (!pills) return;

    pills.innerHTML = compareIds.map(id => {
        const product = products.find(p => p.id === id);

        return `
            <span class="compare-pill">
                ${product.emoji} ${product.name}
            </span>
        `;
    }).join("");

    count.textContent = compareIds.length
        ? `เลือกแล้ว ${compareIds.length} รายการ`
        : "เลือกสินค้าอย่างน้อย 2 รายการ";

    button.disabled = compareIds.length < 2;
}

// เปรียบเทียบสินค้า
function compareNow() {
    const items = compareIds.map(id =>
        products.find(p => p.id === id)
    );

    if (items.length < 2) return;

    document.getElementById("compareModalContent").innerHTML = `
        <span class="tag">PRODUCT COMPARISON</span>
        <h2>เปรียบเทียบสินค้า</h2>

        <table class="compare-table">
            <tr>
                <th>รายการ</th>
                ${items.map(p => `<th>${p.emoji}<br>${p.name}</th>`).join("")}
            </tr>

            <tr>
                <td>ราคา</td>
                ${items.map(p => `<td>${money(p.price)}</td>`).join("")}
            </tr>

            <tr>
                <td>คะแนนคุ้มค่า</td>
                ${items.map(p => `<td><b style="color:#219b77">${p.score}%</b></td>`).join("")}
            </tr>

            <tr>
                <td>หมวดหมู่</td>
                ${items.map(p => `<td>${p.category}</td>`).join("")}
            </tr>
        </table>

        <p>คะแนนเป็นข้อมูลจำลองสำหรับการสาธิตโครงงาน</p>
    `;

    document.getElementById("compareModal").classList.add("open");
}

// กรองและเรียงสินค้า
function filterCatalog() {
    const search = document.getElementById("evaluateSearch");

    if (!search) return;

    const keyword = search.value.toLowerCase();
    const sort = document.getElementById("sortSelect").value;

    let result = products.filter(product => {
        const matchName = product.name.toLowerCase().includes(keyword);

        const matchCategory =
            selectedCategory === "ทั้งหมด" ||
            product.category === selectedCategory;

        return matchName && matchCategory;
    });

    if (sort === "price-low") {
        result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
        result.sort((a, b) => b.price - a.price);
    }

    if (sort === "score") {
        result.sort((a, b) => b.score - a.score);
    }

    renderProducts("evaluateProducts", result);

    const count = document.getElementById("resultCount");

    if (count) {
        count.textContent = `พบสินค้า ${result.length} รายการ`;
    }
}

// ออกจากระบบ
function logout() {
    localStorage.removeItem("trustMeCurrentUser");
    location.href = "index.html";
}

// เริ่มทำงานเมื่อเปิดหน้าเว็บ
document.addEventListener("DOMContentLoaded", () => {

    // หน้าแรก
    renderProducts("homeProducts", products.slice(0, 3));

    // Dashboard
    const dashboardProducts =
        document.getElementById("dashboardProducts");

    if (dashboardProducts) {
        dashboardProducts.innerHTML = products.slice(0, 3).map(p => `
            <div class="mini-product">
                <span class="mini-emoji">${p.emoji}</span>

                <div>
                    <b>${p.name}</b>
                    <small>คะแนนความคุ้มค่า ${p.score}%</small>
                </div>

                <strong>${money(p.price)}</strong>
            </div>
        `).join("");
    }

    // แสดงชื่อผู้ใช้งาน
    const currentUser = JSON.parse(
        localStorage.getItem("trustMeCurrentUser") || "null"
    );

    if (currentUser) {
        const userName = document.getElementById("userName");
        const welcomeName = document.getElementById("welcomeName");

        if (userName) userName.textContent = currentUser.name;
        if (welcomeName) welcomeName.textContent = currentUser.name;
    }

    // ระบบสมัครสมาชิก
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", event => {
            event.preventDefault();

            const name = document.getElementById("registerName").value.trim();
            const email = document.getElementById("registerEmail").value.trim().toLowerCase();
            const password = document.getElementById("registerPassword").value;
            const confirm = document.getElementById("confirmPassword").value;

            if (password !== confirm) {
                alert("รหัสผ่านไม่ตรงกัน");
                return;
            }

            if (password.length < 6) {
                alert("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
                return;
            }

            localStorage.setItem("trustMeUser", JSON.stringify({
                name,
                email,
                password
            }));

            alert("สมัครสมาชิกสำเร็จ!");

            location.href = "login.html";
        });
    }

    // ระบบเข้าสู่ระบบ
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", event => {
            event.preventDefault();

            const email = document.getElementById("loginEmail")
                .value.trim().toLowerCase();

            const password = document.getElementById("loginPassword").value;

            const user = JSON.parse(
                localStorage.getItem("trustMeUser") || "null"
            );

            if (user && user.email === email && user.password === password) {
                localStorage.setItem("trustMeCurrentUser", JSON.stringify({
                    name: user.name,
                    email: user.email
                }));

                location.href = "dashboard.html";
            } else {
                alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
            }
        });
    }

    // หน้าค้นหาสินค้า
    if (document.getElementById("evaluateProducts")) {

        const params = new URLSearchParams(location.search);
        const category = params.get("category");
        const keyword = params.get("q");

        if (category === "อุปกรณ์ไอที" || category === "ไลฟ์สไตล์") {
            selectedCategory = category;
        }

        if (keyword) {
            document.getElementById("evaluateSearch").value = keyword;
        }

        document.querySelectorAll(".filter").forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.category === selectedCategory
            );

            button.addEventListener("click", () => {
                selectedCategory = button.dataset.category;

                document.querySelectorAll(".filter").forEach(item => {
                    item.classList.toggle("active", item === button);
                });

                filterCatalog();
            });
        });

        document.getElementById("evaluateSearch")
            .addEventListener("input", filterCatalog);

        document.getElementById("sortSelect")
            .addEventListener("change", filterCatalog);

        document.getElementById("searchButton")
            .addEventListener("click", filterCatalog);

        document.getElementById("compareNow")
            .addEventListener("click", compareNow);

        document.querySelectorAll("[data-close]").forEach(button => {
            button.addEventListener("click", () => {
                closeModal(button.dataset.close);
            });
        });

        document.querySelectorAll(".modal-backdrop").forEach(modal => {
            modal.addEventListener("click", event => {
                if (event.target === modal) {
                    modal.classList.remove("open");
                }
            });
        });

        filterCatalog();
    }
});