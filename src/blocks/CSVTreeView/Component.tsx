import React from 'react'
import { parse } from 'csv-parse/sync';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

export type CSVTreeViewBlockProps = {
  csv: string;
}

function* generateSubsets(arg: string[][]) {
  let lastChange = 0;
  let currentString = arg[0][0];
  for (let i = 0; i < arg.length; i += 1) {
    if (arg[i][0] !== currentString) {
      yield { name: currentString, children: arg.slice(lastChange, i).map((row) => row.slice(1)) };
      lastChange = i;
    }
    currentString = arg[i][0];
  }
  yield { name: currentString, children: arg.slice(lastChange).map((row) => row.slice(1)) };
}


const RecursiveTreeView: React.FC<{ records: string[][], indexPath?: string }> = ({ records, indexPath = "" }) => {

  const subsets = Array.from(generateSubsets(records));

  return (
    <div style={{ marginLeft: '20px' }}>
      {subsets.map(({ name, children }, index) => {
        const n_children = new Set(children.map((row) => row[0])).size;

        if (name) {
          return (
            <TreeItem
              itemId={`item${indexPath}-${index}`} label={name + ((children.length > 1 || children[0].length > 0) ? ` (${n_children})` : "")}
            >
              {(children.length > 1 || children[0].length > 0) &&
                <RecursiveTreeView records={children} indexPath={`${indexPath}-${index}`} />
              }
            </TreeItem>
          );
        }
      })}
    </div>
  );
}


export const CSVTreeViewBlock: React.FC<CSVTreeViewBlockProps> = ({ csv }) => {
  const records = parse<string[], unknown>(csv, { column: false });

  return (
    <div>
      <SimpleTreeView disableSelection>
        <RecursiveTreeView records={records} />
      </SimpleTreeView>
    </div>
  )
}
