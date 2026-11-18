// ==========================================
// 1. ตั้งค่าการเชื่อมต่อฐานข้อมูล Supabase
// ==========================================
const SUPABASE_URL = 'ใส่_PROJECT_URL_ของคุณที่นี่';
const SUPABASE_KEY = 'ใส่_ANON_PUBLIC_KEY_ของคุณที่นี่';

const hasSupabaseConfig = typeof supabase !== 'undefined'
    && SUPABASE_URL.startsWith('https://')
    && SUPABASE_KEY.length > 20
    && !SUPABASE_URL.includes('ใส่_')
    && !SUPABASE_KEY.includes('ใส่_');
const supabaseClient = hasSupabaseConfig
    ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

// ==========================================
// 2. ข้อมูลสินค้าเริ่มต้น
// ==========================================
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

function readStoredPrefs() {
    try {
        const value = JSON.parse(localStorage.getItem("trustMePrefs") || "[]");
        return Array.isArray(value) ? value : [];
    } catch (error) {
        return [];
    }
}

// ==========================================
// 3. ระบบเลือกสไตล์ความสนใจและงบประมาณ (สไตล์ Netflix)
// ==========================================
function togglePref(element) {
    element.classList.toggle("selected");
}

function setBudget(amount) {
    const input = document.getElementById("maxBudgetInput");
    if (input) input.value = amount;
}

function openPrefModal() {
    const modal = document.getElementById("preferenceModal");
    if (!modal) return;

    // โหลดค่าสไตล์และงบเดิมที่เคยตั้งไว้มาแสดง
    const savedPrefs = readStoredPrefs();
    const savedBudget = localStorage.getItem("trustMeMaxBudget") || "";

    document.querySelectorAll(".pref-item").forEach(item => {
        item.classList.toggle("selected", savedPrefs.includes(item.dataset.pref));
    });

    const budgetInput = document.getElementById("maxBudgetInput");
    if (budgetInput) budgetInput.value = savedBudget;

    modal.style.display = "flex";
}

function savePreferences() {
    const selected = [];
    document.querySelectorAll(".pref-item.selected").forEach(item => {
        selected.push(item.dataset.pref);
    });

    const budgetVal = document.getElementById("maxBudgetInput")?.value.trim() || "";

    if (selected.length === 0 && budgetVal === "") {
        alert("กรุณาเลือกสไตล์ที่ชอบ หรือระบุงบประมาณอย่างน้อย 1 อย่างครับ");
        return;
    }

    localStorage.setItem("trustMePrefs", JSON.stringify(selected));
    localStorage.setItem("trustMeMaxBudget", budgetVal);
    localStorage.setItem("trustMeOnboarded", "true");

    document.getElementById("preferenceModal").style.display = "none";
    applyHomeRecommendations();
}

function skipPreferences() {
    localStorage.setItem("trustMeOnboarded", "true");
    document.getElementById("preferenceModal").style.display = "none";
    applyHomeRecommendations();
}

function applyHomeRecommendations() {
    const homeGrid = document.getElementById("homeProducts");
    if (!homeGrid) return;

    const prefs = readStoredPrefs();
    const savedBudget = localStorage.getItem("trustMeMaxBudget");
    const maxBudget = savedBudget ? Number(savedBudget) : null;

    const titleEl = document.getElementById("recommendTitle");
    const descEl = document.getElementById("recommendDesc");
    const tagEl = document.getElementById("recommendTag");

    // ถ้ายังไม่เคยตั้งค่าทั้งสไตล์และงบประมาณ ให้แสดงสินค้าแนะนำทั่วไป 3 ชิ้นแรก
    if (prefs.length === 0 && !maxBudget) {
        renderProducts("homeProducts", products.slice(0, 3));
        return;
    }

    // คัดกรองสินค้าตามสไตล์และงบประมาณ
    const recommended = products.filter(p => {
        // 1. เช็กเงื่อนไขสไตล์ (ถ้าไม่ได้เลือกสไตล์เลย หรือเลือก 'ดูได้ทุกแนว' ให้ผ่านหมด)
        let matchStyle = false;
        if (prefs.length === 0 || prefs.includes("all")) {
            matchStyle = true;
        } else {
            const matchIT = prefs.includes("อุปกรณ์ไอที") && p.category === "อุปกรณ์ไอที";
            const matchLife = prefs.includes("ไลฟ์สไตล์") && p.category === "ไลฟ์สไตล์";
            const matchTopScore = prefs.includes("top-score") && p.score >= 88;
            matchStyle = matchIT || matchLife || matchTopScore;
        }

        // 2. เช็กเงื่อนไขงบประมาณ (ถ้ามีการระบุงบ ราคาต้องไม่เกินงบ)
        const matchBudget = maxBudget ? p.price <= maxBudget : true;

        return matchStyle && matchBudget;
    });

    if (tagEl) tagEl.textContent = "✦ SELECTED FOR YOUR STYLE & BUDGET";
    if (titleEl) {
        titleEl.textContent = maxBudget
            ? `คัดสรรมาเพื่อคุณ (งบไม่เกิน ${money(maxBudget)})`
            : "คัดสรรมาเพื่อคุณโดยเฉพาะ";
    }
    if (descEl) {
        descEl.textContent = recommended.length > 0
            ? `พบสินค้าคุ้มค่าที่ตรงตามเงื่อนไขของคุณทั้งหมด ${recommended.length} รายการ`
            : "ไม่พบสินค้าในงบประมาณนี้ ลองปรับเพิ่มงบประมาณดูนะครับ";
    }

    if (recommended.length > 0) {
        renderProducts("homeProducts", recommended);
    } else {
        homeGrid.innerHTML = `
            <div class="empty" style="grid-column: 1 / -1; text-align: center; padding: 30px; background: #f8fafc; border-radius: 16px;">
                <p style="margin-bottom: 12px; color: #64748b;">ยังไม่มีสินค้าที่ราคาไม่เกิน <b>${money(maxBudget)}</b> ในหมวดที่เลือก</p>
                <button onclick="openPrefModal()" class="btn btn-primary">ปรับงบประมาณใหม่</button>
            </div>
        `;
    }
}

// ==========================================
// 4. ฟังก์ชันจัดการแสดงผลสินค้าและการเปรียบเทียบ
// ==========================================
function productCard(product) {
    return `
        <article class="product-card">
            <div class="product-visual" style="background:${product.color}">
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

function searchHome(event) {
    event.preventDefault();
    const keyword = document.getElementById("homeSearch").value;
    location.href = "evaluate.html?q=" + encodeURIComponent(keyword);
}

function showProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const modal = document.getElementById("productModal");
    if (!modal) return;

    document.getElementById("productModalContent").innerHTML = `
        <div class="detail-emoji" style="font-size:60px;text-align:center;background:${product.color};padding:20px;border-radius:15px">
            ${product.emoji}
        </div>
        <span class="tag">${product.category}</span>
        <h2>${product.name}</h2>
        <h2 style="color:#239c79">${product.score}% คะแนนตัวอย่าง</h2>
        <h3>${money(product.price)}</h3>
        <p>${product.desc}</p>
        <b>คุณสมบัติ</b>
        <ul>
            ${product.features.map(item => `<li>${item}</li>`).join("")}
        </ul>
        <button class="btn btn-primary" onclick="toggleCompare(${product.id}); closeModal('productModal')">
            + เพิ่มเพื่อเปรียบเทียบ
        </button>
    `;

    modal.classList.add("open");
}

function closeModal(id) {
    document.getElementById(id)?.classList.remove("open");
}

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
        return `<span class="compare-pill">${product.emoji} ${product.name}</span>`;
    }).join("");

    if (count) count.textContent = compareIds.length
        ? `เลือกแล้ว ${compareIds.length} รายการ`
        : "เลือกสินค้าอย่างน้อย 2 รายการ";

    if (button) button.disabled = compareIds.length < 2;
}

function compareNow() {
    const items = compareIds.map(id => products.find(p => p.id === id));
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

function filterCatalog() {
    const search = document.getElementById("evaluateSearch");
    if (!search) return;

    const keyword = search.value.toLowerCase();
    const sort = document.getElementById("sortSelect").value;

    let result = products.filter(product => {
        const matchName = product.name.toLowerCase().includes(keyword);
        const matchCategory = selectedCategory === "ทั้งหมด" || product.category === selectedCategory;
        return matchName && matchCategory;
    });

    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    if (sort === "score") result.sort((a, b) => b.score - a.score);

    renderProducts("evaluateProducts", result);

    const count = document.getElementById("resultCount");
    if (count) {
        count.textContent = `พบสินค้า ${result.length} รายการ`;
    }
}

function logout() {
    localStorage.removeItem("trustMeCurrentUser");
    location.href = "index.html";
}

// ==========================================
// 5. เริ่มทำงานเมื่อเปิดหน้าเว็บ
// ==========================================
document.addEventListener("DOMContentLoaded", () => {

    // ตัวจัดการ modal และการเปรียบเทียบใช้ร่วมกันทั้งหน้าแรกและหน้าค้นหา
    document.getElementById("compareNow")?.addEventListener("click", compareNow);
    document.querySelectorAll("[data-close]").forEach(button => {
        button.addEventListener("click", () => closeModal(button.dataset.close));
    });
    document.querySelectorAll(".modal-backdrop").forEach(modal => {
        modal.addEventListener("click", event => {
            if (event.target === modal) modal.classList.remove("open");
        });
    });

    // เช็กว่าเคยเลือกสไตล์ความสนใจครั้งแรกหรือยัง
    const prefModal = document.getElementById("preferenceModal");
    if (prefModal && !localStorage.getItem("trustMeOnboarded")) {
        prefModal.style.display = "flex";
    }

    // แสดงสินค้าหน้าแรกตามสไตล์และงบที่เลือก
    applyHomeRecommendations();

    // แสดงสินค้าหน้า Dashboard
    const dashboardProducts = document.getElementById("dashboardProducts");
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

    // ตรวจสอบสถานะการล็อกอินและอัปเดตเมนู Navbar + ชื่อผู้ใช้
    const currentUser = JSON.parse(localStorage.getItem("trustMeCurrentUser") || "null");

    if (currentUser) {
        const userName = document.getElementById("userName");
        const welcomeName = document.getElementById("welcomeName");
        const authLinks = document.getElementById("authLinks");

        if (userName) userName.textContent = currentUser.name;
        if (welcomeName) welcomeName.textContent = currentUser.name;
        
        if (authLinks) {
            authLinks.innerHTML = `
                <span style="font-weight: 600; color: #2563eb; margin: 0 10px;">👤 ${currentUser.name}</span>
                <button onclick="logout()" class="btn" style="background:#ef4444; color:white; padding:6px 12px; border:none; border-radius:6px; cursor:pointer;">ออกจากระบบ</button>
            `;
        }
    }

    // ระบบสมัครสมาชิก (แสดง UI ป๊อปอัปเมื่อสำเร็จ)
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async event => {
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

            if (supabaseClient) {
                const { data: existingUser } = await supabaseClient
                    .from('customers')
                    .select('email')
                    .eq('email', email)
                    .maybeSingle();

                if (existingUser) {
                    alert("อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น");
                    return;
                }

                const { error } = await supabaseClient
                    .from('customers')
                    .insert([{ name, email, password }]);

                if (error) {
                    alert("เกิดข้อผิดพลาดในการสมัครสมาชิก: " + error.message);
                    return;
                }
            } else {
                localStorage.setItem("trustMeUser", JSON.stringify({ name, email, password }));
            }

            const successModal = document.getElementById("successModal");
            if (successModal) {
                successModal.style.display = "flex";
            } else {
                alert("สมัครสมาชิกสำเร็จ!");
                location.href = "login.html";
            }
        });
    }

    // ระบบเข้าสู่ระบบ
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async event => {
            event.preventDefault();

            const email = document.getElementById("loginEmail").value.trim().toLowerCase();
            const password = document.getElementById("loginPassword").value;

            if (supabaseClient) {
                const { data: user, error } = await supabaseClient
                    .from('customers')
                    .select('*')
                    .eq('email', email)
                    .eq('password', password)
                    .maybeSingle();

                if (error) {
                    alert("เกิดข้อผิดพลาดในการเชื่อมต่อ: " + error.message);
                    return;
                }

                if (user) {
                    localStorage.setItem("trustMeCurrentUser", JSON.stringify({
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }));
                    location.href = "dashboard.html";
                } else {
                    alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
                }
            } else {
                const user = JSON.parse(localStorage.getItem("trustMeUser") || "null");
                if (user && user.email === email && user.password === password) {
                    localStorage.setItem("trustMeCurrentUser", JSON.stringify({
                        name: user.name,
                        email: user.email
                    }));
                    location.href = "dashboard.html";
                } else {
                    alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
                }
            }
        });
    }

    // ระบบหน้าค้นหาสินค้า (evaluate.html)
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
            button.classList.toggle("active", button.dataset.category === selectedCategory);
            button.addEventListener("click", () => {
                selectedCategory = button.dataset.category;
                document.querySelectorAll(".filter").forEach(item => {
                    item.classList.toggle("active", item === button);
                });
                filterCatalog();
            });
        });

        document.getElementById("evaluateSearch").addEventListener("input", filterCatalog);
        document.getElementById("sortSelect").addEventListener("change", filterCatalog);
        document.getElementById("searchButton")?.addEventListener("click", filterCatalog);
        filterCatalog();
    }
});