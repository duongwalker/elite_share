import dotenv from 'dotenv'
dotenv.config()


let ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
let REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET


type Config = {
    ACCESS_TOKEN_SECRET?: string,
    REFRESH_TOKEN_SECRET?: string,

}

const config: Config = {
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET
}

export default config;