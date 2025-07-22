import { profile } from "console";


const Images = {
    logo : require('../assets/images/logo.png'),
    logo_transparent : require('../assets/images/logo_transparent.png'),
    profile : require('../assets/images/profile.png'),
}

export default Images;

export type ImageNames = keyof typeof Images;