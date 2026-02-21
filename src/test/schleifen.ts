let istFehler = false;

for (let i = 0; i < 10; i++) {
  if (i % 2 == 0) console.log(i);
  if (i === 7) {
    istFehler = true;
    break;
  }
}
