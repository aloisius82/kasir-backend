export const jwtConstants = {
    // secret: 'kasir secret key'
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN
}
