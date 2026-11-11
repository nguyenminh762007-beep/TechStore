
const products = [
    {
        id: 1,
        name: "Laptop văn phòng",
        category: "Laptop",
        price: 12500000,
        icon: "💻",
        description: "Hiệu năng ổn định cho học tập."
    },
    {
        id: 2,
        name: "Laptop gaming",
        category: "Laptop",
        price: 22500000,
        icon: "🎮",
        description: "Phù hợp chơi game và đồ họa."
    },
    {
        id: 3,
        name: "Điện thoại thông minh",
        category: "Điện thoại",
        price: 8990000,
        icon: "📱",
        description: "Thiết kế hiện đại, dễ sử dụng."
    },
    {
        id: 4,
        name: "Tai nghe Bluetooth",
        category: "Phụ kiện",
        price: 650000,
        icon: "🎧",
        description: "Âm thanh rõ, kết nối không dây."
    },
    {
        id: 5,
        name: "Bàn phím cơ",
        category: "Phụ kiện",
        price: 890000,
        icon: "⌨️",
        description: "Gõ phím thoải mái, bền bỉ."
    },
    {
        id: 6,
        name: "Chuột không dây",
        category: "Phụ kiện",
        price: 350000,
        icon: "🖱️",
        description: "Nhỏ gọn, tiện lợi khi di chuyển."
    },
    {
        id: 7,
        name: "Điện thoại cao cấp",
        category: "Điện thoại",
        price: 18990000,
        icon: "📲",
        description: "Màn hình đẹp, hiệu năng mạnh."
    },
    {
        id: 8,
        name: "Màn hình máy tính",
        category: "Phụ kiện",
        price: 3290000,
        icon: "🖥️",
        description: "Màn hình rộng cho góc làm việc."
    }
];

let cart = [];
let selectedCategory = "Tất cả";

const money = value =>
    value.toLocaleString("vi-VN") + " ₫";

function renderProducts() {
    const keyword = document
        .getElementById("search")
        .value.trim().toLowerCase();

    const filtered = products.filter(product => {
        const matchName = product.name
            .toLowerCase()
            .includes(keyword);

        const matchCategory =
            selectedCategory === "Tất cả" ||
            product.category === selectedCategory;

        return matchName && matchCategory;
    });

    document.getElementById("product-list").innerHTML =
        filtered.map(product => `
            <article class="product-card">
                <div class="product-image">${product.icon}</div>
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                <p class="price">${money(product.price)}</p>
                <button class="add-button"
                    data-add="${product.id}">
                    + Thêm vào giỏ
                </button>
            </article>
        `).join("");

    document.getElementById("empty-message").hidden =
        filtered.length > 0;
}

function addToCart(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;

    const item = cart.find(item => item.id === id);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
    showToast("Đã thêm sản phẩm vào giỏ hàng!");
}

function changeQuantity(id, amount) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }

    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

function renderCart() {
    const count = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    document.getElementById("cart-count").textContent = count;
    document.getElementById("cart-total").textContent = money(total);

    document.getElementById("cart-items").innerHTML =
        cart.length === 0
            ? "<p>Giỏ hàng đang trống.</p>"
            : cart.map(item => `
                <div class="cart-item">
                    <div>
                        <strong>${item.name}</strong>
                        <p>${money(item.price)} / sản phẩm</p>
                    </div>
                    <div class="quantity">
                        <button data-minus="${item.id}"
                            aria-label="Giảm số lượng">−</button>
                        <span>${item.quantity}</span>
                        <button data-plus="${item.id}"
                            aria-label="Tăng số lượng">+</button>
                        <button class="remove-button"
                            data-remove="${item.id}">Xóa</button>
                    </div>
                </div>
            `).join("");
}

function toggleCart() {
    const panel = document.getElementById("cart-panel");
    panel.hidden = !panel.hidden;

    if (!panel.hidden) {
        renderCart();
        panel.scrollIntoView({ behavior: "smooth" });
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}

// Xử lý các nút bằng event delegation
document.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.add) {
        addToCart(Number(button.dataset.add));
    }

    if (button.dataset.minus) {
        changeQuantity(Number(button.dataset.minus), -1);
    }

    if (button.dataset.plus) {
        changeQuantity(Number(button.dataset.plus), 1);
    }

    if (button.dataset.remove) {
        removeFromCart(Number(button.dataset.remove));
    }

    if (button.classList.contains("category")) {
        selectedCategory = button.dataset.category;

        document.querySelectorAll(".category").forEach(btn => {
            btn.classList.toggle("active", btn === button);
        });

        renderProducts();
    }
});

document.getElementById("search").addEventListener(
    "input", renderProducts
);

// Đặt hàng mô phỏng, chưa lưu vào cơ sở dữ liệu
document.getElementById("checkout-form").addEventListener(
    "submit", event => {
        event.preventDefault();

        if (cart.length === 0) {
            showToast("Vui lòng thêm sản phẩm vào giỏ!");
            return;
        }

        const form = event.currentTarget;

        if (!form.reportValidity()) return;

        const customer = form.elements.customer.value.trim();

        alert(
            "Đặt hàng demo thành công!\n" +
            "Khách hàng: " + customer + "\n" +
            "Tổng tiền: " +
            money(cart.reduce(
                (sum, item) => sum + item.price * item.quantity, 0
            )) +
            "\nĐây chưa phải đơn hàng thật."
        );

        cart = [];
        renderCart();
        form.reset();
    }
);

renderProducts();
renderCart();
