const inquirer = require('inquirer');
const { execSync } = require('child_process');

async function promptCommit() {
  const { type, scope, message } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Pilih tipe commit:',
      choices: [
        { name: 'feat:      Fitur baru', value: 'feat' },
        { name: 'fix:       Perbaikan bug', value: 'fix' },
        { name: 'docs:      Perubahan dokumentasi', value: 'docs' },
        { name: 'style:     Perubahan formatting, missing semi-colons, dll', value: 'style' },
        { name: 'refactor:  Perubahan code bukan perbaikan bug atau fitur baru', value: 'refactor' },
        { name: 'perf:      Perubahan code untuk meningkatkan performa', value: 'perf' },
        { name: 'test:      Menambah atau memperbaiki test', value: 'test' },
        { name: 'build:     Perubahan sistem build atau dependency eksternal', value: 'build' },
        { name: 'ci:        Perubahan konfigurasi/script CI', value: 'ci' },
        { name: 'chore:     Perubahan task, build, atau tooling (bukan src/test)', value: 'chore' },
        { name: 'revert:    Membatalkan commit sebelumnya', value: 'revert' }
      ]
    },
    {
      type: 'input',
      name: 'scope',
      message: 'Scope atau module (opsional):'
    },
    {
      type: 'input',
      name: 'message',
      message: 'Pesan commit singkat:',
      validate: (input) => input.length > 0 ? true : 'Pesan tidak boleh kosong'
    }
  ]);

  const commitMessage = `${type}${scope ? `(${scope})` : ''}: ${message}`;

  try {
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  } catch (err) {
    console.error('Gagal melakukan commit.');
    process.exit(1);
  }
}

promptCommit();
