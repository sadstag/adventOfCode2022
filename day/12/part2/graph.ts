import dijkstra from "https://deno.land/x/dijkstra/mod.ts";
import { canPass, ElevationMap, Location } from "./elevationMap.ts";

type GraphItem = Record<string, number>;
type Graph = Record<string, GraphItem>;

const locationToNodeId = ([x, y]: Location): string => xyToNodeId(x, y);
const xyToNodeId = (x: number, y: number): string => `[${x},${y}]`;

const buildGraph = (eMap: ElevationMap): Graph => {
  const { elevations, width, height } = eMap;
  const graph: Graph = {};
  for (let y = 0; y < eMap.height; y++) {
    for (let x = 0; x < eMap.width; x++) {
      const item: GraphItem = {};
      if (y > 0 && canPass(x, y, x, y - 1, elevations)) {
        // link to north
        item[xyToNodeId(x, y - 1)] = 1;
      }
      if (y < height - 1 && canPass(x, y, x, y + 1, elevations)) {
        // link to north
        item[xyToNodeId(x, y + 1)] = 1;
      }
      if (x > 0 && canPass(x, y, x - 1, y, elevations)) {
        // link to north
        item[xyToNodeId(x - 1, y)] = 1;
      }
      if (x < width - 1 && canPass(x, y, x + 1, y, elevations)) {
        // link to north
        item[xyToNodeId(x + 1, y)] = 1;
      }
      graph[xyToNodeId(x, y)] = item;
    }
  }
  return graph;
};

export const computeShortestPathLength = (
  eMap: ElevationMap,
  start: Location
): number => {
  const g = buildGraph(eMap);
  let path;
  try {
    path = dijkstra.find_path(
      g,
      locationToNodeId(start),
      locationToNodeId(eMap.end)
    );
  } catch (_) {
    // no path found
    return eMap.width * eMap.height; // cannot be longer
  }
  return path.length - 1; // counting traversed edges
};
