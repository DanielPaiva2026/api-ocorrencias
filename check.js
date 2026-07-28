const { NodeSSH } = require('./node_modules/node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({host: '72.62.142.112', username: 'root', password: 'Dd6nx8js#2025'});
    
    console.log("Checking built JS for NEXT_PUBLIC_API_URL...");
    const { stdout, stderr } = await ssh.execCommand('docker exec ocorencia-alpiserra_painel_ocorrencia.1.87zlxvpeci5vyiva45uyqk363 grep -r "ocorencia-alpiserra-api-ocorrencia" .next/static/');
    console.log("STDOUT:", stdout);
    
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
