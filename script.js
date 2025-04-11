// Cart System
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage or empty array
    let cart = JSON.parse(localStorage.getItem('maybellineCart')) || [];
    
    // Update cart badge
    function updateCartBadge() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-badge').textContent = totalItems;
    }
    
    // Render cart modal
    function renderCartModal() {
        const modalBody = document.querySelector('#cartModal .modal-body');
        
        if (cart.length === 0) {
            modalBody.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-cart-x fs-1 text-muted"></i>
                    <p class="mt-3">Your cart is empty</p>
                    <a href="products.html" class="btn btn-danger mt-2">Shop Now</a>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        let grandTotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            grandTotal += itemTotal;
            
            html += `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${item.image}" alt="${item.name}" class="img-thumbnail me-3" style="width: 60px; height: 60px; object-fit: cover;">
                            <div>
                                <h6 class="mb-0">${item.name}</h6>
                                <small class="text-muted">${item.category}</small>
                            </div>
                        </div>
                    </td>
                    <td>₱${item.price.toFixed(2)}</td>
                    <td>
                        <div class="input-group" style="max-width: 120px;">
                            <button class="btn btn-outline-secondary decrease-quantity" type="button" data-id="${item.id}">-</button>
                            <input type="number" class="form-control text-center quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                            <button class="btn btn-outline-secondary increase-quantity" type="button" data-id="${item.id}">+</button>
                        </div>
                    </td>
                    <td>₱${itemTotal.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-4">
                <h5>Grand Total: ₱${grandTotal.toFixed(2)}</h5>
                <a href="checkout.html" class="btn btn-danger">Proceed to Checkout</a>
            </div>
        `;
        
        modalBody.innerHTML = html;
        setupCartEventListeners();
    }
    
    // Setup event listeners for cart buttons
    function setupCartEventListeners() {
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                updateQuantity(productId, -1);
            });
        });
        
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                updateQuantity(productId, 1);
            });
        });
        
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const productId = this.getAttribute('data-id');
                const newQuantity = parseInt(this.value);
                if (!isNaN(newQuantity)) {
                    setQuantity(productId, newQuantity);
                }
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                removeFromCart(productId);
            });
        });
    }
    
    // Update product quantity
    function updateQuantity(productId, change) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;
            
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            
            saveCart();
        }
    }
    
    // Set specific quantity
    function setQuantity(productId, quantity) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = quantity;
            
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            
            saveCart();
        }
    }
    
    // Remove item from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('maybellineCart', JSON.stringify(cart));
        updateCartBadge();
        renderCartModal();
    }
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productCard = this.closest('.product-card');
            
            const product = {
                id: productId,
                name: productCard.querySelector('.card-title').textContent,
                price: parseFloat(productCard.querySelector('.price').textContent.replace('₱', '')),
                category: productCard.getAttribute('data-category'),
                image: productCard.querySelector('img').src,
                quantity: 1
            };
            
            // Check if product already in cart
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push(product);
            }
            
            saveCart();
            
            // Show toast notification
            const toast = new bootstrap.Toast(document.getElementById('addedToCartToast'));
            const toastBody = document.querySelector('#addedToCartToast .toast-body');
            toastBody.textContent = `${product.name} has been added to your cart.`;
            toast.show();
        });
    });
    
    // Initialize cart
    updateCartBadge();
    
    // Render cart when modal is shown
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('show.bs.modal', renderCartModal);
    }
    
    // Search functionality (existing code)
    // ...
});