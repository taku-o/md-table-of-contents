'use strict';
const core = require('@actions/core');
const github = require('@actions/github');

const toc = require('markdown-toc');
const fs = require('fs');

const mdFilePath = core.getInput('markdown-file-path');
console.log(`target markdown file is ${mdFilePath}.`);

    const contents = fs.readFileSync(mdFilePath);
    const replaced = toc(contents).insert();
    fs.writeFileSync(mdFilePath, replaced);

// commit
// push
// success

