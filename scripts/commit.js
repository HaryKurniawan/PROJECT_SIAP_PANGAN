const inquirer = require('inquirer');
const { execSync } = require('child_process');

async function promptCommit() {
  const { type, scope, message } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Pilih tipe commit:',
      choices: [
        { name: 'feat:     Fitur baru', value: 'feat' },
        { name: 'fix:      Perbaikan bug', value: 'fix' },
        { name: 'docs:     Perubahan dokumentasi', value: 'docs' },
        { name: 'chore:    Perubahan task, build, atau tooling', value: 'chore' }
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
