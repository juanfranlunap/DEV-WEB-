

var sieve = function (n) {
  "use strict";

  var array = [],
    primes = [],
    i,
    j;


  for (i = 2; i <= n; i++) {
    array[i] = true;
  }

  for (i = 2; i * i <= n; i++) {
    if (array[i]) {
      for (j = i * i; j <= n; j += i) {
        array[j] = false;
      }
    }
  }

  for (i = 2; i <= n; i++) {
    if (array[i]) primes.push(i);
  }

  return primes;
};

document.getElementById("btn").addEventListener("click", function () {
  var num = parseInt(document.getElementById("num").value);
  if (isNaN(num) || num < 2) {
    document.getElementById("primes").textContent = "Please enter a number greater than 1.";
    return;
  }
  var primes = sieve(num);
  document.getElementById("primes").textContent = primes.join(", ");
});


