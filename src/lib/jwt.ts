const SECRET_KEY = 'Deliveryappsecretkey918273';

import jwt from 'jsonwebtoken';
class JWT {
    private secretKey = SECRET_KEY as string;

    sign(data: any): string {
        return jwt.sign({ user: data.user}, this.secretKey, { expiresIn: "25d"});
    }

    verify(token: string): string {
        try {
            return jwt.verify(token, this.secretKey) as string;
        } catch (e) {
            return 'La autenticación del token es inválida. Por favor, inicia sesión para obtener un nuevo token';
        }
    }
}

export default JWT;