const products = Array.from(
  { length: 55 },
  (_, index) => {
    const number = index + 1

    return {
      name: `Test T-Shirt ${number}`,
      slug: `test-tshirt-${number}`,
      description:
        `Test marketplace product number ${number}`,
      price: 20 + number,
      category: "clothing",
      subcategory: "tshirts",
      stock: 5 + number,
      attributes: {
        size: ["S", "M", "L", "XL"][index % 4],
        color: [
          "Black",
          "White",
          "Blue",
          "Green"
        ][index % 4],
        material: "Cotton"
      },
      images: [],
      author: null,
      visibility: "public",
      isActive: true
    }
  }
)

module.exports = products