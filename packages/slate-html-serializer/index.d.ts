import * as React from 'react';
import {
  BlockProperties,
  ValueJSON,
  Value,
  Node as SlateNode,
  Mark,
  Leaf,
} from '@slate-fork/slate';

export interface Rule {
  deserialize?: (
    el: Element,
    next: (elements: Element[] | NodeList | (Node & ChildNode)[]) => any,
  ) => any;
  serialize?: (obj: any, children: string) => React.ReactNode;
}

export interface HtmlOptions {
  rules?: Rule[];
  defaultBlock?: BlockProperties | string;
  parseHtml?: (html: string) => HTMLElement;
}

export default class Html {
  constructor(options?: HtmlOptions);

  deserialize(html: string, options: {toJSON: true}): ValueJSON;
  deserialize(html: string, options?: {toJSON?: false}): Value;

  serialize(value: Value, options?: {render?: true}): string;
  serialize(value: Value, options: {render: false}): Element[];

  protected rules: Rule[];
  protected defaultBlock: BlockProperties;
  protected parseHtml: (html: string) => HTMLElement;

  protected deserializeElements: (elements: HTMLElement[]) => SlateNode[];
  protected deserializeElement: (element: HTMLElement) => any;
  protected deserializeMark: (mark: Mark) => SlateNode[];

  protected serializeNode: (node: SlateNode) => string;
  protected serializeLeaf: (leaf: Leaf) => string;
  protected serializeString: (string: string) => string;
}