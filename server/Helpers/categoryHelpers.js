export const validateCategory = (categoryData, isUpdate = false) => {
  const errors = [];
  const { name } = categoryData;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("Category name must be at least 2 characters");
  }

  if (!isUpdate) {
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      errors.push("Category name already exists");
    }
  }

  return errors;
};
