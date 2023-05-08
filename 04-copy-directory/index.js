const path = require('path');
const fs = require('fs/promises');

(async function () {
  try {
    await fs.rm(path.join(__dirname, 'files-copy'), { 
        recursive: true,
        force: true 
    });
    await fs.mkdir(path.join(__dirname, 'files-copy'), {
        recursive: true,
    });

    const items = await fs.readdir(path.join(__dirname, 'files'));

    for (let item of items) {
      const srcPath = path.join(path.join(__dirname, 'files'), item);
      const targetPath = path.join(path.join(__dirname, 'files-copy'), item);
      await fs.copyFile(srcPath, targetPath);
    }

    console.log('Создана копия директории!');

  } catch (err) {
    console.log(`Ошибка: ${err.message}`);
  }
})
();