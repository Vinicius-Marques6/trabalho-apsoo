import { Injectable } from '@nestjs/common';
import { AccessToken } from 'livekit-server-sdk';

@Injectable()
export class LivekitService {
  private readonly livekitApiKey = 'devkey';
  private readonly livekitApiSecret = 'secret';

  generateToken(identity: string, name: string): Promise<string> {
    const roomName = 'defaultRoom';

    const at = new AccessToken(this.livekitApiKey, this.livekitApiSecret, {
      identity: identity,
      name: name,
    });

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

    return at.toJwt();
  }
}
