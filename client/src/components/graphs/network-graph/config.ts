import { LayoutOptions, Stylesheet } from "cytoscape";
import { colors } from "../../../utils/mui";
import { SelectOption } from "../../../utils/select-option";

export const styleSheets: Stylesheet[] = [
  {
    selector: "node",
    style: {
      backgroundColor: colors.primary,
      label: "data(label)",
      color: colors.white,
    },
  },
  {
    selector: "node:selected",
    style: {
      backgroundColor: colors.warning,
    },
  },
  {
    selector: "edge",
    style: {
      "curve-style": "bezier",
      "target-arrow-color": colors.white,
      "target-arrow-shape": "chevron",
      "arrow-scale": 1.5,
      label: "data(label)",
      color: colors.white,
      "text-rotation": "autorotate",
      "text-background-color": colors.gray,
      "text-background-padding": "5px",
      "text-background-opacity": 1,
    },
  },
  {
    selector: "edge:selected",
    style: {
      "line-color": colors.white,
    },
  },
];

export enum Layout {
  Concentric = "concentric",
  CoSE = "cose",
  Circle = "circle",
  Random = "random",
  Grid = "grid",
  BreadthFirst = "breadthfirst",
}

export const layoutOptions: SelectOption[] = [
  { label: "Concentric", value: Layout.Concentric },
  { label: "CoSE", value: Layout.CoSE },
  { label: "Circle", value: Layout.Circle },
  { label: "Random", value: Layout.Random },
  { label: "Grid", value: Layout.Grid },
  { label: "Breadth First", value: Layout.BreadthFirst },
];

export const layouts: Record<Layout, LayoutOptions> = {
  [Layout.Concentric]: {
    name: "concentric",
    animate: true,
    animationDuration: 1000,
    animationEasing: "ease",
    nodeDimensionsIncludeLabels: true,
    avoidOverlap: true,
  },
  [Layout.CoSE]: {
    name: "cose",
    animate: true,
    animationDuration: 1000,
    animationEasing: "ease",
    nodeDimensionsIncludeLabels: true,
    avoidOverlap: true,
  },
  [Layout.Circle]: {
    name: "circle",
    animate: true,
    animationDuration: 1000,
    animationEasing: "ease",
    nodeDimensionsIncludeLabels: true,
    avoidOverlap: true,
  },
  [Layout.Random]: {
    name: "random",
    animate: true,
    animationDuration: 1000,
    animationEasing: "ease",
  },
  [Layout.Grid]: {
    name: "grid",
    animate: true,
    animationDuration: 1000,
    animationEasing: "ease",
    nodeDimensionsIncludeLabels: true,
    avoidOverlap: true,
  },
  [Layout.BreadthFirst]: {
    name: "breadthfirst",
    animate: true,
    animationDuration: 1000,
    animationEasing: "ease",
    nodeDimensionsIncludeLabels: true,
    avoidOverlap: true,
  },
};
