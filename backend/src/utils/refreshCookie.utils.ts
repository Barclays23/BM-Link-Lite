import type {
  Response as ExpressResponse,
} from 'express';


const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ('none' as const) : ('lax' as const),
//   sameSite: isProduction ? 'none' : 'lax',
  path: '/',
};

export const setRefreshTokenCookie = (res: ExpressResponse, token: string): void => {
    res.cookie('refreshToken', token, {
        ...cookieOptions,
        maxAge: 10 * 60 * 60 * 1000,
    });
};

export const clearRefreshTokenCookie = (res: ExpressResponse): void => {
    // res.clearCookie('refreshToken', cookieOptions);
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
    });
};