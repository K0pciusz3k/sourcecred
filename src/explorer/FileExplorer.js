// @flow
import React, {Component} from "react";
import {buildTree} from "./commitUtils";
import type {CommitData, FileTree} from "./commitUtils";

export class FileExplorer extends Component<{
  selectedPath: string,
  onSelectPath: (newPath: string) => void,
  data: CommitData,
}> {
  render() {
    // within the FileExplorer, paths start with "./", outside they don't
    // which is hacky and should be cleaned up
    const fileNames = Object.keys(this.props.data.fileToCommits).sort();
    const tree = buildTree(fileNames);
    const selectPath = (path) => {
      if (path.startsWith("./")) {
        path = path.slice(2);
      }
      this.props.onSelectPath(path);
    };
    return (
      <div className="file-explorer plugin-pane">
        <h3 style={{textAlign: "center"}}>File Explorer</h3>
        <div style={{fontFamily: "monospace"}}>
          <FileEntry
            alwaysExpand={true}
            name=""
            path="."
            tree={tree}
            onSelectPath={selectPath}
            selectedPath={`./${this.props.selectedPath}`}
          />
        </div>
      </div>
    );
  }
}

class FileEntry extends Component<
  {
    name: string,
    path: string,
    alwaysExpand: boolean,
    tree: FileTree,
    selectedPath: string,
    onSelectPath: (newPath: string) => void,
  },
  {
    expanded: boolean,
  }
> {
  constructor() {
    super();
    this.state = {expanded: false};
  }

  render() {
    const topLevels = Object.keys(this.props.tree);
    const subEntries = topLevels.map((x) => (
      <FileEntry
        key={x}
        name={x}
        path={`${this.props.path}/${x}`}
        alwaysExpand={false}
        tree={this.props.tree[x]}
        selectedPath={this.props.selectedPath}
        onSelectPath={this.props.onSelectPath}
      />
    ));
    const isFolder = topLevels.length > 0 && !this.props.alwaysExpand;
    const toggleExpand = () => this.setState({expanded: !this.state.expanded});
    const isSelected = this.props.path === this.props.selectedPath;
    const selectTarget = isSelected ? "." : this.props.path;
    const onClick = () => this.props.onSelectPath(selectTarget);
    return (
      <div
        className={isSelected ? "selected-path" : ""}
        style={{marginLeft: this.props.path === "." ? 0 : 25}}
      >
        <p>
          {isFolder && (
            <button style={{marginRight: 3}} onClick={toggleExpand}>
              »
            </button>
          )}
          <a href="javascript: void 0" onClick={onClick}>
            {this.props.name}
          </a>
        </p>
        {(this.state.expanded || this.props.alwaysExpand) && subEntries}
      </div>
    );
  }
}
