// public/app.js
document.addEventListener('DOMContentLoaded', () => {
    const itemForm = document.getElementById('itemForm');
    const itemInput = document.getElementById('itemInput');
    const itemsTableBody = document.getElementById('itemsTable').querySelector('tbody');

    // Fetch all items on page load
    fetchItems();

    // Handle form submission to add new item
    itemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const itemName = itemInput.value.trim();
        if (itemName) {
            const newItem = { id: Date.now().toString(), name: itemName };
            await addItem(newItem);
            itemInput.value = '';
            fetchItems(); // Refresh items
        }
    });

    // Fetch Items from API
    async function fetchItems() {
        const response = await fetch('/api/items');
        const items = await response.json();
        renderItems(items);
    }

    // Render Items to Table
    function renderItems(items) {
        itemsTableBody.innerHTML = ''; // Clear previous rows
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>
                    <button class="edit" onclick="editItem('${item.id}', '${item.name}')">Edit</button>
                    <button class="delete" onclick="deleteItem('${item.id}')">Delete</button>
                </td>
            `;
            itemsTableBody.appendChild(row);
        });
    }

    // Add Item
    async function addItem(item) {
        await fetch('/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });
    }

    // Edit Item
    window.editItem = async (id, currentName) => {
        const newName = prompt("Enter new name:", currentName);
        if (newName && newName.trim() !== "") {
            const updatedItem = { id, name: newName.trim() };
            await fetch(`/api/items/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItem),
            });
            fetchItems();
        }
    };

    // Delete Item
    window.deleteItem = async (id) => {
        if (confirm('Are you sure you want to delete this item?')) {
            await fetch(`/api/items/${id}`, { method: 'DELETE' });
            fetchItems();
        }
    };
});
