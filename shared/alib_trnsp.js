//--- Fratar

// goals: totalIns, totalOuts
fratar = function(recs_cnt, totalIns, totalOuts) {
  itr_max=50
  var ret2 = {};
  var siz_m = recs_cnt.length
  var siz_n = recs_cnt[0].length
  var coef_m = [0, 0, 0, 0];
  var coef_n = [0, 0, 0, 0];
  // var err = [0, 0, 0, 0];
  var ar = recs_cnt //just an initializer

  for (var itr = 0; itr <= itr_max; itr++) {
    var err = 0
    var sum = sum_2darr(ar)
    // console.log(sum);
    for (var i = 0; i < siz_m; i++) {
      coef_m[i] = sum.sum_o[i] == 0 ? 1 : totalIns[i] / sum.sum_o[i]
      coef_n[i] = sum.sum_d[i] == 0 ? 1 : totalOuts[i] / sum.sum_d[i]
    }
    // console.log(coef_m);
    // console.log(coef_n);

    for (var i = 0; i < siz_m; i++)
      for (var j = 0; j < siz_n; j++)
        ar[i][j] = ar[i][j] * coef_m[i];

    // console.log('--- 1');
    if (itr==itr_max) break; // so for inbalanced sums, the results will mathch the horizontal sums for maglev proj
    // console.log(ar);
    var sum2 = sum_2darr(ar)
    // console.log(sum_2darr(ar));
    // console.log(sum2);
    for (var i = 0; i < siz_m; i++) {
      coef_m[i] = sum2.sum_o[i] == 0 ? 1 : totalIns[i] / sum2.sum_o[i]
      coef_n[i] = sum2.sum_d[i] == 0 ? 1 : totalOuts[i] / sum2.sum_d[i]
    }
    // console.log('--- 3');
    // console.log(coef_m);
    // console.log(coef_n);

    for (var i = 0; i < siz_m; i++)
      for (var j = 0; j < siz_n; j++)
        ar[i][j] = ar[i][j] * coef_n[j];

    for (var i = 0; i < siz_m; i++) {
      err += Math.abs(sum2.sum_o[i] - totalIns[i]) + Math.abs(sum2.sum_d[i] - totalOuts[i])
    }
    // console.log('itr'+itr+' convergecy: ' + err);
  }
  // console.log(ar);
  return ar;
}
