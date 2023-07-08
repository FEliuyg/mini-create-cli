#!/usr/bin/env node

const minimist = require('minimist');
const fse = require('fs-extra');
const path = require('path');
const prompts = require('prompts');

const argv = minimist(process.argv.slice(2));

async function init() {
  const { template, name } = argv;

  const result = await prompts([
    {
      type: name ? null : 'text',
      name: 'name',
      message: 'please input your project name',
    },
    {
      type: template ? null : 'select',
      name: 'template',
      message: 'please select a template',
      choices: [
        {
          title: 'templateA',
          value: 'a',
        },
        {
          title: 'templateB',
          value: 'b',
        },
      ],
    },
  ]);

  const templateName = template || result.template;
  const projectName = name || result.name;

  const targetDir = path.resolve(process.cwd(), projectName);
  const templateDir = path.resolve(__dirname, `template-${templateName}`);
  fse.copySync(templateDir, targetDir);

  let pkg = JSON.parse(fse.readFileSync(path.resolve(targetDir, 'package.json'), 'utf-8'));
  pkg.name = projectName;
  fse.writeFileSync(path.resolve(targetDir, 'package.json'), JSON.stringify(pkg, null, 2));
}

init();
