const PRODUCT_ATTRIBUTE_RULES = {
  tshirts: {
    size: {
      type: "string",
      required: true
    },
    color: {
      type: "string",
      required: true
    },
    material: {
      type: "string",
      required: false
    }
  },

  shirts: {
    size: {
      type: "string",
      required: true
    },
    color: {
      type: "string",
      required: true
    },
    material: {
      type: "string",
      required: true
    }
  },

  pants: {
    waist: {
      type: "number",
      required: true
    },
    length: {
      type: "number",
      required: true
    },
    color: {
      type: "string",
      required: true
    }
  },

  shoes: {
    shoeSize: {
      type: "number",
      required: true
    },
    color: {
      type: "string",
      required: true
    }
  },

  jackets: {
    size: {
      type: "string",
      required: true
    },
    color: {
      type: "string",
      required: true
    },
    material: {
      type: "string",
      required: false
    }
  }
}

module.exports = PRODUCT_ATTRIBUTE_RULES