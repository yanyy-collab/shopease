import { useEffect, useState } from "react";
import api from "./services/api";


function App() {
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [form, setForm] = useState({
  name: "",
description: "",
price: "",
stock: ""  
});
const [editingId, setEditingId] = useState(null);

const [saving, setSaving] = useState(false);
const [message, setMessage] = useState("");
async function loadProducts() {
try {
setLoading(true);
setError("");
const response = await api.get("/products");
setProducts(response.data);
} catch (err) {
console.error("Failed to load products:", err);
setError("Unable to load products. Please check the server.");
} finally {
setLoading(false);
}
}
useEffect(() => {
loadProducts();
}, []);
if (loading) {
return <p className="p-6">Loading products...</p>;
}
if (error) {
return <p className="p-6 text-red-600">{error}</p>;
}
function handleChange(event) {
const { name, value } = event.target;
setForm((previous) => ({
...previous,
[name]: value
}));
}
async function handleSave(event) {
event.preventDefault();
try {
setSaving(true);
setMessage("");
const productData = {
...form,
price: Number(form.price),
stock: Number(form.stock)
};

if (editingId !== null) {
await api.put(`/products/${editingId}`, productData);
setMessage("Product updated successfully.");
} else {
await api.post("/products", productData);
setMessage("Product saved successfully.");
}

setEditingId(null);
setForm({
name: "",
description: "",
price: "",
stock: ""
});
await loadProducts();
} catch (err) {
setMessage(
err.response?.data?.message || "Unable to save changes."
);
} finally {
setSaving(false);
}
}

function handleEdit(product) {
setEditingId(product.id);
setForm({
name: product.name,
description: product.description || "",
price: String(product.price),
stock: String(product.stock)
});
setMessage("");
}

function handleCancelEdit() {
setEditingId(null);
setForm({
name: "",
description: "",
price: "",
stock: ""
});
setMessage("");
}


return (
<div className="min-h-screen bg-gray-100 p-8">
<h1 className="mb-6 text-3xl font-bold">
ShopEase - Product Management
</h1>
{products.length === 0 ? (
<p>No products found.</p>
) : (
<div className="overflow-x-auto rounded-lg bg-white shadow">

<form
onSubmit={handleSave}
className="mb-8 grid gap-4 rounded-lg bg-white p-6 shadow md:grid-cols-2"
>
<h2 className="text-xl font-semibold md:col-span-2">
{editingId !== null ? "Edit Product" : "Add New Product"}
</h2>
<input
name="name"
value={form.name}
onChange={handleChange}
placeholder="Product name"
required
className="rounded border p-3"
/>
<input
name="description"
value={form.description}
onChange={handleChange}
placeholder="Description"
className="rounded border p-3"
/>
<input
name="price"
type="number"
min="0"
step="0.01"
value={form.price}
onChange={handleChange}
placeholder="Price"
required
className="rounded border p-3"
/>
<input
name="stock"
type="number"
min="0"
step="1"
value={form.stock}
onChange={handleChange}
placeholder="Stock quantity"
required
className="rounded border p-3"
/>
<button
type="submit"
disabled={saving}
className="rounded bg-blue-600 p-3 text-white disabled:opacity-50"
>
{saving
? "Saving..."
: editingId !== null
? "Update Product"
: "Save Product"}
</button>
{editingId !== null && (
<button
type="button"
onClick={handleCancelEdit}
className="rounded bg-gray-500 p-3 text-white"
>
Cancel
</button>
)}

{message && (
<p className="md:col-span-2">{message}</p>
)}
</form>

<table className="w-full text-left">
<thead className="bg-gray-200">
<tr>
<th className="p-3">ID</th>
<th className="p-3">Product Name</th>
<th className="p-3">Description</th>
<th className="p-3">Price</th>
<th className="p-3">Stock</th>

 <th className="p-3">Actions</th>
</tr>
</thead>
<tbody>

{products.map((product) => (
    <tr key={product.id} className="border-t">
   
<td className="p-3">{product.id}</td>
<td className="p-3">{product.name}</td>
<td className="p-3">

{product.description || "-"}
</td>
<td className="p-3">
{Number(product.price).toFixed(2)}
</td>
<td className="p-3">{product.stock}</td>
<td className="p-3">
<button
type="button"
onClick={() => handleEdit(product)}
className="rounded bg-amber-500 px-3 py-2 text-white hover:bg-amber-600"
>
Edit
</button>
</td>
</tr>


))}
</tbody>
</table>
</div>
)}
</div>
);
}
export default App;