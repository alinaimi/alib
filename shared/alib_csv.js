//--- CSV 2 2D Array
// Return array of string values, or NULL if CSV string not well formed.
function CSVtoArray(text) {
  var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
  var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
  // Return NULL if input string is not well formed CSV string.
  if (!re_valid.test(text)) return null;
  var a = []; // Initialize array to receive values.
  text.replace(re_value, // "Walk" the string using replace with callback.
    function(m0, m1, m2, m3) {
      // Remove backslash from \' in single quoted values.
      if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
      // Remove backslash from \" in double quoted values.
      else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
      else if (m3 !== undefined) a.push(m3);
      return ''; // Return empty string.
    });
  // Handle special case of empty last value.
  if (/,\s*$/.test(text)) a.push('');
  return a;
};

function csv2arr(csv) {
  rows = csv.split("\n");

  return rows.map(function(row) {
    return row.split(",");
  });
};

function csv2arr2(csv) {
  var ret = [];
  var rows = csv.split("\n");

  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].split(",");
    ret.push(cells);
  }
  return ret;
};

read_csv = function(file_name) {
  if (typeof js_engine != 'undefined')
    // if (js_engine) //js_engine = 0: node, 1: JScript
    str = fs.OpenTextFile(file_name, 1).ReadAll();
  else
    str = require('fs').readFileSync(file_name, 'utf8');
  // console.log(str);
  // var ret = str.split(',');
  var ret = csv2arr2(str);
  return ret;
}

// find obj by key in array of objs
findObjectByKey = function(array, key, value) { // convert to prototype
  for (var i = 0; i < array.length; i++)
    if (array[i][key] === value)
      return array[i];
  return null;
}

sum_2darr = function(arr) {
  var siz_m = arr.length
  var siz_n = arr[0].length
  // console.log(siz_m + 'x' + siz_n);
  // console.log(arr)
  ret = {};
  ret.sum_o = [0, 0, 0, 0];
  ret.sum_d = [0, 0, 0, 0];
  for (var i = 0; i < siz_m; i++) {
    for (var j = 0; j < siz_n; j++) {
      ret.sum_o[i] += arr[i][j]
      ret.sum_d[j] += arr[i][j]
    }
    // console.log('sum ins  '+i+': '+ret.sum_o[i] );
    // console.log('sum outs '+i+': '+ret.sum_d[i] );
  }
  return ret;
}

save = function(s, fn) {
  // var fn = "c:/turn_out.csv"
  // var fn = "out.csv"
  // console.log(fn);
  // process.stdout.write(s)
  if (jscript) {
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    //object.OpenTextFile(filename[, iomode[, create[, format]]])
    var ForReading = 1,
      ForWriting = 2,
      ForAppending = 8; // iomode 1: read, 2: write, 8: append
    var TristateUseDefault = -2,
      TristateTrue = -1,
      TristateFalse = 0; // format
    // var fh = fs.CreateTextFile(fn, 2, true);
    // var fh = fs.CreateTextFile(fn, 8, true);
    var fh = fs.OpenTextFile(fn, ForAppending, true);
    // fh.WriteLine(s);
    fh.Write(s);
    fh.Close();
    // var fso  = new ActiveXObject("Scripting.FileSystemObject"); 
    // var fh = fso.CreateTextFile(fn, 8, true); // 1: read, 2: write, 8: append
    // fh.WriteLine("Some text goes here..."); 
    // fh.Close(); 
  } else {
    fs = require('fs');
    // fs.writeFile(fn, s, function(err) {
    fs.appendFileSync(fn, s, 'utf8', function(err) {
      if (err) return console.log(err);
      // console.log('Hello World > helloworld.txt');
    });
    // fs.writeFile('helloworld.txt', 'Hello World!', function (err) {
    //   if (err) return console.log(err);
    //   console.log('Hello World > helloworld.txt');
    // });
  }
}

log_save = function(s, fn, show) {
  if (show) process.stdout.write(s)
  save(s, fn)
}
