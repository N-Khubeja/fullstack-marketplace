// function parseProductAttributes(req, res, next) {
//     const attributes = req.body.attributes;

//     if (!attributes) {
//         return res.status(400).json({
//             message: "there are no attributes"
//         });
//     }

//     if (typeof attributes === "string") {
//         try {
//             req.body.attributes = JSON.parse(attributes);
//         } catch (error) {
//             return res.status(400).json({
//                 message: "attributes must be valid JSON"
//             });
//         }
//     }

//     next();
// }

// module.exports = parseProductAttributes

function parseProductAttributes(req, res, next) {
  const { attributes } = req.body

  if (
    attributes !== undefined &&
    typeof attributes === "string"
  ) {
    try {
      req.body.attributes = JSON.parse(attributes)
    } catch {
      return res.status(400).json({
        message: "attributes must be valid JSON"
      })
    }
  }

  next()
}

module.exports = parseProductAttributes