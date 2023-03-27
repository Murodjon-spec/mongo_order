function generateID() {
  console.log(Math.floor(Date.now() / 777));
  return Date.now().toString(16).slice(4);
}
console.log(generateID());
