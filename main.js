$(document).ready(function() {

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Номнууд
    const books = [
        { id: 1, title: "Атлант мөрөө хөндлөн тавьсан хүн", price: 24500, img: "img/nom1.jpeg", category: "bestseller" },
        { id: 2, title: "Дэлхийн төгсгөл", price: 18900, img: "img/nom2.jpeg", category: "new" },
        { id: 3, title: "Эзэн хаан", price: 32000, img: "img/nom3.jpeg", category: "sale" },
        { id: 4, title: "Сэтгэл зүйн нууц", price: 15900, img: "img/nom4.jpeg", category: "bestseller" },
        { id: 5, title: "Монголын түүх", price: 28000, img: "img/nom5.jpeg", category: "new" },
        { id: 6, title: "Амжилтын 7 дадал", price: 19900, img: "img/nom6.jpeg", category: "sale" },
    ];

    // ==================== Ном харуулах ====================
    function displayBooks(filteredBooks) {
        const grid = $("#book-grid");
        if (!grid.length) return;   // sags.html дээр байвал алгасна

        grid.empty();

        filteredBooks.forEach(book => {
            const card = `
                <div class="book-card">
                    <img src="${book.img}" alt="${book.title}">
                    <div class="book-info">
                        <h3>${book.title}</h3>
                        <div class="price">${book.price.toLocaleString()} ₮</div>
                        <button class="add-to-cart" onclick="addToCart(${book.id})">Сагсанд нэмэх</button>
                    </div>
                </div>
            `;
            grid.append(card);
        });
    }

    window.showCategory = function(category) {
        if (category === 'all') {
            displayBooks(books);
        } else {
            const filtered = books.filter(book => book.category === category);
            displayBooks(filtered);
        }
    };

    // ==================== Сагсны функцууд ====================
    window.addToCart = function(id) {
        const book = books.find(b => b.id === id);
        if (!book) return;

        const existing = cart.find(item => item.id === id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...book, quantity: 1 });
        }

        saveCart();
        updateCartCount();

        alert(book.title + " сагсанд нэмэгдлээ!");
    };

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartCount() {
        const countEl = $("#count, #cart-count");
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countEl.text(totalItems);
    }

    function displayCart() {
        const container = $("#cart-items");
        if (!container.length) return;

        container.empty();
        let total = 0;

        if (cart.length === 0) {
            container.html("<p style='text-align:center; padding:50px; font-size:18px;'>Сагс хоосон байна.</p>");
            $("#cart-total").text("0");
            return;
        }

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const html = `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.title}">
                    <div class="cart-item-info">
                        <h4>${item.title}</h4>
                        <p>${item.price.toLocaleString()} ₮ × ${item.quantity}</p>
                        <strong>${itemTotal.toLocaleString()} ₮</strong>
                    </div>
                    <span class="remove-btn" onclick="removeFromCart(${index})">✕</span>
                </div>
            `;
            container.append(html);
        });

        $("#cart-total").text(total.toLocaleString());
    }

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        saveCart();
        displayCart();
        updateCartCount();
    };

    window.clearCart = function() {
        if (confirm("Сагсыг бүрэн цэвэрлэх үү?")) {
            cart = [];
            saveCart();
            displayCart();
            updateCartCount();
        }
    };

    window.orderNow = function() {
        if (cart.length === 0) {
            alert("Сагс хоосон байна!");
            return;
        }
        alert("Захиалга амжилттай баталгаажлаа! (Жишээ мэдэгдэл)");
        // Энд бодит захиалгын код нэмж болно
    };

    // ==================== DROPDOWN MENU (ЗАСВАРЛАСАН) ====================
    function setupDropdowns() {
        // Бүх dropdown дээр дарвал
        $(".dropdown").click(function(e) {
            e.stopImmediatePropagation();

            const currentMenu = $(this).find(".dropdown-menu");

            // Бусад бүх menu-г хаах
            $(".dropdown-menu").not(currentMenu).slideUp(150);

            // Одоогийн menu-г toggle хийх
            currentMenu.slideToggle(200);
        });

        // Dropdown-оос гадна хаана ч дарвал бүгдийг хаах
        $(document).click(function() {
            $(".dropdown-menu").slideUp(150);
        });

        // Dropdown доторх li дээр дарвал хаахгүй байх + функц ажиллах
        $(".dropdown-menu li").click(function(e) {
            e.stopPropagation();
            // showCategory гэх мэт функцүүд onclick-ээр ажиллана
        });
    }

    // ==================== Инициализаци ====================
    displayBooks(books);        // index.html дээр ном харуулах
    displayCart();              // sags.html дээр сагс харуулах
    updateCartCount();

    setupDropdowns();           // Dropdown ажиллуулах

    // Сагсны icon дээр дарвал sags.html руу шилжих
    $("#cart-icon").click(function() {
        window.location.href = "sags.html";
    });

});