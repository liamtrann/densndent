// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: "https://dev-t4rfoykvilkxt4zn.us.auth0.com/api/v2/",
      issuer: `https://dev-t4rfoykvilkxt4zn.us.auth0.com/`,
      algorithms: ['RS256'],
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://dev-t4rfoykvilkxt4zn.us.auth0.com/.well-known/jwks.json`,
      }) as any, // force compatibility
    });
  }

  async validate(payload: any) {
    return payload; // becomes req.user
  }
}
