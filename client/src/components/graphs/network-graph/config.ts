import { Core, LayoutOptions, NodeCollection, Stylesheet } from "cytoscape";
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
  {
    selector: "node.highlight",
    style: {
      "border-color": colors.white,
      "border-width": "2px",
    },
  },
  {
    selector: "node.semitransparent",
    // @ts-expect-error Incorrect style types in Cytoscape
    style: { opacity: "0.5" },
  },
  {
    selector: "edge.highlight",
    style: { "mid-target-arrow-color": colors.white },
  },
  {
    selector: "edge.semitransparent",
    // @ts-expect-error Incorrect style types in Cytoscape
    style: { opacity: "0.2" },
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

const baseLayout: Omit<LayoutOptions, "name"> = {
  animate: true,
  animationDuration: 1000,
  animationEasing: "ease",
  nodeDimensionsIncludeLabels: true,
  avoidOverlap: true,
};

export const layouts: Record<Layout, LayoutOptions> = {
  [Layout.Concentric]: {
    name: "concentric",
    ...baseLayout,
  },
  [Layout.CoSE]: {
    name: "cose",
    ...baseLayout,
  },
  [Layout.Circle]: {
    name: "circle",
    ...baseLayout,
  },
  [Layout.Random]: {
    name: "random",
    animate: true,
    animationDuration: 1000,
    animationEasing: "ease",
  },
  [Layout.Grid]: {
    name: "grid",
    ...baseLayout,
  },
  [Layout.BreadthFirst]: {
    name: "breadthfirst",
    ...baseLayout,
  },
};

export const highlightNeighbours = (cy: Core) => {
  cy.on("mouseover", "node", (e) => {
    const sel = e.target as NodeCollection;
    cy.elements()
      .difference(sel.outgoers().or(sel.incomers()))
      .not(sel)
      .addClass("semitransparent");
    sel
      .addClass("highlight")
      .outgoers()
      .or(sel.incomers())
      .addClass("highlight");
  });
  cy.on("mouseout", "node", (e) => {
    const sel = e.target as NodeCollection;
    cy.elements().removeClass("semitransparent");
    sel
      .removeClass("highlight")
      .outgoers()
      .or(sel.incomers())
      .removeClass("highlight");
  });
};
