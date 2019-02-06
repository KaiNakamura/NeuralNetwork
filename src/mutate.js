function normal(mean, std) {
    var x = 0;
    for (var i = 1; i <= 12; i++) {
       x += Math.random();
    };
    return (x - 6) * std + mean;
}

function mutate(rate, val) {
  if(Math.random() < rate) {
    return val + normal(0, 0.1);
  }
  else {
    return val;
  }
}
