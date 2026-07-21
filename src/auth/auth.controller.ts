import { Controller, Post, Body, HttpCode, HttpStatus, Patch, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body.email, body.senha);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('trocar-senha')
  trocarSenha(@Request() req: any, @Body() body: any) {
    return this.authService.trocarSenha(req.user.id, body.novaSenha);
  }
}
