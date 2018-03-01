// @flow

import type {Node, Edge, Graph} from './graph';

export const GITHUB_PLUGIN_NAME = "sourcecred/github-beta";

export type NodeType = "PULL_REQUEST" | "ISSUE" | "COMMENT" | "USER";

export type GithubNode = Node & {
  nodeType: NodeType
}

export type BaseIssueNode = GitHubNode & {
  title: string,
  isClosed: boolean,
  number: number,
  url: string,
};

export type IssueNode = BaseIssueNode & {
  nodeType: "ISSUE",
};

export type PullRequestNode = IssueNode & {
  nodeType: "PULL_REQUEST",
  isMerged: boolean,
};

export type CommentNode = GitHubNode & {
  body: string,
  url: string,
};

export type UserNode = GitHubNode & {
  userName: string,
};

const FIRST_COMMENT_ID_SUFFIX = '/comment';
const ISSUE_AUTHORSHIP_ID_SUFFIX = '/author';
const COMMENT_AUTHORSHIP_ID_SUFFIX = '/author';
export function parseIssue(repositoryName: string, issueJSON):
    [Node<IssuePayload>, Node<CommentPayload>, Edge<ReferencePayload>] {
  const issueID = makeid(issueJSON.id.toString(), repositoryName);
  const issueNode = {
    id: issueID,
    nodeType: "ISSUE",
    title: issueJSON.title,
    isClosed: issueJSON.state === "closed",
    number: issueJSON.number,
    url: issueJSON.url,
  };
  const commentID = makeid(issueID.name + FIRST_COMMENT_ID_SUFFIX, repositoryName);
  const commentNode = {
    id: commentID,
    body: issueJSON.body,
    url: issueJSON.url,
  }
  const userJSON = issueJSON.user;
  const userID = makeid(userJSON.id.toString(), repositoryName);
  const userNode = {
    id: userID,
    userName: userJSON.login,
  }
  const issueAuthorEdge = {
    id: makeID(issueID.name + AUTHORSHIP_INFIX + userID.name, repositoryName),
    src: issueID,
    dest: userID,
    weight: 1,
  }
  const commentAuthorEdge
}

function makeid(name: string, repositoryName: string): ID {
  return {
    pluginName: GITHUB_PLUGIN_NAME,
    repositoryName,
    name,
  }
}

export function gitHubPluginGraph(repositoryName: string, githubData): Graph {
  const nodes: Node<mixed>[] = [];
  const edges: Edge<mixed>[] = [];

}
export function processIssue(githubIssue): Node<IssuePayload>, Node<CommentPayload>, Edge<ReferencePayload> {
  const issueNode: Node<IssuePayload> = {
    id: issueID,
    repositoryName: repositoryName
}

export type ReviewState = "APPROVED" | "COMMENTED" | "CHANGES_REQUESTED";
export type CommentPayload = {
  body: string,
  date: number,
  state: ?ReviewState,
};

export type UserPayload = {
  githubUserId: number,
};

export type GithubNodePayload = {
  type: NodeType,
  subpayload: PullRequestPayload | IssuePayload | CommentPayload | UserPayload,
};

export type EdgeType = "AUTHOR" | "REFERENCE";

export type AuthorPayload = {
  // Issue/PR/Comment -> User
};

export type ReferencePayload = {};
