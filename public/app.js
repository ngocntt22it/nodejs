document.addEventListener('DOMContentLoaded', () => {
  const itemForm = document.getElementById('itemForm');
  const itemsTable = document.getElementById('layoutCard');
  const apiUrl = '/api/items';

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function fetchItems() {
    fetch(apiUrl)
      .then(response => response.json())
      .then(items => {
        itemsTable.innerHTML = '';
        items.forEach(item => {
          const row = document.createElement('div');
          row.classList.add('card', 'm-2', "col-sm-3", "col-md-4");
          row.style = "width:14em"
          row.innerHTML = `        
                <img src="${item.description}" class="d-block mx-auto mt-3" alt="..." style="width:180px;height:150px">
                <div class="m-2">
                  <h6 class="card-title">${item.name.length > 20 ? item.name.slice(0, 20) + '...' : item.name}</h6>
                  <h6 class="card-title">Giá: ${formatPrice(item.price)}đ</h6>
                  <p class="card-text">${item.description.length > 20 ? item.description.slice(0, 20) + '...' : item.description}</p>
                  <button class="btn btn-primary" onclick="editItem('${item._id}')">Edit</button>
                  <button class="btn btn-warning" onclick="deleteItem('${item._id}')">Delete</button>
                </div>
              
            `;
          itemsTable.appendChild(row);
        });
      })
      .catch(error => console.error('Error fetching items:', error));
  }



  function addItem(name, description, price) {
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price }),
    })
      .then(response => response.json())
      .then(() => {
        itemForm.reset();
        fetchItems();
      })
      .catch(error => console.error('Error adding item:', error));
  }

  if (itemForm) {
    itemForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const nameInput = document.getElementById('itemNameInput');
      const descriptionInput = document.getElementById('itemDescriptionInput');
      const priceInput = document.getElementById('itemPriceInput');

      if (nameInput && descriptionInput && priceInput) {
        const name = nameInput.value;
        const description = descriptionInput.value;
        const price = parseFloat(priceInput.value);
        alert('Thêm sản phẩm thành công');
        addItem(name, description, price);
      } else {
        console.error('One or more input fields are missing.');
      }
    });
  } else {
    console.error('Form element not found.');
  }

  window.editItem = function (id) {
    const newName = prompt('Nhập lại tên:');
    const newDescription = prompt('Nhập lại link ảnh:');

    let newPrice;
    while (true) {
      newPrice = prompt('Nhập lại giá:');
      if (!isNaN(parseFloat(newPrice))) {
        break;
      }
      alert('Vui lòng nhập một giá trị số hợp lệ!');
    }

    if (newName && newDescription && newPrice) {
      fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, description: newDescription, price: parseFloat(newPrice) }),
      })
        .then(response => response.json())
        .then(() => fetchItems())
        .catch(error => console.error('Error updating item:', error));
    }
    else{
      alert('Chỉnh sửa không thành công do thiếu thông tin')
    }
  };

  window.deleteItem = function (id) {
    
    if (confirm('Bạn có muốn xóa mục hàng này không?')) {
      fetch(`/api/items/${id}`, { method: 'DELETE' })
        .then(() => fetchItems())
        .catch(error => console.error('Error deleting item:', error));
    } else {
      console.log('Xóa mục hàng đã bị hủy bỏ.');
    }
  };

  fetchItems();
});
