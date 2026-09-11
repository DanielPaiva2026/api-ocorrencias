const fs = require('fs');
let code = fs.readFileSync('prisma/schema.prisma', 'utf8');
code = code.replace(/datasource db \{\s*provider = "postgresql"\s*\}/, 'datasource db {\n  provider = "postgresql"\n  url = env("DATABASE_URL")\n}');
fs.writeFileSync('prisma/schema.prisma', code, 'utf8');
