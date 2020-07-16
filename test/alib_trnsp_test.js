var alib = require('../node/alib');
require("../JSON-js/json2.js")

//--- example Fratar
fratar_test = function() {
  var recs_cnt = [
    [1, 100, 200, 10],
    [1, 0, 0, 0],
    [0, 10, 0, 20],
    [1, 2, 3, 4]
  ];
  var totalIns = [100, 200, 300, 400]; // total in links turn volumes in the count
  var totalOuts = [500, 600, 700, 800]; // total out links turn volumes in the count

  var fratar_res = fratar(recs_cnt, totalIns, totalOuts);
  console.log('fratar_res: ')
  console.log(fratar_res);
}

if (!Array.prototype.includes_ali) {
  Array.prototype.includes_ali = function(key, val) {
    for (var i = this.length; i--;)
      if (val === this[i][key])
        return true;
    return false;
  }
}

load_intersections = function(csv_file, dir_file, turn_file) {
  // console.log(turn_file);
  var ints = []
  var dir_map2 = {
    EB: 0,
    NB: 1,
    WB: 2,
    SB: 3
  }
  var dir_map = {
    W: 0,
    S: 1,
    E: 2,
    N: 3
  }

  // get dir
  var dir_int = []
  var csv_link_vol = read_csv(csv_file); // link A,B,A_B,I4AMVOL,I4PMVOL,I424VOL
  var dir_csv = read_csv(dir_file)

  var csv_turn_vol = read_csv(turn_file) // turn A,B,C,AM,MD,PM,NT
  console.log("csv_turn_vol.length: " + csv_turn_vol.length)

  // init
  for (var i in dir_csv) {
    var id = parseInt(dir_csv[i][0])
    var B = parseInt(dir_csv[i][3])
    var obj = findObjectByKey(ints, 'id', id);
    if (!obj) { // intersection doesn't exist, add

      ints.push({
        "id": id,
        "A": 0,
        "B": B,
        "C": 0,
        "AMVol": [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        "PMVol": [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        "AMTot_inp": [0, 0, 0, 0],
        "PMTot_inp": [0, 0, 0, 0],
        "AMTot_out": [0, 0, 0, 0],
        "PMTot_out": [0, 0, 0, 0],
        "W": [],
        "S": [],
        "E": [],
        "N": [],
        "dir_name": {
          "W": "",
          "S": "",
          "E": "",
          "N": ""
        }
      });
      // obj = findObjectByKey(ints, 'B', B);
    }
  }

  for (var i in dir_csv) {
    var id = parseInt(dir_csv[i][0])
    var B = parseInt(dir_csv[i][3])
    // var dir0 = findObjectByKey(dir_int, 'B', B);
    var dir0 = findObjectByKey(dir_int, 'id', id);
    // console.log(dir0);
    if (!dir0) { // intersection doesn't exist, add
      dir_int.push({
        id: id,
        "B": B,
        "dir": []
      })
      // dir0 = findObjectByKey(dir_int, 'B', B);
      dir0 = findObjectByKey(dir_int, 'id', id);
    }
    if (dir0) {
      var aa = dir_csv[i][2] // A 6049
      var bb = dir_csv[i][3] // A 6053
      var dir_nam = dir_csv[i][4].replace(/\n/g, '').replace(/\r/g, '') // A 6053
      if (aa > 0 && bb > 0) {
        var key = (aa * 1).toString() + '_' + (bb * 1).toString() // AB 6049_6053
        var key_rev = (bb * 1).toString() + '_' + (aa * 1).toString() // BA 6053_6049
        var side = "_"
        switch (dir_csv[i][1]) { // EB (actually should be west link, so means west link)
          case "EB":
            side = "W"
            break;
          case "NB":
            side = "S"
            break;
          case "WB":
            side = "E"
            break;
          case "SB":
            side = "N"
            break;
        }

        dir0.dir[key] = side;
        dir0.dir[key_rev] = side;

        var obj = findObjectByKey(ints, 'id', dir0.id); ////// ERR should be dir0?
        if (obj) {
          var dir_AB = dir0.dir[key]
          switch (dir_AB) {
            case "W":
              if (!obj.W.includes(parseInt(aa))) obj.W.push(parseInt(aa))
              obj.dir_name.W = dir_nam
              break;
            case "S":
              if (!obj.S.includes(parseInt(aa))) obj.S.push(parseInt(aa))
              obj.dir_name.S = dir_nam
              break;
            case "E":
              if (!obj.E.includes(parseInt(aa))) obj.E.push(parseInt(aa))
              obj.dir_name.E = dir_nam
              break;
            case "N":
              if (!obj.N.includes(parseInt(aa))) obj.N.push(parseInt(aa))
              obj.dir_name.N = dir_nam
              break;
          }
        }
      }
    }
  }
  console.log(dir_int);

  console.log('intersections: ' + dir_int.length)

  for (var ii = 1; ii <= dir_int.length; ii++) {
    var dir0 = findObjectByKey(dir_int, 'id', ii);
    if (dir0) {
      for (i in csv_turn_vol) {
        var B = parseInt(csv_turn_vol[i][1])
        if (B == dir0.B) {
          var obj = findObjectByKey(ints, 'id', ii);
          obj.A = parseInt(csv_turn_vol[i][0])
          obj.C = parseInt(csv_turn_vol[i][2])
          var link_AB = (obj.A).toString() + '_' + (obj.B).toString()
          var link_BC = (obj.B).toString() + '_' + (obj.C).toString()
          if (dir0) {
            var dir_AB = dir0.dir[link_AB]
            var dir_BC = dir0.dir[link_BC]
            if (dir_AB) {
              obj.id = parseInt(dir0.id)

              var mtx_i = dir_map[dir_AB]
              var mtx_j = dir_map[dir_BC]

              if (mtx_i < 4 && mtx_j < 4) {
                obj.AMVol[mtx_i][mtx_j] = parseFloat(csv_turn_vol[i][3])
                obj.PMVol[mtx_i][mtx_j] = parseFloat(csv_turn_vol[i][5])
              }
            }
          }
        }
      }
      for (i in csv_link_vol) {
        var A = parseInt(csv_link_vol[i][0])
        var B = parseInt(csv_link_vol[i][1])
        var AB = A.toString() + '_' + B.toString()
        if (B == dir0.B) {
          var dir_AB = dir0.dir[AB]
          var mtx_i = dir_map[dir_AB]

          if (mtx_i < 4) {
            obj.AMTot_inp[mtx_i] += parseInt(csv_link_vol[i][3])
            obj.PMTot_inp[mtx_i] += parseInt(csv_link_vol[i][4])
          }
        }
        if (A == dir0.B) {
          var dir_AB = dir0.dir[AB]
          var mtx_i = dir_map[dir_AB]
          if (mtx_i < 4) {
            obj.AMTot_out[mtx_i] += parseInt(csv_link_vol[i][3])
            obj.PMTot_out[mtx_i] += parseInt(csv_link_vol[i][4])
          }
        }
      }
    }
  }
  return ints;
}

mtx_quickfix = function(mtx) {
  for (var i = 0; i < 4; i++) {
    var row = 0
    for (var j = 0; j < 4; j++) {
      if (mtx[i][j] != 0) {
        row = 1
        break;
      }
    }
    if (!row) // at lease one cell non-zero for quick fix
      mtx[i][3] = 100
  }

  for (var j = 0; j < 4; j++) {
    var col = 0
    for (var i = 0; i < 4; i++) {
      if (mtx[i][j] != 0) {
        col = 1
        break;
      }
    }
    if (!col) // at lease one cell non-zero for quick fix
      mtx[3][j] = 100
  }

  return mtx;
}

prj_maglev_ = function(csv_turn_vol, csv_dir, csv_link_vol) {
  ints = load_intersections(csv_link_vol, csv_dir, csv_turn_vol);
  console.log('length of ints : ' + ints.length);

  var fn = get_fn(csv_link_vol)
  var fn_am = "out/" + fn.n + "_am.csv"
  var fn_pm = "out/" + fn.n + "_pm.csv"
  var fn_json_pre_fratar = "out/int_pre_fratar_" + fn.n + ".json"
  var fn_json = "out/int_" + fn.n + ".json"
  del(fn_am)
  del(fn_pm)
  del(fn_json)
  int_json = []
  log_save("int,W,S,E,N\n", fn_am)
  log_save("int,W,S,E,N\n", fn_pm)

  for (i in ints) {
    var int0 = ints[i]
    var int0 = findObjectByKey(ints, 'id', parseInt(i) + 1); ////// ERR should be dir0?
    log_save(JSON.stringify(int0, null, 2), fn_json_pre_fratar)
    int_json.push(int0)
    console.log(int0)
    if (int0) {
      fratar_run_n_save(int0.AMVol, int0.AMTot_inp, int0.AMTot_out, int0, fn_am);
      fratar_run_n_save(int0.PMVol, int0.PMTot_inp, int0.PMTot_out, int0, fn_pm);
    }
  }

  log_save(JSON.stringify(int_json, null, 2), fn_json)
}

fratar_run_n_save = function(recs_cnt, totalIns, totalOuts, int0, fn) {
  var fratar_res = fratar(recs_cnt, totalIns, totalOuts);
  var show = false;
  var str = ""
  var sum_in = 0
  var sum_out = 0
  var delim = ',' //',\t'

  for (var i = 0; i < 4; i++) {
    sum_in += totalIns[i]
    sum_out += totalOuts[i]
  }
  var inp_eq_out = ((sum_in - sum_out) * (sum_in - sum_out)) < 100 ? "" : "nb"
  str += '' + int0.id.toString() + '@' + int0.B.toString() + inp_eq_out + ','
  str += (int0.W[0] ? int0.W[0] : 0).toString() + ','
  str += (int0.S[0] ? int0.S[0] : 0).toString() + ','
  str += (int0.E[0] ? int0.E[0] : 0).toString() + ','
  str += (int0.N[0] ? int0.N[0] : 0).toString() + '\n'
  // str+='sum\n'
  var dir_map3 = {
    0: "W",
    1: "S",
    2: "E",
    3: "N"
  }

  str +=  int0.id.toString() + ","
  for (var y = 0; y < 4; y++)
    if (y < 3) str += dir_map3[y] + delim;
    else str += dir_map3[y];
  str += "\n"

  for (var y = 0; y < 4; y++) {
    var origin_node = int0[dir_map3[y]][0] ? int0[dir_map3[y]][0] : 0
    str += origin_node.toString() + delim
    for (var x = 0; x < 4; x++) {
      var val = parseInt(fratar_res[y][x]).toString()
      if (x < 3) str += val + delim
      else
        str += val
    }
    str += '\n'
  }
  str += ',,,,\n'
  log_save(str, fn, show)
}
