import { polygon } from "@turf/helpers";
import { glob } from "glob";
import { loadJsonFileSync } from "load-json-file";
import path from "path";
import test from "tape";
import { writeJsonFileSync } from "write-json-file";
import { polygonSmooth } from "./index";

test("turf-polygon-smooth", (t) => {
  glob
    .sync(path.join(__dirname, "test", "in", "*.json"))
    .forEach((filepath) => {
      // Inputs
      const geojson = loadJsonFileSync(filepath);
      const options = geojson.options || {};
      const iterations = options.iterations || 3;

      // Results
      const results = polygonSmooth(geojson, { iterations });

      // Save Results
      const out = filepath.replace(
        path.join("test", "in"),
        path.join("test", "out")
      );
      if (process.env.REGEN) writeJsonFileSync(out, results);
      t.deepEqual(results, loadJsonFileSync(out), path.parse(filepath).name);
    });
  t.end();
});

test("turf-polygon-smooth -- options are optional", (t) => {
  t.doesNotThrow(() =>
    polygonSmooth(
      polygon([
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
      ])
    )
  );
  t.end();
});
