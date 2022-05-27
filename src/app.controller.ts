import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/.well-known/pki-validation/010E487D5E54DDAB56FEEBAF2F4EAB37.txt')
  wellknown(@Res() res : any){
    res.sendFile(__dirname + '/.well-known/pki-validation/010E487D5E54DDAB56FEEBAF2F4EAB37.txt');
  }
}

