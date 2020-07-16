/*&@set @=%~f0&@echo on &@color F3 &cls &&@title %~n0 (%*)        &::██👩‍✈️██

:: ---
:: Put batch file commands here
:: ---

@call alib.cmd %* &@goto :eof &::██🍵██*/

// ---
// Put javascript codes here
// ---

// --- UI
var name = InputBox2('Hi.\nWhat is your name?', "Title");
MsgBox("Ali")

printArray2(argv)

// --- encr
console.log("guid: " + guid());
console.log(Base64.decode(Base64.encode("ali")));
console.log("MD5: " + MD5("ali"));

var key = simpleCrypto.generateKey();
var encrypted = simpleCrypto.encrypt(pass = "ali", key);
console.log("Encrypted String: " + encrypted + "\nDecrypted String: " + simpleCrypto.decrypt(encrypted, key))

var jsonObj = {
  "id": 123,
  "parent": {
    "bool": true,
    "child": {
      "children": ["x", "y"], // array
      "str": "ali"
    }
  }
}
print(jsonObj);

// --- Env
set("z1", "1")
set2("z2", "2")
print_env()
print(env("%ComputerName%"))

// --- convert
office2pdf("c:/test.docx")

// --- DT
console.log(new Date().dt());
var dt = new Date();
console.log(jalali(dt))

// --- net
download('https://code.jquery.com/jquery-3.5.1.min.js', "c:/jquery-3.5.1.min.js")

var objArray = [{
    id: 0,
    name: 'Object 0',
    otherProp: '321'
  },
  {
    id: 1,
    name: 'O1',
    otherProp: '648'
  },
  {
    id: 2,
    name: 'Another Object',
    otherProp: '850'
  },
  {
    id: 3,
    name: 'Almost There',
    otherProp: '046'
  },
  {
    id: 4,
    name: 'Last Obj',
    otherProp: '984'
  }
];

var obj = findObjectByKey(objArray, 'id', 3);
console.log(obj);
myArray = [{
  'id': '73',
  'foo': 'bar'
}, {
  'id': '45',
  'foo': 'bar'
}]

console.log(Object.keys(myArray));
console.log(Object.keys(objArray));

var arr = [{
    key1: 'value1',
    b: 2
  },
  {
    key2: 'value2',
    b: 4
  }
];
console.log(arr[0].key1);

pause()
