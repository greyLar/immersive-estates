const { execSync } = require('child_process');

function query(sql) {
  try {
    const cmd = `team-db "${sql.replace(/"/g, '\\"')}"`;
    const output = execSync(cmd);
    return JSON.parse(output.toString());
  } catch (error) {
    console.error(`DB Query Error: ${error.message}`);
    throw error;
  }
}

function execute(sql) {
  try {
    const cmd = `team-db "${sql.replace(/"/g, '\\"')}"`;
    execSync(cmd);
    return true;
  } catch (error) {
    console.error(`DB Execute Error: ${error.message}`);
    throw error;
  }
}

module.exports = { query, execute };
