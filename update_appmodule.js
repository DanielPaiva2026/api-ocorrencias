const fs = require('fs');
const file = 'src/app.module.ts';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('UploadModule')) {
  code = "import { UploadModule } from './upload/upload.module';\nimport { ServeStaticModule } from '@nestjs/serve-static';\nimport { join } from 'path';\n" + code;
  
  code = code.replace(/imports: \[/, `imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    UploadModule,`);
  
  fs.writeFileSync(file, code);
  console.log('AppModule updated');
} else {
  console.log('AppModule already has UploadModule');
}
