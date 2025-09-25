"""
Diagram rendering service using mingrammer/diagrams.
"""

import json
import time
import importlib
from pathlib import Path
from typing import Dict, Any, Optional, List, Tuple, Set

from config.settings import settings


class DiagramService:
    """Service for rendering Azure architecture diagrams."""
    
    def __init__(self):
        """Initialize the diagram service."""
        self.output_dir = Path(settings.DIAGRAM_OUTPUT_DIR)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Icon validation settings
        self.allowed_icon_prefixes = settings.ALLOWED_ICON_PREFIXES
        self.fallback_icon = settings.FALLBACK_ICON
        self.annotate_fallback = settings.ANNOTATE_FALLBACK
        self.strict_whitelist: Optional[Set[str]] = None
    
    def render_diagram(
        self, 
        spec: Dict[str, Any], 
        base_filename_prefix: str = "azure_arch"
    ) -> Dict[str, Any]:
        """
        Render a diagram from a specification.
        
        Args:
            spec: The diagram specification
            base_filename_prefix: Prefix for the output filename
            
        Returns:
            Dictionary containing render results
        """
        try:
            clusters, nodes, edges, title, direction = self._validate_spec(spec)
            return self._create_diagram(
                clusters, nodes, edges, title, direction, base_filename_prefix
            )
        except Exception as e:
            return {"ok": False, "error": repr(e)}
    
    def extract_json_objects(self, text: str) -> List[Dict]:
        """
        Extract top-level JSON objects from arbitrary text.
        
        Args:
            text: Text content that may contain JSON objects
            
        Returns:
            List of parsed JSON objects
        """
        objects: List[Dict] = []
        depth = 0
        start = None
        in_str = False
        esc = False
        
        for i, ch in enumerate(text or ""):
            if ch == '"' and not esc:
                in_str = not in_str
            if ch == "\\" and not esc:
                esc = True
                continue
            esc = False
            if in_str:
                continue
            if ch == "{":
                if depth == 0:
                    start = i
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0 and start is not None:
                    chunk = (text or "")[start : i + 1]
                    try:
                        objects.append(json.loads(chunk))
                    except Exception:
                        pass
                    start = None
        return objects
    
    def extract_spec_from_text(self, content: str) -> Optional[Dict[str, Any]]:
        """
        Extract diagram specification from text content.
        
        Args:
            content: Text content containing diagram specification
            
        Returns:
            Diagram specification dict or None if not found
        """
        for obj in self.extract_json_objects(content or ""):
            if isinstance(obj, dict) and "nodes" in obj and "edges" in obj:
                return obj
            if isinstance(obj, dict) and "arguments" in obj:
                args = obj["arguments"]
                if isinstance(args, str):
                    try:
                        args = json.loads(args)
                    except Exception:
                        args = None
                if isinstance(args, dict) and "nodes" in args and "edges" in args:
                    return args
        return None
    
    def _validate_spec(self, spec: Dict[str, Any]) -> Tuple[List, List, List, str, str]:
        """
        Validate and normalize diagram specification.
        
        Args:
            spec: The diagram specification to validate
            
        Returns:
            Tuple of (clusters, nodes, edges, title, direction)
        """
        title = spec.get("title") or "Azure Architecture"
        direction = spec.get("direction") or "LR"
        if direction not in ("LR", "TB", "RL", "BT"):
            direction = "LR"
        
        clusters = spec.get("clusters") or []
        nodes = spec.get("nodes") or []
        edges = spec.get("edges") or []
        
        # Validate limits
        if len(nodes) > settings.MAX_NODES:
            raise ValueError(f"Too many nodes (limit {settings.MAX_NODES}).")
        if len(edges) > settings.MAX_EDGES:
            raise ValueError(f"Too many edges (limit {settings.MAX_EDGES}).")
        
        # Validate node IDs are unique
        ids = set()
        for n in nodes:
            nid = n["id"]
            if nid in ids:
                raise ValueError(f"Duplicate node id: {nid}")
            ids.add(nid)
            if "label" in n and n["label"]:
                n["label"] = n["label"][:120]
        
        # Validate edges reference existing nodes
        for e in edges:
            if e["source"] not in ids or e["target"] not in ids:
                raise ValueError(f"Edge refers to unknown node(s): {e}")
            if "label" in e and e["label"]:
                e["label"] = e["label"][:120]
        
        return clusters, nodes, edges, title, direction
    
    def _create_diagram(
        self, 
        clusters: List, 
        nodes: List, 
        edges: List, 
        title: str, 
        direction: str, 
        base_filename_prefix: str
    ) -> Dict[str, Any]:
        """
        Create the actual diagram using mingrammer/diagrams.
        
        Args:
            clusters: List of cluster definitions
            nodes: List of node definitions
            edges: List of edge definitions
            title: Diagram title
            direction: Layout direction
            base_filename_prefix: Filename prefix
            
        Returns:
            Dictionary with creation results
        """
        from diagrams import Diagram, Cluster, Edge
        
        stamp = int(time.time())
        base_name = f"{base_filename_prefix}_{stamp}"
        file_png = self.output_dir / f"{base_name}.png"
        
        cluster_objs: Dict[str, Any] = {}
        node_objs: Dict[str, Any] = {}
        
        with Diagram(
            title,
            filename=str(self.output_dir / base_name),
            outformat="png",
            show=False,
            direction=direction,
            graph_attr={"pad": "0.2", "splines": "ortho"}
        ):
            # Create clusters
            for c in clusters:
                cid = c["id"]
                label = c.get("label") or cid
                cluster_objs[cid] = Cluster(label)
            
            # Partition nodes by cluster
            cluster_to_nodes: Dict[str, List[Dict[str, Any]]] = {}
            unclustered: List[Dict[str, Any]] = []
            
            for n in nodes:
                if n.get("cluster"):
                    cluster_to_nodes.setdefault(n["cluster"], []).append(n)
                else:
                    unclustered.append(n)
            
            # Create unclustered nodes
            for n in unclustered:
                cls, used_fallback = self._get_icon_class_with_fallback(n["icon"])
                label = n.get("label") or n["id"]
                if used_fallback and self.annotate_fallback:
                    label = f"{label} (generic)"
                node_objs[n["id"]] = cls(label)
            
            # Create clustered nodes
            for cid, nlist in cluster_to_nodes.items():
                if cid not in cluster_objs:
                    cluster_objs[cid] = Cluster(cid)
                with cluster_objs[cid]:
                    for n in nlist:
                        cls, used_fallback = self._get_icon_class_with_fallback(n["icon"])
                        label = n.get("label") or n["id"]
                        if used_fallback and self.annotate_fallback:
                            label = f"{label} (generic)"
                        node_objs[n["id"]] = cls(label)
            
            # Create edges
            for e in edges:
                src = node_objs[e["source"]]
                tgt = node_objs[e["target"]]
                lbl = e.get("label")
                if lbl:
                    src >> Edge(label=lbl) >> tgt
                else:
                    src >> tgt
        
        if not file_png.exists():
            return {"ok": False, "error": "Diagram not produced"}
        
        return {
            "ok": True,
            "path": str(file_png),
            "url": f"/static/diagrams/{file_png.name}",
            "summary": {
                "title": title,
                "direction": direction,
                "nodes": len(nodes),
                "edges": len(edges),
                "clusters": len(clusters),
            },
        }
    
    def _import_icon_class_or_none(self, qualified_path: str) -> Optional[Any]:
        """
        Import an icon class by its qualified path.
        
        Args:
            qualified_path: Fully qualified class path
            
        Returns:
            The imported class or None if import fails
        """
        try:
            parts = qualified_path.split(".")
            module_path, class_name = ".".join(parts[:-1]), parts[-1]
            mod = importlib.import_module(module_path)
            return getattr(mod, class_name, None)
        except Exception:
            return None
    
    def _get_icon_class_with_fallback(self, qualified_path: str) -> Tuple[Any, bool]:
        """
        Get icon class with fallback to default if not found.
        
        Args:
            qualified_path: Fully qualified class path
            
        Returns:
            Tuple of (icon_class, used_fallback_flag)
        """
        # Check prefix allowlist
        if not qualified_path.startswith(self.allowed_icon_prefixes):
            cls = self._import_icon_class_or_none(self.fallback_icon)
            if cls is None:
                raise RuntimeError(f"Fallback icon '{self.fallback_icon}' could not be imported.")
            return cls, True
        
        # Check strict allowlist if configured
        if self.strict_whitelist is not None and qualified_path not in self.strict_whitelist:
            cls = self._import_icon_class_or_none(self.fallback_icon)
            if cls is None:
                raise RuntimeError(f"Fallback icon '{self.fallback_icon}' could not be imported.")
            return cls, True
        
        # Try to import the requested icon
        cls = self._import_icon_class_or_none(qualified_path)
        if cls is not None:
            return cls, False
        
        # Fall back to default icon
        cls = self._import_icon_class_or_none(self.fallback_icon)
        if cls is None:
            raise RuntimeError(f"Fallback icon '{self.fallback_icon}' could not be imported.")
        return cls, True


# Global service instance
diagram_service = DiagramService()