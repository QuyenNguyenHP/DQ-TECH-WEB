// Laptop brands shown in the catalogue filter and the admin product form.
// The value is stored on the product as `brand`.
export const LAPTOP_BRANDS = ["Apple", "ASUS", "Dell", "HP", "Lenovo", "MSI"];

/** Brand comparison ignores case, so "Asus" and "ASUS" match. */
export function isSameBrand(a: string | undefined, b: string | undefined): boolean {
  return (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase();
}
