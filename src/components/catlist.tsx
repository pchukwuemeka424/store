import React from 'react';

export default function Catlist({ product }) {
    return (
        <select
            id="category"
            name="category"
            defaultValue={product?.category || ""}
            className="w-full px-4 py-2 border rounded-lg mt-2"
        >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home & Kitchen</option>
            <option value="toys">Toys</option>
            <option value="beauty">Beauty & Personal Care</option>
            <option value="sports">Sports & Outdoors</option>
            <option value="automotive">Automotive</option>
            <option value="books">Books</option>
            <option value="health">Health & Wellness</option>
            <option value="office">Office Supplies</option>
            <option value="garden">Garden & Outdoor</option>
            <option value="pets">Pet Supplies</option>
            <option value="groceries">Groceries</option>
            <option value="music">Musical Instruments</option>
            <option value="travel">Travel & Luggage</option>
        </select>
    );
}
