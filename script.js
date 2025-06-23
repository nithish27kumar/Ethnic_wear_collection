const products = [
    {
        id: 1,
        name: 'Silk Saree',
        category: 'Saree',
        price: 2499,
        stock: 3,
        images: [
            'https://assets0.mirraw.com/images/11707635/1033_zoom.jpg?1690797926',
            'https://shobitam.com/cdn/shop/files/DSC03249_02c2cd88-f632-474d-9faa-d627c8eb9489_1080x.jpg?v=1736222305',
            'https://www.fabja.com/media/catalog/product/w/e/wedding-special-dark-red-banarasi-soft-silk-saree-fj501324.jpg',
            'https://static.wixstatic.com/media/4594f8_db8e6e338ff54c78bb285a75469dfb88~mv2.jpg/v1/fill/w_268,h_358,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/4594f8_db8e6e338ff54c78bb285a75469dfb88~mv2.jpg'
        ]
    },
    {
        id: 2,
        name: 'Kurta Set',
        category: 'Kurta',
        price: 1599,
        stock: 3,
        images: [
            'https://img.faballey.com/images/Product/ILK02467D/3.jpg',
            'https://img.faballey.com/images/Product/ICD00773Z/3.jpg',
            'https://cdn.shopify.com/s/files/1/0341/4805/7228/files/img_01_de0d28e9-e172-4998-88ed-f9e1982ac484.webp?v=1720521672',
            'https://www.bhamadesigns.com/cdn/shop/files/2779-0212_4_af41e753-5775-456b-bf02-cae4d6105763.jpg?v=1740988225'
        ]
    },
    {
        id: 3,
        name: 'Lehenga',
        category: 'Lehenga',
        price: 4999,
        stock: 3,
        images: [
            'https://amrut.co/cdn/shop/files/Multi-Color_Sequin_Striped_Lehenga_Choli_with_Red_Dupatta_01.jpg?v=1732008623',
            'https://www.anantexports.in/cdn/shop/files/53868543731-9e26b45b73_o.jpg?v=1721476796&width=1946',
            'https://www.anantexports.in/cdn/shop/files/IMG-20240620_170111.jpg?v=1718883100&width=1946'
        ]
    },
    {
        id: 4,
        name: 'Frock',
        category: 'Frock',
        price: 1000,
        stock: 4,
        images: [
            'https://clothsvilla.com/cdn/shop/products/DesignerExclusivePartyWearLongAnarkaliGownCollectionwithDupatta4963_4_1024x1024.jpg?v=1694842508',
            'https://cygnusfashion.com/cdn/shop/products/4202_1.jpg?v=1623413846',
            'https://clothsvilla.com/cdn/shop/products/BlackPromDressesV-NeckPuffySleevesA-LineEveningGownforWedding_1_500x500.jpg?v=1697220843',
            'https://sayonafashion.com/media/catalog/product/cache/1/image/1800x/040ec09b1e35df139433887a97daa66f/7/1/7177._2.jpg'
        ]
    }
];

let cart = [];

const productList = document.getElementById('product-list');
const cartModal = document.getElementById('cart-modal');
const cartIcon = document.querySelector('.cart-icon');
const closeModal = document.querySelector('.close-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

function renderProducts() {
    productList.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <h3>${product.name}</h3>
            <div class="product-images">
                ${product.images.map((img, index) => `
                    <img 
                        src="${img}" 
                        alt="${product.name} view ${index + 1}" 
                        class="${index === 0 ? 'selected' : ''}"
                        onclick="selectProductImage(${product.id}, ${index})"
                    >
                `).join('')}
            </div>
            <img 
                id="main-image-${product.id}" 
                src="${product.images[0]}" 
                class="product-main-image"
                alt="${product.name}"
            >
            <p>Category: ${product.category}</p>
            <p>Price: ₹${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <button 
                onclick="addToCart(${product.id})" 
                ${product.stock === 0 ? 'disabled' : ''}
            >
                ${product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
        </div>
    `).join('');
}

function selectProductImage(productId, imageIndex) {
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
    const images = productCard.querySelectorAll('.product-images img');
    const mainImage = document.getElementById(`main-image-${productId}`);
    
    images.forEach(img => img.classList.remove('selected'));
    images[imageIndex].classList.add('selected');
    mainImage.src = products.find(p => p.id === productId).images[imageIndex];
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product.stock > 0) {
        const cartItem = cart.find(item => item.id === productId);
        
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        product.stock--;
        updateCartUI();
        renderProducts();
    }
}

function removeFromCart(productId) {
    const cartItemIndex = cart.findIndex(item => item.id === productId);
    
    if (cartItemIndex > -1) {
        const cartItem = cart[cartItemIndex];

        if (cartItem.quantity > 1) {
            cartItem.quantity--;
        } else {
            cart.splice(cartItemIndex, 1);
        }

        // Restore stock in product list
        const product = products.find(p => p.id === productId);
        if (product) {
            product.stock++;
        }

        updateCartUI();
        renderProducts();
    }
}

function updateCartUI() {
    document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name} (x${item.quantity})</span>
            <span>₹${item.price * item.quantity}</span>
            <button onclick="removeFromCart(${item.id})" class="remove-btn">Remove</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalElement.textContent = `Total: ₹${total}`;
}

cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

checkoutBtn.addEventListener('click', () => {
    alert('Thank you for your purchase!');
    cart = [];
    products.forEach(product => (product.stock = 3)); // Reset stock
    updateCartUI();
    renderProducts();
    cartModal.style.display = 'none';
});

renderProducts();
