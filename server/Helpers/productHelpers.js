export function loadData(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function saveData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function generateId(products) {
  return products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
}

export function validateProduct(body, isUpdate = false) {
  const errors = [];

  const requiredFields = ["name", "price", "stock", "category"];
  if (!isUpdate) {
    requiredFields.forEach((field) => {
      if (
        body[field] === undefined ||
        body[field] === null ||
        body[field] === ""
      ) {
        errors.push(`"${field}" is required`);
      }
    });
  }

  if (body.name && typeof body.name !== "string") {
    errors.push('"name" must be a string');
  }
  if (body.price !== undefined) {
    body.price = Number(body.price);
    if (isNaN(body.price) || body.price <= 0) {
      errors.push('"price" must be a positive number');
    }
  }

  if (body.stock !== undefined) {
    body.stock = Number(body.stock);
    if (isNaN(body.stock) || body.stock < 0) {
      errors.push('"stock" must be a non-negative number');
    }
  }

  if (body.category && typeof body.category !== "string") {
    errors.push('"category" must be a string');
  }

  if (body.description && typeof body.description !== "string") {
    errors.push('"description" must be a string');
  }

  return errors;
}
