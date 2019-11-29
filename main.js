'use strict';
const core = require('@actions/core');
const github = require('@actions/github');
const { Toolkit } = require('actions-toolkit');
const tools = new Toolkit();

const toc = require('markdown-toc');
const fs = require('fs');

const mdFilePath = core.getInput('markdown-file-path');
console.log(`target markdown file is ${mdFilePath}.`);

const contents = fs.readFileSync(mdFilePath);
const replaced = toc(contents).insert();
fs.writeFileSync(mdFilePath, replaced);

const newCommits = await tools.github.createCommit({
  owner: tools.context.owner,
  repo: tools.context.repo,
  message: 'update table of contents'
  tree:
  parents:
});



