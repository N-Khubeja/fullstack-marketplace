// export const PRODUCT_ATTRIBUTE_RULES = {
//   clothing: {
//     tshirts: {
//       size: { type: "string", required: true },
//       color: { type: "string", required: true },
//       material: { type: "string", required: true }
//     },

//     shirts: {
//       size: { type: "string", required: true },
//       color: { type: "string", required: true },
//       material: { type: "string", required: true }
//     },

//     pants: {
//       waist: { type: "number", required: true },
//       length: { type: "number", required: true },
//       color: { type: "string", required: true }
//     },

//     shoes: {
//       shoeSize: { type: "number", required: true },
//       color: { type: "string", required: true }
//     },

//     jackets: {
//       size: { type: "string", required: true },
//       color: { type: "string", required: true },
//       material: { type: "string", required: true }
//     }
//   }
// }

interface IProductAttributeRule {
  type: "string" | "number";
  required: boolean;
  inputType: "select" | "text" | "number";
  options?: readonly (string | number)[];
}

interface IProductAttributeSubcategory {
  [attributeName: string]: IProductAttributeRule;
}

interface IProductAttributeRules {
  [category: string]: {
    [subcategory: string]: IProductAttributeSubcategory;
  };
}



export const PRODUCT_ATTRIBUTE_RULES: IProductAttributeRules= {
  clothing: {
    tshirts: {
      size: {
        type: "string",
        required: true,
        inputType: "select",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
      },
      color: {
        type: "string",
        required: true,
        inputType: "select",
        options: [
          "Black",
          "White",
          "Red",
          "Blue",
          "Green",
          "Gray",
          "Yellow",
          "Pink",
          "Brown",
        ],
      },
      material: {
        type: "string",
        required: true,
        inputType: "select",
        options: [
          "Cotton",
          "Polyester",
          "Wool",
          "Linen",
          "Silk",
          "Denim",
          "Leather",
          "Nylon",
          "Spandex",
        ],
      },
    },

    shirts: {
      size: {
        type: "string",
        required: true,
        inputType: "select",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
      },
      color: {
        type: "string",
        required: true,
        inputType: "select",
        options: [
          "Black",
          "White",
          "Red",
          "Blue",
          "Green",
          "Gray",
          "Yellow",
          "Pink",
          "Brown",
        ],
      },
      material: {
        type: "string",
        required: true,
        inputType: "select",
        options: [
          "Cotton",
          "Polyester",
          "Linen",
          "Silk",
          "Denim",
          "Wool",
        ],
      },
    },

    pants: {
      waist: {
        type: "number",
        required: true,
        inputType: "select",
        options: Array.from({ length: 25 }, (_, i) => 26 + i * 2),
      },
      length: {
        type: "number",
        required: true,
        inputType: "select",
        options: Array.from({ length: 19 }, (_, i) => 28 + i * 2),
      },
      color: {
        type: "string",
        required: true,
        inputType: "select",
        options: [
          "Black",
          "White",
          "Blue",
          "Navy",
          "Gray",
          "Beige",
          "Brown",
          "Green",
        ],
      },
    },

    shoes: {
      shoeSize: {
        type: "number",
        required: true,
        inputType: "select",
        options: Array.from({ length: 31 }, (_, i) => i + 30),
      },
      color: {
        type: "string",
        required: true,
        inputType: "select",
        options: [
          "Black",
          "White",
          "Red",
          "Blue",
          "Gray",
          "Brown",
          "Beige",
          "Green",
        ],
      },
    },

    jackets: {
      size: {
        type: "string",
        required: true,
        inputType: "select",
        options: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
      },
      color: {
        type: "string",
        required: true,
        inputType: "select",
        options: [
          "Black",
          "White",
          "Red",
          "Blue",
          "Green",
          "Gray",
          "Brown",
          "Beige",
        ],
      },
      material: {
        type: "string",
        required: true,
        inputType: "select",
        options: [
          "Cotton",
          "Polyester",
          "Wool",
          "Leather",
          "Denim",
          "Nylon",
        ],
      },
    },
  },
} as const;