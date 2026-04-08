async function main() {
  const res = await fetch('http://localhost:3000/he/catalog/product/4');
  console.log('STATUS:', res.status);
  const text = await res.text();
  console.log('BODY:', text.substring(0, 1000));
}
main();
