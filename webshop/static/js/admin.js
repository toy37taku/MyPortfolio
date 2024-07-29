document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    const productModal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const productForm = document.getElementById('productForm');
    const addProductButton = document.getElementById('addProductButton');
    const cancelButton = document.getElementById('cancelButton');
    const productIdInput = document.getElementById('productId');

    const fetchProducts = async () => {
        const response = await fetch('https://webshop-sandy.vercel.app/api/products');
        const data = await response.json();
        renderProducts(data.items);
    };

    const renderProducts = (products) => {
        output.innerHTML = '';
        products.forEach((product, index) => {
            const productDiv = document.createElement('div');
            productDiv.innerHTML = `
                <h2>${product.name}</h2>
                <p>価格: ${product.price}円</p>
                <img src="/MyPortfolio/webshop/static/img/${item.img}" alt="${product.name}">
                <p>${product.detail}</p>
                <a href="javascript:void(0);" onclick="editProduct(${product.id})">編集</a>
                <button onclick="deleteProduct(${product.id})">削除</button>
            `;
            output.appendChild(productDiv);
        });
    };

    window.editProduct = (id) => {
        fetch(`/api/products/${id}`)
            .then(response => response.json())
            .then(product => {
                modalTitle.textContent = '商品を編集';
                productIdInput.value = product.id;
                document.getElementById('name').value = product.name;
                document.getElementById('price').value = product.price;
                document.getElementById('detail').value = product.detail;
                productModal.style.display = 'block';
            });
    };

    window.deleteProduct = async (id) => {
        if (confirm('本当に削除しますか？')) {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchProducts();
            } else {
                alert('削除に失敗しました');
            }
        }
    };

    addProductButton.addEventListener('click', () => {
        modalTitle.textContent = '商品を追加';
        productForm.reset();
        productIdInput.value = '';
        productModal.style.display = 'block';
    });

    cancelButton.addEventListener('click', () => {
        productModal.style.display = 'none';
    });

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(productForm);
        const id = productIdInput.value;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/products/${id}` : '/api/products';

        const response = await fetch(url, {
            method: method,
            body: formData
        });

        if (response.ok) {
            productModal.style.display = 'none';
            fetchProducts();
        } else {
            alert('保存に失敗しました');
        }
    });

    fetchProducts();
});
