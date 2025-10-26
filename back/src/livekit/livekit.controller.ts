import { Controller, Get, Query } from '@nestjs/common';
import { LivekitService } from './livekit.service';

interface TokenQuery {
  id: string;
  name: string;
}

@Controller('livekit')
export class LivekitController {
  constructor(private readonly livekitService: LivekitService) {}

  @Get('token')
  async getToken(@Query() query: TokenQuery) {
    const { id: userIdentity, name: userName } = query;

    const token = await this.livekitService.generateToken(
      userIdentity,
      userName,
    );
    return { token: token };
  }
}
