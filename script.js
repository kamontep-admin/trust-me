
const products = [
    {
        id: 1,
        name: "หูฟังไร้สาย",
        price: 599,
        score: 92,
        emoji: "🎧",
        description: "หูฟังไร้สาย แบตเตอรี่ใช้งานได้นาน"
    },
    {
        id: 2,
        name: "เมาส์ไร้สาย",
        price: 299,
        score: 88,
        emoji: "🖱️",
        description: "เมาส์สำหรับเรียนและทำงานทั่วไป"
    },
    {
        id: 3,
        name: "คีย์บอร์ด Mechanical",
        price: 890,
        score: 85,
        emoji: "⌨️",
        description: "คีย์บอร์ดสำหรับพิมพ์งานและเล่นเกม"
    },
    {
        id: 4,
        name: "กระบอกน้ำ",
        price: 199,
        score: 90,
        emoji: "🥤",
        description: "กระบอกน้ำพกพาสำหรับใช้งานประจำวัน"
    },
    {
        id: 5,
        name: "กระเป๋าสะพาย",
        price: 490,
        score: 83,
        emoji: "🎒",
        description: "กระเป๋าสำหรับใส่อุปกรณ์และของใช้"
    },
    {
        id: 6,
        name: "โคมไฟตั้งโต๊ะ",
        price: 350,
        score: 87,
        emoji: "💡",
        description: "โคมไฟสำหรับอ่านหนังสือและทำงาน"
    }
];

// แสดงราคาเป็นรูปแบบเงินบาท
function formatPrice(price) {
    return price.toLocaleString("th-TH") + " บาท";
}

// สร้างการ์ดสินค้า
function createProductCard(product, buttonText = "ดูรายละเอียด") {
    return `
        <div class="product-card">
            <div class="product-emoji">${product.emoji}</div>

            <h3>${product.name}</h3>

            <p>${product.description}</p>

            <p><strong>ราคา:</strong> ${formatPrice(product.price)}</p>

            <p class="score">
                คะแนนความคุ้มค่า ${product.score}%
            </p>

            <button class="detail-btn"
                onclick="showProduct(${product.id})">
                ${buttonText}
            </button>
        </div>
    `;
}

// แสดงสินค้าในหน้าแรก
const productGrid = document.getElementById("productGrid");

if (productGrid) {
    productGrid.innerHTML = products
        .map(product => createProductCard(product))
        .join("");
}

// ค้นหาสินค้าหน้าแรก
function searchProduct() {
    const input = document.getElementById("searchInput");
    if (!input) return;

    const keyword = input.value.trim().toLowerCase();

    const result = products.filter(product =>
        product.name.toLowerCase().includes(keyword)
    );

    productGrid.innerHTML = result.length
        ? result.map(product => createProductCard(product)).join("")
        : "<p>ไม่พบสินค้าที่ค้นหา</p>";
}

// ค้นหาสินค้าในหน้าวิเคราะห์
function searchEvaluate() {
    const input = document.getElementById("evaluateSearch");
    if (!input) return;

    const keyword = input.value.trim().toLowerCase();

    const result = products.filter(product =>
        product.name.toLowerCase().includes(keyword)
    );

    document.getElementById("evaluateGrid").innerHTML =
        result.length
            ? result.map(product => createProductCard(product)).join("")
            : "<p>ไม่พบสินค้าที่ค้นหา</p>";
}

// แสดงรายละเอียดและคะแนนความคุ้มค่า
function showProduct(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    const result = document.getElementById("evaluationResult");

    if (result) {
        result.innerHTML = `
            <h2>📊 ผลการวิเคราะห์สินค้า</h2>

            <h3>${product.emoji} ${product.name}</h3>

            <p>ราคา: ${formatPrice(product.price)}</p>

            <p>คะแนนความคุ้มค่า: ${product.score}%</p>

            <div style="
                background:#eee;
                height:15px;
                border-radius:20px;
                overflow:hidden;
                margin:12px 0;
            ">
                <div style="
                    width:${product.score}%;
                    height:100%;
                    background:linear-gradient(90deg,#7657f5,#ff70a6);
                "></div>
            </div>

            <p>${product.description}</p>

            <p><strong>คำแนะนำ:</strong>
            ${product.score >= 90
                ? "เป็นสินค้าที่มีคะแนนความคุ้มค่าสูงในข้อมูลตัวอย่าง"
                : "ควรเปรียบเทียบคุณสมบัติและราคากับสินค้าอื่นก่อนซื้อ"}
            </p>

            <small>
                * คะแนนเป็นข้อมูลจำลองสำหรับโครงงาน
            </small>
        `;

        result.scrollIntoView({ behavior: "smooth" });
    } else {
        alert(
            product.name +
            "\nราคา: " + formatPrice(product.price) +
            "\nคะแนนความคุ้มค่า: " + product.score + "%"
        );
    }
}

// แสดงสินค้าในหน้าวิเคราะห์
const evaluateGrid = document.getElementById("evaluateGrid");

if (evaluateGrid) {
    evaluateGrid.innerHTML = products
        .map(product => createProductCard(product))
        .join("");
}

// สมัครสมาชิก (ระบบสาธิต)
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirm = document.getElementById("confirmPassword").value;

        if (password !== confirm) {
            alert("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
            return;
        }

        const users = JSON.parse(
            localStorage.getItem("trustMeUsers") || "[]"
        );

        if (users.some(user => user.email === email)) {
            alert("อีเมลนี้มีบัญชีอยู่แล้ว");
            return;
        }

        users.push({
            name: name,
            email: email,
            password: password
        });

        localStorage.setItem("trustMeUsers", JSON.stringify(users));

        alert("สมัครสมาชิกสำเร็จ!");

        window.location.href = "login.html";
    });
}

// เข้าสู่ระบบ (ระบบสาธิต)
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("loginUser").value.trim();
        const password = document.getElementById("loginPassword").value;

        const users = JSON.parse(
            localStorage.getItem("trustMeUsers") || "[]"
        );

        const user = users.find(item =>
            (item.email === username || item.name === username) &&
            item.password === password
        );

        if (user) {
            localStorage.setItem("trustMeCurrentUser", JSON.stringify({
                name: user.name,
                email: user.email
            }));

            alert("เข้าสู่ระบบสำเร็จ ยินดีต้อนรับ " + user.name);

            window.location.href = "dashboard.html";
        } else {
            alert("ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง");
        }
    });
}

// แสดงชื่อผู้ใช้งานใน Dashboard
const userName = document.getElementById("userName");

if (userName) {
    const currentUser = JSON.parse(
        localStorage.getItem("trustMeCurrentUser") || "null"
    );

    if (currentUser) {
        userName.textContent = currentUser.name;
    }
}

// ออกจากระบบ
function logout() {
    localStorage.removeItem("trustMeCurrentUser");

    alert("ออกจากระบบเรียบร้อย");

    window.location.href = "index.html";
}