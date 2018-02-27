// @flow

export type ID = {
  pluginName: string,
  repositoryName: string,
  name: string,
};

export type GraphNode<T> = {
  id: ID,
  edges: ID[],
  payload: T,
};

export type GraphEdge<T> = {
  id: ID,
  sourceId: ID,
  destId: ID,
  weight: number,
  payload: T,
};

export type Graph = {
  nodes: {[stringID: string]: GraphNode<mixed>},
  edges: {[stringID: string]: GraphEdge<mixed>},
};

export function idToString(id: ID) {
  if (id.pluginName.includes("$")) {
    const escaped = JSON.stringify(id.pluginName);
    throw new Error(`id.pluginName must not include "\$": ${escaped}`);
  }
  if (id.repositoryName.includes("$")) {
    const escaped = JSON.stringify(id.repositoryName);
    throw new Error(`id.repositoryName must not include "\$": ${escaped}`);
  }
  if (id.name.includes("$")) {
    const escaped = JSON.stringify(id.name);
    throw new Error(`id.name must not include "\$": ${escaped}`);
  }
  return `${id.pluginName}\$${id.repositoryName}\$${id.name}`;
}

export function stringToID(string: string) {
  const parts = string.split("$");
  if (parts.length !== 3) {
    const escaped = JSON.stringify(string);
    throw new Error(`Input should have exactly two \$s: ${escaped}`);
  }
  return {
    pluginName: parts[0],
    repositoryName: parts[1],
    name: parts[2],
  };
}

export function mergeGraphs(
  g1: Graph,
  g2: Graph,
  nodeReducer: (GraphNode<mixed>, GraphNode<mixed>) => GraphNode<mixed>,
  edgeReducer: (GraphEdge<mixed>, GraphEdge<mixed>) => GraphEdge<mixed>
) {
  const result = {nodes: {...g1.nodes}, edges: {...g1.edges}};
  Object.keys(g2.nodes).forEach((key) => {
    if (key in result.nodes) {
      result.nodes[key] = nodeReducer(g1.nodes[key], g2.nodes[key]);
    }
  });
  Object.keys(g2.edges).forEach((key) => {
    if (key in result.edges) {
      result.edges[key] = edgeReducer(g1.edges[key], g2.edges[key]);
    }
  });
  return result;
}

export function mergeGraphsConsistent(g1: Graph, g2: Graph) {
  function confluentNodeReducer(
    a: GraphNode<mixed>,
    b: GraphNode<mixed>
  ): GraphNode<mixed> {
    if (JSON.stringify(a) === JSON.stringify(b)) {
      return a;
    } else {
      throw new Error(`distinct nodes with id ${stringToID(a.id)}`);
    }
  }
  function confluentEdgeReducer(
    a: GraphEdge<mixed>,
    b: GraphEdge<mixed>
  ): GraphEdge<mixed> {
    if (JSON.stringify(a) === JSON.stringify(b)) {
      return a;
    } else {
      throw new Error(`distinct edge with id ${stringToID(a.id)}`);
    }
  }
  return mergeGraphs(g1, g2, confluentNodeReducer, confluentEdgeReducer);
}

export function mergeGraphsArbitrary(g1: Graph, g2: Graph) {
  return mergeGraphs(g1, g2, (a, b) => b, (a, b) => b);
}
