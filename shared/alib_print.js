// --- print array to table
var printTable = function(data) {
  var writeRow = function(data, lengths) {
    var output = '';
    for (var i in data) {
      // ┌─┬┐│├┼┤┴└┘
      output += '| ' + data[i];
      var remainingSpace = lengths[i] - data[i].toString().length;
      if (remainingSpace > 0)
        for (var j = 0; j < remainingSpace; j++)
          output += ' ';
      output += ' ';
    }
    output += '|';
    return output;
  }

  var output = '';
  // if (!Array.isArray(data))
  // return new Error('Wrong data format: data is not an array');
  // Get the column names based on the first object. Subsequent object must have the exact same columns and column order
  var columns = [];
  var lengths = {};
  for (var i in data[0]) {
    columns.push(i);
    lengths[i] = i.length;
  }
  // Get the longest string's length for each column, so that we know how many spaces we have to use.
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < columns.length; j++) {
      if (typeof data[i] !== 'object')
        return new Error('Wrong data format: data[' + i + '] is not an object');
      if (typeof data[i][columns[j]] === 'undefined')
        return new Error('Wrong data format: data[' + i + ']["' + columns[j] + '"] doesn\'t exist');
      if (data[i][columns[j]].toString().length > lengths[columns[j]])
        lengths[columns[j]] = data[i][columns[j]].toString().length;
    }
  }

  // Print the first row with the column names
  var firstRow = {};
  for (var i = 0; i < columns.length; i++)
    firstRow[columns[i]] = columns[i];
  output += writeRow(firstRow, lengths) + '\n';

  // Write the title separator row
  var separatorRow = {};
  for (var i = 0; i < columns.length; i++) {
    separatorRow[columns[i]] = '';
    for (var j = 0; j < lengths[columns[i]]; j++)
      // separatorRow[columns[i]] += '═';
      separatorRow[columns[i]] += '=';
  }
  output += writeRow(separatorRow, lengths);

  //Write the rest of the rows
  for (var i = 0; i < data.length; i++)
    output += '\n' + writeRow(data[i], lengths);
  return output;
}

function ascii_table(array, header) {
  var lengths = array[0].map(function(_, i) {
    var col = array.map(function(row) {
      if (row[i] != undefined)
        return row[i].length;
      else
        return 0;
    });
    return Math.max.apply(Math, col);
  });
  array = array.map(function(row) {
    return '| ' + row.map(function(item, i) {
      var size = item.length;
      if (size < lengths[i])
        item += new Array(lengths[i] - size + 1).join(' ');
      return item;
    }).join(' | ') + ' |';
  });
  var sep = '+' + lengths.map(function(length) {
    return new Array(length + 3).join('-');
  }).join('+') + '+';
  if (header)
    return sep + '\n' + array[0] + '\n' + sep + '\n' + array.slice(1).join('\n') + '\n' + sep;
  else
    return sep + '\n' + array.join('\n') + '\n' + sep;
}

// var dum = [2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 12].map(Math.sqrt)
// printArray(dum)
// printArray(dum, 8, [3, 4])
// var dum2 = [
//   [1, 2, 3, 4, 5, 6],
//   [2, 3, 4, 5, 6, 7],
//   [3, 4, 5, 6, 7, 8],
//   [4, 5, 6, 7, 8, 9]
// ]
// printArray(dum2, 4)
// printArray(dum2, 4, [24, 1])
// printArray(dum2, 4, [1, 24])
// printArray(dum2, 4, [6, 4])
// dum2 = map2(dum2, Math.cos)
// printArray(dum2, digits, [6, 4])
// try {
//   printArray(dum2, digits, [3, 7])
// } catch (err) {
//   console.log('Error: wrong dimensions')
// }
// function map2(array2D, func) {
//   var i, result = []
//   for (i = 0; i < array2D.length; i++)
//     result[i] = array2D[i].map(func)
//   return result
// }

// var data = [{
//     id: 1,
//     'Column 1': 'foo',
//     'Column 2': 'bar'
//   },
//   {
//     id: 2,
//     'Column 1': 'bar',
//     'Column 2': 'foo'
//   }
// ];
// console.log(printTable(data));
// console.log(printTable(recs_cnt));
// ascii_table(recs_cnt, recs_cnt)

// --- print array to table
printArray = function(arr, digits, dimxy) {
  var i, j, k, c, rows = arr.length,
    cols = arr[0].length,
    negs = false

  // If no cols, we have a row vect
  if (cols === undefined) {
    cols = rows
    rows = 1
  }

  if (dimxy) {
    rows = dimxy[0]
    cols = dimxy[1]
  }

  // Flatten array for indexing and multi-processing
  arr = flatten(arr)
  if (rows * cols !== arr.length)
    throw new Error("xlen * ylen !== arr.length")
  if (!digits)
    digits = 5
  // Default look for negative numbers
  for (i = 0; i < arr.length; i++) {
    if (arr[i] < 0) {
      negs = true
      digits++
      break
    }
  }

  for (i = 0; i < rows; i++) {
    for (j = 0; j < cols; j++) {
      c = arr[i * cols + j]
      if (negs)
        c = (c > 0 ? ' ' : '') + c.toPrecision(digits).toString()
      else
        c = c.toPrecision(digits).toString()
      if (c.length > digits)
        c = c.slice(0, digits)
      if (c.length <= digits)
        for (k = c.length; k < digits + 1; k++)
          c += " "
      process.stdout.write(c)
    }
    process.stdout.write("\n")
  }

  function flatten(array) {
    var flat = [];
    for (var i = 0, l = array.length; i < l; i++) {
      var type = Object.prototype.toString.call(array[i]).split(' ').pop().split(']').shift().toLowerCase();
      if (type) {
        flat = flat.concat(/^(array|collection|arguments|object)$/.test(type) ? flatten(array[i]) : array[i]);
      }
    }
    return flat;
  }
}

printArray2 = function(arr) {
  try {
    for (var i in arr) console.log("arg " + i + ":\t" + arr[i].substr())
  } catch (e) {
    WScript.echo(e);
  }
}
