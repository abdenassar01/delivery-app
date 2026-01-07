import { betterAuth } from 'better-auth/minimal';
import { createClient } from '@convex-dev/better-auth';
import { convex, crossDomain } from '@convex-dev/better-auth/plugins';
import { expo } from '@better-auth/expo';
import authConfig from './auth.config';
import { components, internal } from './_generated/api';
import { query } from './_generated/server';
import type { AuthFunctions, GenericCtx } from '@convex-dev/better-auth';
import type { DataModel } from './_generated/dataModel';
// import { requireActionCtx } from '@convex-dev/better-auth/utils';
// import { captcha } from 'better-auth/plugins';

const siteUrl = process.env.SITE_URL!;
const authFunctions: AuthFunctions = internal.auth;

export const authComponent = createClient<DataModel>(components.betterAuth, {
  authFunctions,
  triggers: {
    user: {
      onCreate: async (ctx, authUser) => {
        await ctx.db.insert('users', {
          email: authUser.email,
          role: 'user',
          balance: 0,
          userId: authUser._id,
          name: authUser.name,
          isVerified: false,
          isEnabled: true,
        });
      },
    },
  },
});

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    cors: {
      origin: [
        siteUrl,
        ...(process.env.NODE_ENV === 'development'
          ? [
              'http://localhost:8081',
              'http://localhost:8082',
              'http://localhost:19006',
              'http://127.0.0.1:8081',
              'http://127.0.0.1:8082',
              'http://127.0.0.1:19006',
            ]
          : []),
      ],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
    trustedOrigins: [
      siteUrl,
      'tdelivery://',
      'tdelivery-prod://',
      'tdelivery-staging://',
      ...(process.env.NODE_ENV === 'development'
        ? [
            'http://localhost:8081',
            'http://localhost:8082',
            'http://localhost:19006',
            'http://127.0.0.1:8081',
            'http://127.0.0.1:8082',
            'http://127.0.0.1:19006',
          ]
        : []),
      'tdelivery://*',
      ...(process.env.NODE_ENV === 'development'
        ? ['exp://', 'exp://**', 'exp://192.168.*.*:*/**']
        : []),
    ],
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    sendVerificationEmail: async ({ user, url }: any) => {
      // await resend.sendEmail(requireActionCtx(ctx), {
      //   from: 'Me <sender@platform.mediabenotman.com>',
      //   to: user?.email!,
      //   subject: `MEDIABENOTMAN | Verify your email address`,
      //   template: {
      //     id: 'verify-email',
      //     variables: {
      //       name: user.name!,
      //       url,
      //     },
      //   },
      // });
    },
    sendResetPassword: async ({ user, url }: any) => {
      // await resend.sendEmail(requireActionCtx(ctx), {
      //   from: 'Me <sender@platform.mediabenotman.com>',
      //   to: user?.email!,
      //   subject: `MEDIABENOTMAN | Reset your password`,
      //   template: {
      //     id: 'reset-password',
      //     variables: {
      //       name: user.name!,
      //       url,
      //     },
      //   },
      // });
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      sendResetPasswordToken: true,
      sendVerificationEmail: false,
      tokenExpiresIn: {
        emailVerification: 24 * 60 * 60,
        resetPassword: 60 * 60,
      },
    },
    appName: 'TDelivery',
    plugins: [
      convex({ authConfig }),
      expo(),

      // crossDomain({ siteUrl }),
      // captcha({
      //   provider: 'cloudflare-turnstile',
      //   secretKey: process.env.TURNSTILE_SECRET_KEY!,
      // }),
    ],
  });
};

export const getCurrentUser = query({
  args: {},
  handler: async ctx => {
    return await authComponent.getAuthUser(ctx);
  },
});

export const { onCreate } = authComponent.triggersApi();
