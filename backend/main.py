from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any

app = FastAPI()

# ── CORS ──────────────────────────────────────────────────────────────────────
# Allow any origin to call this API (useful for separated deployments).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request schema ─────────────────────────────────────────────────────────────

class PipelineRequest(BaseModel):
    nodes: list[Any]
    edges: list[Any]


# ── DAG detection ──────────────────────────────────────────────────────────────

def is_dag(nodes: list, edges: list) -> bool:
    """
    Returns True if the directed graph formed by `edges` is a DAG (no cycles).
    Uses Kahn's algorithm (topological sort via in-degree tracking).

    Each edge is expected to have 'source' and 'target' fields (ReactFlow format).
    Node ids come from each node's 'id' field.
    """
    node_ids = {node["id"] for node in nodes}

    # Build adjacency list and in-degree map
    adj: dict[str, list[str]] = {nid: [] for nid in node_ids}
    in_degree: dict[str, int] = {nid: 0 for nid in node_ids}

    for edge in edges:
        src = edge.get("source")
        tgt = edge.get("target")
        # Only count edges whose endpoints exist in our node set
        if src in node_ids and tgt in node_ids:
            adj[src].append(tgt)
            in_degree[tgt] += 1

    # Kahn's algorithm: start with nodes that have no incoming edges
    queue = [nid for nid, deg in in_degree.items() if deg == 0]
    visited_count = 0

    while queue:
        node = queue.pop()
        visited_count += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If we visited every node, there are no cycles → it's a DAG
    return visited_count == len(node_ids)


# ── Endpoints ──────────────────────────────────────────────────────────────────

@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse")
def parse_pipeline(pipeline: PipelineRequest):
    """
    Accepts a ReactFlow pipeline (nodes + edges) and returns:
      - num_nodes : total number of nodes
      - num_edges : total number of edges
      - is_dag    : whether the graph is a directed acyclic graph
    """
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag = is_dag(pipeline.nodes, pipeline.edges)

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": dag,
    }
