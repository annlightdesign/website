async function main() {
  const res = await fetch('http://localhost:3000/he/catalog/product/4');
  const text = await res.text();
  console.log("Includes title:", text.includes('Trimless 5W'));
}
main();
