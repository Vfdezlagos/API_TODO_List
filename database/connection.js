import mongoose from "mongoose";
import config from "../config.js";

const connection = async() => {
    try{
        await mongoose.connect(config.DBUrl);
        console.log('Database TODO-list-api Connected!');
    }catch(exception){
        console.log(exception)
        throw new Error('No se ha establecido la conexion a la DB')
    }
}

export default connection;