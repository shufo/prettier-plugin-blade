import path from "path";
import fs from "fs";
import prettier from "prettier";

describe("formatter test", () => {
  const fixturesDir = path.resolve(__dirname, "fixtures");
  const formattedFixturesDir = path.resolve(__dirname, "fixtures", "formatted");
  const fixtureDirEntries = fs.readdirSync(fixturesDir, {
    withFileTypes: true,
  });
  const fixtures = fixtureDirEntries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);

  fixtures.forEach((fixture) => {
    test.concurrent(`can format fixture ${fixture}`, function () {
      const content = fs
        .readFileSync(path.resolve(fixturesDir, fixture))
        .toString("utf-8");
      const result = prettier.format(content, {
        plugins: [path.resolve(__dirname, "../")],
        parser: "blade",
        pluginSearchDirs: [path.resolve(__dirname, "../")],
      });
      const expected = fs
        .readFileSync(
          path.resolve(formattedFixturesDir, `formatted.${fixture}`)
        )
        .toString("utf-8");
      expect(result).toEqual(expected);
    });
  });
});

describe("broken text test", () => {
  const fixturesDir = path.resolve(__dirname, "error-fixtures");

  test.concurrent(`can not format fixture`, function () {
    const content = fs
      .readFileSync(path.resolve(fixturesDir, "syntax.error.blade.php"))
      .toString("utf-8");
    const f = () => {
      prettier.format(content, {
        plugins: [path.resolve(__dirname, "../")],
        parser: "blade",
        pluginSearchDirs: [path.resolve(__dirname, "../")],
      });
    };
    expect(f).toThrowError("SyntaxError");
  });
});

describe("option test", () => {
  const fixturesDir = path.resolve(__dirname, "fixtures", "formattedWithOption");
  const formattedFixturesDir = path.resolve(
    __dirname,
    "fixtures",
    "formattedWithOption"
  );

  test.concurrent(`can format fixture with options`, function () {
    const content = fs
      .readFileSync(path.resolve(fixturesDir, "index.blade.php"))
      .toString("utf-8");
    const result = prettier.format(content, {
      plugins: [path.resolve(__dirname, "../")],
      parser: "blade",
      pluginSearchDirs: [path.resolve(__dirname, "../")],
      tabWidth: 2,
    });
    const expected = fs
      .readFileSync(path.resolve(formattedFixturesDir, `index.blade.php`))
      .toString("utf-8");
    expect(result).toEqual(expected);
  });

  test.concurrent(`can format fixture with sort options`, function () {
    const content = fs
      .readFileSync(path.resolve(fixturesDir, "tailwindcss.blade.php"))
      .toString("utf-8");

    const plugin = require(path.resolve(__dirname, "../"));

    const result = prettier.format(content, {
      plugins: [{ ...plugin }],
      parser: "blade",
      pluginSearchDirs: [path.resolve(__dirname, "../")],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      sortTailwindcssClasses: true,
    });
    const expected = fs
      .readFileSync(path.resolve(formattedFixturesDir, `formatted.tailwindcss.blade.php`))
      .toString("utf-8");
    expect(result).toEqual(expected);
  });

  test.concurrent(`can format fixture with singleAttributePerLine options`, function () {
    const content = fs
      .readFileSync(path.resolve(fixturesDir, "single_attribute_per_line.blade.php"))
      .toString("utf-8");

    const plugin = require(path.resolve(__dirname, "../"));

    const result = prettier.format(content, {
      plugins: [{ ...plugin }],
      parser: "blade",
      pluginSearchDirs: [path.resolve(__dirname, "../")],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      singleAttributePerLine: true,
    });
    const expected = fs
      .readFileSync(path.resolve(formattedFixturesDir, `formatted.single_attribute_per_line.blade.php`))
      .toString("utf-8");
    expect(result).toEqual(expected);
  });
});
