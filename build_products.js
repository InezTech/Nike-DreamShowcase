const fs = require('fs');
const path = require('path');

const images = [
    "1542291026-7eec264c27ff", // Red
    "1515955656352-a1fa3ffcd111", // White
    "1491553895911-0055eca6402d", // AF1 on foot
    "1556906781-9a412961c28c", // Yellow running
    "1514989940723-e8e51635b782", // Pink
    "1549298916-b41d501d3772", // White red AM
    "1511556532299-8f662fc26c06", // Black AM97
    "1460353581641-37baddab0fa2", // Side profile
    "1579338908476-3a3a1d71a706", // Blue AM
    "1608231387042-66d1773070a5"  // Tick
];

const shoes = [
    { name: "Nike Air Force 1 '07", price: 115 },
    { name: "Nike Air Max 270", price: 160 },
    { name: "Nike Air Max 90", price: 130 },
    { name: "Nike Dunk Low Retro", price: 115 },
    { name: "Nike Air Max 97", price: 175 },
    { name: "Nike Blazer Mid '77 Vintage", price: 105 },
    { name: "Nike Pegasus 40", price: 130 },
    { name: "Nike Invincible 3", price: 180 },
    { name: "Nike Air Max Plus", price: 180 },
    { name: "Nike Vaporfly 3", price: 260 }
];

const categories = {
    men: { categoryPrefix: "Men's" },
    women: { categoryPrefix: "Women's" },
    kids: { categoryPrefix: "Kids'" },
    sale: { categoryPrefix: "Promo" },
    new: { categoryPrefix: "New" }
};

const pagesDir = path.join(__dirname, 'pages');

for (const [key, data] of Object.entries(categories)) {
    const filePath = path.join(pagesDir, `${key}.html`);
    let productsHtml = '<div class="product-grid container">\n';

    for (let i = 0; i < 20; i++) {
        // Offset images randomly-ish per category so they don't all look identical
        const offset = key.length;
        const imgId = images[(i + offset) % images.length];
        const shoe = shoes[(i + (offset * 2)) % shoes.length];
        const itemColorCount = (i % 5) + 1;

        let priceStr = `$${shoe.price}`;
        if (key === 'sale') {
            priceStr = `<span style="text-decoration: line-through; color: #707072; margin-right: 8px;">$${shoe.price}</span> <span style="color: #9e3039;">$${Math.floor(shoe.price * 0.7)}</span>`;
        }

        productsHtml += `
      <a href="#" class="product-card">
          <div class="card-image">
              <img src="https://images.unsplash.com/photo-${imgId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="${shoe.name}" class="product-img">
          </div>
          <div class="product-info">
              <h3 class="product-title">${shoe.name}</h3>
              <p class="product-subtitle">${data.categoryPrefix} Shoes</p>
              <p class="product-colors">${itemColorCount} Colour${itemColorCount > 1 ? 's' : ''}</p>
              <p class="product-price">${priceStr}</p>
          </div>
      </a>
    `;
    }
    productsHtml += '</div>\n';

    let content = fs.readFileSync(filePath, 'utf8');
    // insert before closing </body>
    if (content.includes('</body>')) {
        content = content.replace('</body>', productsHtml + '\n</body>');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${key}.html`);
    }
}
