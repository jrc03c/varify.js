const { isEqual, random, round, seed } = require("@jrc03c/js-math-tools")
const fs = require("node:fs")
const makeKey = require("@jrc03c/make-key")
const parse = require("./parse")
const stringify = require("./stringify")
const unindent = require("./unindent")

const files = []

test("tests that objects and arrays with circular references can be stringified", () => {
  const arr = [2, 3, 4]
  arr.push([[arr]])
  arr.push([5, 6, [arr]])
  const arrTrue = `[2,3,4,[["<reference to \\"/\\">"]],[5,6,["<reference to \\"/\\">"]]]`
  expect(stringify(arr)).toBe(arrTrue)

  const obj = { hello: { to: { the: "world" } } }
  obj.hello.to.copy = obj.hello.to
  obj["self"] = { x: { y: { z: obj.hello.to } } }
  obj["arr"] = { values: [2, obj.hello.to, 3, 4] }
  const objTrue = `{"hello":{"to":{"the":"world","copy":"<reference to \\"/hello/to\\">"}},"self":{"x":{"y":{"z":{"the":"world","copy":"<reference to \\"/hello/to\\">"}}}},"arr":{"values":[2,{"the":"world","copy":"<reference to \\"/hello/to\\">"},3,4]}}`
  expect(stringify(obj)).toBe(objTrue)
})

test("tests that indentation can be applied when stringifying", () => {
  function dubble(x) {
    return x * 2
  }

  seed(12345)

  const variables = [
    0,
    1,
    2.3,
    -2.3,
    Infinity,
    -Infinity,
    NaN,
    "foo",
    true,
    false,
    null,
    undefined,
    Symbol.for("Hello, world!"),
    x => x,
    new Date(round(random() * 10e13)),
    dubble,
  ]

  const obj = {}
  const frontier = [obj]

  for (let i = 0; i < 100; i++) {
    const endpoint = frontier[parseInt(random() * frontier.length)]

    const value =
      random() < 1 / 4
        ? []
        : random() < 1 / 4
        ? {}
        : variables[parseInt(random() * variables.length)]

    if (endpoint instanceof Array) {
      endpoint.push(value)
    } else {
      const key = makeKey(parseInt(random() * 5) + 1)
      endpoint[key] = value
    }

    if (
      typeof value === "object" &&
      value !== null &&
      !(value instanceof Date)
    ) {
      frontier.push(value)
    }
  }

  const xPred = stringify(obj, "  ")

  const xTrue = unindent(`
    {
      "43": 2.3,
      "dgg4": [
        0,
        false,
        0,
        {
          "2": [
            "Symbol(@undefined)"
          ],
          "5": "x => x",
          "49": [
            [],
            {},
            1,
            []
          ],
          "1d": "x => x",
          "2e03": 1,
          "e2b": [
            -2.3,
            "Symbol(@Infinity)",
            [],
            2.3,
            "x => x"
          ],
          "d0e58": "x => x",
          "fd0cc": {
            "3897": "Symbol(@undefined)",
            "bf": {
              "14": [
                -2.3
              ],
              "ab1": [],
              "8fg": "x => x"
            },
            "aa9d": "Symbol(@undefined)",
            "c7": [
              [
                [
                  2.3,
                  [
                    [
                      true
                    ],
                    []
                  ],
                  {}
                ]
              ],
              []
            ],
            "a9gb": {
              "1c9": [
                "Symbol(@NegativeInfinity)"
              ],
              "0568": "Symbol(Hello, world!)"
            }
          },
          "1dfce": 0,
          "7c": {
            "0c6fc": {},
            "d7f2d": {}
          },
          "f7dd": [
            1
          ]
        },
        [
          {
            "9": "Symbol(@NegativeInfinity)",
            "189f": {
              "9": [],
              "d6": {
                "9deg1": "foo",
                "d3f": [
                  {
                    "9": "foo",
                    "962": [],
                    "2g2bb": {},
                    "4b8ce": "Symbol(Hello, world!)",
                    "e777": 0
                  },
                  2.3
                ]
              },
              "9a1": [
                {}
              ]
            },
            "f1": {
              "7c4": {
                "a": 0
              }
            }
          },
          {
            "5": 1,
            "62859": {},
            "begd": "2365-02-16T23:47:32.955Z"
          },
          [],
          {},
          true,
          [
            2.3
          ]
        ],
        "function dubble(x) {\\n    return x * 2;\\n  }",
        {
          "55da": [
            [
              "Symbol(@NaN)",
              null,
              true,
              []
            ],
            false,
            "Symbol(@NaN)"
          ],
          "87b8": [
            {
              "4f": "foo",
              "ad": "x => x"
            }
          ]
        },
        []
      ],
      "73aa2": "Symbol(@NaN)",
      "eff": "x => x",
      "f95": "function dubble(x) {\\n    return x * 2;\\n  }",
      "d8g3": "2365-02-16T23:47:32.955Z",
      "6ea": 1
    }
  `).trim()

  expect(xPred).toBe(xTrue)
})

test("tests that values can be stringified and parsed back to their original value", () => {
  const variables = [
    0,
    1,
    2.3,
    -2.3,
    Infinity,
    -Infinity,
    NaN,
    "foo",
    true,
    false,
    null,
    undefined,
    Symbol.for("Hello, world!"),
    [2, 3, 4],
    [
      [2, 3, 4],
      [5, 6, 7],
    ],
    { hello: "world" },
    new Uint8Array([1, 3, 5, 7, 9]),
    { buffer: new Uint8Array([1, 3, 5, 7, 9]) },
  ]

  variables.forEach(value => {
    const s = stringify(value)
    const p = parse(s)
    expect(isEqual(value, p)).toBe(true)
  })
})

test("tests that stringification and parsing work when writing to and reading from disk", () => {
  seed(12345)

  const variables = [
    0,
    1,
    2.3,
    -2.3,
    Infinity,
    -Infinity,
    NaN,
    "foo",
    true,
    false,
    null,
    undefined,
    Symbol.for("Hello, world!"),
    new Date(round(random() * 10e13)),
  ]

  const obj = {}
  const frontier = [obj]

  for (let i = 0; i < 100; i++) {
    const endpoint = frontier[parseInt(random() * frontier.length)]

    const value =
      random() < 1 / 4
        ? []
        : random() < 1 / 4
        ? {}
        : variables[parseInt(random() * variables.length)]

    if (endpoint instanceof Array) {
      endpoint.push(value)
    } else {
      const key = makeKey(parseInt(random() * 5) + 1)
      endpoint[key] = value
    }

    if (
      typeof value === "object" &&
      value !== null &&
      !(value instanceof Date)
    ) {
      frontier.push(value)
    }
  }

  const objTrue = parse(stringify(obj))
  const out = stringify(obj)
  const filename = makeKey(8) + ".json"
  files.push(filename)
  fs.writeFileSync(filename, out, "utf8")
  const objPred = parse(fs.readFileSync(filename, "utf8"))
  expect(isEqual(objPred, objTrue)).toBe(true)
})

afterAll(() => {
  files.forEach(file => {
    fs.unlinkSync(file)
  })
})

test("tests that core value types can be stringified correctly", () => {
  // prettier-ignore
  function dubble(x) { return 2 * x }
  const now = new Date()

  const selfReferencer = [2, 3, 4]
  selfReferencer.push(selfReferencer)

  const buffer = new ArrayBuffer(256)
  const f64Array = new Float64Array(buffer)

  f64Array.forEach((v, i) => {
    f64Array[i] = Math.random()
  })

  const ui8Array = new Uint8Array(buffer)

  const pairs = [
    [0, "0"],
    [1, "1"],
    [2.3, "2.3"],
    [-2.3, "-2.3"],
    [Infinity, '"Symbol(@Infinity)"'],
    [-Infinity, '"Symbol(@NegativeInfinity)"'],
    [NaN, '"Symbol(@NaN)"'],
    ["foo", '"foo"'],
    [true, "true"],
    [false, "false"],
    [null, "null"],
    [undefined, '"Symbol(@undefined)"'],
    [Symbol.for("Hello, world!"), '"Symbol(Hello, world!)"'],
    [[2, 3, 4], "[2,3,4]"],
    [
      [
        [2, 3, 4],
        [5, 6, 7],
      ],
      "[[2,3,4],[5,6,7]]",
    ],
    [x => x, '"x => x"'],
    [dubble, JSON.stringify(dubble.toString())],
    [{ hello: "world" }, '{"hello":"world"}'],
    [now, JSON.stringify(now.toJSON())],
    [selfReferencer, '[2,3,4,"<reference to \\"/\\">"]'],
    [
      new Uint8Array([2, 3, 4]),
      '{"values":[2,3,4],"Symbol(@TypedArrayConstructor)":"Uint8Array"}',
    ],
    [
      buffer,
      `{"values":${JSON.stringify(
        Array.from(ui8Array)
      )},"Symbol(@TypedArrayConstructor)":"ArrayBuffer"}`,
    ],
  ]

  pairs.forEach(pair => {
    expect(stringify(pair[0])).toBe(pair[1])
  })
})