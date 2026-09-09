const fs = require('fs');
let code = fs.readFileSync('src/upload/upload.controller.ts', 'utf8');

code = code.replace(
  /throw new UnauthorizedException\('.*?'\);/,
  "res.status(401).send('PIN invalido');\n      return;"
);

code = code.replace(
  /if \(!fs.existsSync\(uploadsDir\)\) \{\s*throw new BadRequestException\('.*?'\);\s*\}/,
  `if (!fs.existsSync(uploadsDir)) {
      res.status(400).send('Pasta de uploads nao existe');
      return;
    }

    const files = fs.readdirSync(uploadsDir);
    if (files.length === 0) {
      res.status(400).send('Nenhum documento foi enviado ainda.');
      return;
    }`
);

fs.writeFileSync('src/upload/upload.controller.ts', code, 'utf8');
console.log('done');
