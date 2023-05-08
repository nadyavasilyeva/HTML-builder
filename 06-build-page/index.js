const fs = require('fs/promises');
const path = require('path');
const assetsDir = path.join(__dirname, 'assets');
const componentsDir = path.join(__dirname, 'components');
const styleDir = path.join(__dirname, 'styles');
const indexPath = path.join(__dirname, 'project-dist', 'index.html');
const stylePath = path.join(__dirname, 'project-dist', 'style.css');
const templatePath = path.join(__dirname, 'template.html');


async function buildPage() {
  await fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
  await copyDirectory(assetsDir, path.join(__dirname, 'project-dist', 'assets'));
  const template = await fs.readFile(templatePath, 'utf-8');
  const regex = /{{(.+?)}}/g;
  const tags = template.match(regex);
  const components = await Promise.all(
    tags.map(tag => {
      const componentName = tag.replace(/[{}]/g, '');
      const componentPath = path.join(componentsDir, `${componentName}.html`);
      return fs.readFile(componentPath, 'utf-8');
    })
  );

  let index = template;
  components.forEach((component, i) => {
    index = index.replace(tags[i], component);
  });

  await fs.writeFile(indexPath, index);
  const styleFiles = await fs.readdir(styleDir);
  const styles = await Promise.all(
    styleFiles.map(file => fs.readFile(path.join(styleDir, file), 'utf-8'))
  );
  await fs.writeFile(stylePath, styles.join('\n'));
  console.log('Готово!');
}

async function copyDirectory(src, dest) {
  const entries = await fs.readdir(src, { withFileTypes: true });
  await fs.mkdir(dest, { recursive: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

buildPage();